import asyncio
import contextlib
import errno
import json
import os
import pty
import secrets
import signal
import struct
import termios
import time
from collections import defaultdict, deque
from dataclasses import dataclass, field
from urllib.parse import urlparse

from aiohttp import WSMsgType, web

PORT = int(os.getenv('PORT', '3020'))
HOST = os.getenv('HOST', '127.0.0.1')
PUBLIC_BASE_URL = os.getenv('PUBLIC_BASE_URL', 'https://vm2.amineessahfi.xyz/sandbox-api').rstrip('/')
SANDBOX_IMAGE = os.getenv('SANDBOX_IMAGE', 'essahfi-terminal-sandbox:latest')
SESSION_SECONDS = int(os.getenv('SESSION_SECONDS', '300'))
CONNECT_WINDOW_SECONDS = int(os.getenv('CONNECT_WINDOW_SECONDS', '60'))
MAX_SESSIONS_PER_HOUR = int(os.getenv('MAX_SESSIONS_PER_HOUR', '3'))
MAX_CONCURRENT_PER_IP = int(os.getenv('MAX_CONCURRENT_PER_IP', '1'))

DEFAULT_ALLOWED_ORIGIN_PATTERNS = [
    'https://*.vercel.app',
    'https://amineessahfi.xyz',
    'https://*.amineessahfi.xyz',
    'https://aessahfi.xyz',
    'https://www.aessahfi.xyz',
    'http://localhost:*',
    'http://127.0.0.1:*',
]
ALLOWED_ORIGIN_PATTERNS = [
    pattern.strip()
    for pattern in os.getenv('ALLOWED_ORIGIN_PATTERNS', ','.join(DEFAULT_ALLOWED_ORIGIN_PATTERNS)).split(',')
    if pattern.strip()
]


@dataclass
class Session:
    session_id: str
    token: str
    client_ip: str
    created_at: float
    cols: int = 120
    rows: int = 30
    status: str = 'created'
    connected_at: float | None = None
    expires_at: float | None = None
    closed: bool = False
    end_reason: str | None = None
    container_name: str | None = None
    process: asyncio.subprocess.Process | None = None
    master_fd: int | None = None
    slave_fd: int | None = None
    websocket: web.WebSocketResponse | None = None
    output_task: asyncio.Task | None = None
    process_task: asyncio.Task | None = None
    expiry_task: asyncio.Task | None = None
    connect_timeout_task: asyncio.Task | None = None
    output_queue: asyncio.Queue = field(default_factory=asyncio.Queue)
    cleanup_lock: asyncio.Lock = field(default_factory=asyncio.Lock)


def matches_origin_pattern(origin: str, pattern: str) -> bool:
    wildcard_port = pattern.endswith(':*')
    sanitized_pattern = pattern[:-2] if wildcard_port else pattern

    try:
        origin_parts = urlparse(origin)
        pattern_parts = urlparse(sanitized_pattern)
    except ValueError:
        return False

    if origin_parts.scheme != pattern_parts.scheme:
        return False

    origin_host = origin_parts.hostname or ''
    pattern_host = pattern_parts.hostname or ''

    if pattern_host.startswith('*.'):
        if not origin_host.endswith(pattern_host[1:]):
            return False
    elif origin_host != pattern_host:
        return False

    pattern_port = pattern_parts.port
    origin_port = origin_parts.port

    if wildcard_port:
        return True

    if pattern_port is None:
        return origin_port in (None, 80, 443)

    return origin_port == pattern_port


def origin_allowed(origin: str | None) -> bool:
    if not origin:
        return True
    return any(matches_origin_pattern(origin, pattern) for pattern in ALLOWED_ORIGIN_PATTERNS)


def get_client_ip(request: web.Request) -> str:
    forwarded_for = request.headers.get('X-Forwarded-For')
    if forwarded_for:
        return forwarded_for.split(',')[0].strip()
    peer = request.transport.get_extra_info('peername')
    if isinstance(peer, tuple) and peer:
        return peer[0]
    return 'unknown'


def set_winsize(master_fd: int, rows: int, cols: int) -> None:
    import fcntl

    winsize = struct.pack('HHHH', rows, cols, 0, 0)
    fcntl.ioctl(master_fd, termios.TIOCSWINSZ, winsize)


def build_docker_command(session: Session) -> list[str]:
    container_name = f'sandbox-{session.session_id}'
    session.container_name = container_name

    return [
        'docker',
        'run',
        '--rm',
        '--interactive',
        '--tty',
        '--name',
        container_name,
        '--hostname',
        container_name,
        '--network',
        'none',
        '--read-only',
        '--tmpfs',
        '/tmp:rw,noexec,nosuid,size=64m',
        '--tmpfs',
        '/home/sandbox:rw,nosuid,size=64m,uid=1000,gid=1000,mode=700',
        '--pids-limit',
        '128',
        '--memory',
        '256m',
        '--cpus',
        '0.50',
        '--ulimit',
        'nofile=1024:1024',
        '--security-opt',
        'no-new-privileges:true',
        '--cap-drop',
        'ALL',
        '--env',
        f'SESSION_SECONDS={SESSION_SECONDS}',
        '--env',
        'TERM=xterm-256color',
        '--env',
        'HOME=/home/sandbox',
        '--env',
        'SANDBOX_PS1=sandbox@essahfi:\\w\\$ ',
        SANDBOX_IMAGE,
    ]


async def remove_container(container_name: str | None) -> None:
    if not container_name:
        return
    process = await asyncio.create_subprocess_exec(
        'docker',
        'rm',
        '-f',
        container_name,
        stdout=asyncio.subprocess.DEVNULL,
        stderr=asyncio.subprocess.DEVNULL,
    )
    await process.wait()


async def send_json_if_open(session: Session, payload: dict) -> None:
    if session.websocket and not session.websocket.closed:
        await session.websocket.send_json(payload)


def prune_rate_limit(app: web.Application, ip_address: str) -> deque:
    history = app['rate_limit'][ip_address]
    cutoff = time.time() - 3600
    while history and history[0] < cutoff:
        history.popleft()
    return history


def active_sessions_for_ip(app: web.Application, ip_address: str) -> int:
    return sum(
        1
        for session in app['sessions'].values()
        if session.client_ip == ip_address and session.status in {'created', 'starting', 'active'}
    )


def queue_pty_output(app: web.Application, session: Session) -> None:
    if session.master_fd is None or session.closed:
        return

    while True:
        try:
            data = os.read(session.master_fd, 4096)
        except BlockingIOError:
            break
        except OSError as exc:
            if exc.errno == errno.EIO:
                asyncio.get_running_loop().create_task(cleanup_session(app, session, 'Sandbox session closed.'))
                break
            raise

        if not data:
            asyncio.get_running_loop().create_task(cleanup_session(app, session, 'Sandbox session ended.'))
            break

        session.output_queue.put_nowait(data.decode('utf-8', 'ignore'))


async def stream_output(session: Session) -> None:
    try:
        while True:
            chunk = await session.output_queue.get()
            if chunk is None:
                break
            await send_json_if_open(session, {'type': 'output', 'data': chunk})
    except asyncio.CancelledError:
        raise


async def wait_for_process(app: web.Application, session: Session) -> None:
    if not session.process:
        return
    return_code = await session.process.wait()
    if not session.closed:
        await cleanup_session(app, session, f'Sandbox session ended with exit code {return_code}.')


async def expire_session(app: web.Application, session: Session, delay: int, message: str) -> None:
    await asyncio.sleep(delay)
    if not session.closed:
        await cleanup_session(app, session, message)


async def start_session(app: web.Application, session: Session) -> None:
    loop = asyncio.get_running_loop()
    master_fd, slave_fd = pty.openpty()
    os.set_blocking(master_fd, False)
    session.master_fd = master_fd
    session.slave_fd = slave_fd
    session.status = 'starting'
    set_winsize(master_fd, session.rows, session.cols)

    command = build_docker_command(session)
    process = await asyncio.create_subprocess_exec(
        *command,
        stdin=slave_fd,
        stdout=slave_fd,
        stderr=slave_fd,
        start_new_session=True,
    )
    session.process = process
    os.close(slave_fd)
    session.slave_fd = None

    loop.add_reader(master_fd, queue_pty_output, app, session)
    session.output_task = asyncio.create_task(stream_output(session))
    session.process_task = asyncio.create_task(wait_for_process(app, session))
    session.expiry_task = asyncio.create_task(
        expire_session(app, session, SESSION_SECONDS, 'Sandbox expired after 5 minutes.')
    )
    session.connected_at = time.time()
    session.expires_at = session.connected_at + SESSION_SECONDS
    session.status = 'active'

    await send_json_if_open(
        session,
        {
            'type': 'ready',
            'sessionId': session.session_id,
            'expiresAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(session.expires_at)),
        },
    )


async def cleanup_session(app: web.Application, session: Session, reason: str) -> None:
    async with session.cleanup_lock:
        if session.closed:
            return

        session.closed = True
        session.status = 'closed'
        session.end_reason = reason
        app['sessions'].pop(session.session_id, None)

        current_task = asyncio.current_task()
        loop = asyncio.get_running_loop()

        if session.master_fd is not None:
            with contextlib.suppress(Exception):
                loop.remove_reader(session.master_fd)

        for task in (session.connect_timeout_task, session.expiry_task, session.process_task):
            if task and task is not current_task:
                task.cancel()

        if session.process and session.process.returncode is None:
            with contextlib.suppress(ProcessLookupError):
                session.process.send_signal(signal.SIGTERM)
            with contextlib.suppress(asyncio.TimeoutError):
                await asyncio.wait_for(session.process.wait(), timeout=2)
            if session.process.returncode is None:
                with contextlib.suppress(ProcessLookupError):
                    session.process.kill()
                with contextlib.suppress(Exception):
                    await session.process.wait()

        await remove_container(session.container_name)

        if session.master_fd is not None:
            with contextlib.suppress(OSError):
                os.close(session.master_fd)
            session.master_fd = None

        if session.slave_fd is not None:
            with contextlib.suppress(OSError):
                os.close(session.slave_fd)
            session.slave_fd = None

        if session.output_task and session.output_task is not current_task:
            session.output_queue.put_nowait(None)
            with contextlib.suppress(asyncio.CancelledError):
                await session.output_task

        await send_json_if_open(session, {'type': 'system', 'message': reason, 'closed': True})
        if session.websocket and not session.websocket.closed:
            with contextlib.suppress(Exception):
                await session.websocket.close()


@web.middleware
async def cors_middleware(request: web.Request, handler):
    origin = request.headers.get('Origin')
    if origin and not origin_allowed(origin):
        return web.json_response({'error': 'Origin not allowed.'}, status=403)

    if request.method == 'OPTIONS':
        response = web.Response(status=204)
    else:
        response = await handler(request)

    if origin and origin_allowed(origin):
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Vary'] = 'Origin'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


async def health(request: web.Request) -> web.Response:
    app = request.app
    return web.json_response(
        {
            'status': 'ok',
            'sessions': len(app['sessions']),
            'image': SANDBOX_IMAGE,
        }
    )


async def create_session(request: web.Request) -> web.Response:
    app = request.app
    client_ip = get_client_ip(request)
    history = prune_rate_limit(app, client_ip)

    if len(history) >= MAX_SESSIONS_PER_HOUR:
        return web.json_response(
            {'error': 'Rate limit exceeded for sandbox sessions. Please try again later.'},
            status=429,
        )

    if active_sessions_for_ip(app, client_ip) >= MAX_CONCURRENT_PER_IP:
        return web.json_response(
            {'error': 'Only one active sandbox session per visitor is allowed.'},
            status=429,
        )

    session_id = secrets.token_urlsafe(9)
    token = secrets.token_urlsafe(24)
    session = Session(session_id=session_id, token=token, client_ip=client_ip, created_at=time.time())
    app['sessions'][session_id] = session
    history.append(time.time())
    session.connect_timeout_task = asyncio.create_task(
        expire_session(app, session, CONNECT_WINDOW_SECONDS, 'Sandbox request expired before connection.')
    )

    base_ws_url = PUBLIC_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://')
    ws_url = f'{base_ws_url}/ws?sessionId={session_id}&token={token}'

    return web.json_response(
        {
            'sessionId': session_id,
            'token': token,
            'wsUrl': ws_url,
            'connectWindowSeconds': CONNECT_WINDOW_SECONDS,
            'sessionSeconds': SESSION_SECONDS,
            'restrictions': [
                'No outbound network',
                'Read-only base filesystem',
                'Non-root user',
                'Automatic expiration after 5 minutes',
            ],
        }
    )


async def websocket_handler(request: web.Request) -> web.WebSocketResponse:
    app = request.app
    session_id = request.query.get('sessionId', '')
    token = request.query.get('token', '')
    session = app['sessions'].get(session_id)

    if not session or session.token != token:
        raise web.HTTPUnauthorized(text='Invalid sandbox session.')

    if session.websocket and not session.websocket.closed:
        raise web.HTTPConflict(text='Sandbox session is already connected.')

    websocket = web.WebSocketResponse(heartbeat=30)
    await websocket.prepare(request)
    session.websocket = websocket

    if session.connect_timeout_task:
        session.connect_timeout_task.cancel()

    try:
        try:
            await start_session(app, session)
        except Exception:
            await send_json_if_open(
                session,
                {
                    'type': 'system',
                    'message': 'Sandbox backend could not start the container session.',
                    'closed': True,
                },
            )
            await cleanup_session(app, session, 'Sandbox backend failed to start the container session.')
            return websocket

        async for message in websocket:
            if message.type == WSMsgType.TEXT:
                try:
                    payload = json.loads(message.data)
                except json.JSONDecodeError:
                    continue

                message_type = payload.get('type')
                if message_type == 'input' and session.master_fd is not None:
                    os.write(session.master_fd, payload.get('data', '').encode())
                elif message_type == 'resize' and session.master_fd is not None:
                    cols = max(40, min(int(payload.get('cols', 120)), 220))
                    rows = max(12, min(int(payload.get('rows', 30)), 80))
                    session.cols = cols
                    session.rows = rows
                    set_winsize(session.master_fd, rows, cols)
                elif message_type == 'terminate':
                    await cleanup_session(app, session, 'Sandbox session terminated by the client.')
            elif message.type in {WSMsgType.ERROR, WSMsgType.CLOSE, WSMsgType.CLOSING}:
                break
    finally:
        if not session.closed:
            await cleanup_session(app, session, 'Sandbox session disconnected.')

    return websocket


def create_app() -> web.Application:
    app = web.Application(middlewares=[cors_middleware])
    app['sessions'] = {}
    app['rate_limit'] = defaultdict(deque)
    app.add_routes(
        [
            web.get('/health', health),
            web.post('/sessions', create_session),
            web.options('/sessions', create_session),
            web.get('/ws', websocket_handler),
        ]
    )
    return app


if __name__ == '__main__':
    web.run_app(create_app(), host=HOST, port=PORT)
