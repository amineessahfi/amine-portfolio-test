import asyncio
import base64
import contextlib
import errno
import hashlib
import hmac
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
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

from aiohttp import BasicAuth, ClientSession, WSMsgType, web

from aws_demo_control import AwsDemoControlError, AwsDemoManager, DemoControlSettings


def env_flag(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {'1', 'true', 'yes', 'on'}


def public_origin_from_url(value: str, fallback: str) -> str:
    parsed = urlparse(value)
    if parsed.scheme and parsed.netloc:
        return f'{parsed.scheme}://{parsed.netloc}'.rstrip('/')
    return fallback.rstrip('/')


def normalize_public_path(value: str | None, default: str) -> str:
    candidate = str(value or default).strip()
    if not candidate:
        candidate = default
    if not candidate.startswith('/'):
        candidate = f'/{candidate}'
    if not candidate.endswith('/'):
        candidate = f'{candidate}/'
    return candidate


PORT = int(os.getenv('PORT', '3020'))
HOST = os.getenv('HOST', '127.0.0.1')
PUBLIC_BASE_URL = os.getenv('PUBLIC_BASE_URL', 'https://vm2.amineessahfi.xyz/sandbox-api').rstrip('/')
PUBLIC_ORIGIN = public_origin_from_url(PUBLIC_BASE_URL, 'https://vm2.amineessahfi.xyz')
WORKFLOW_STUDIO_PATH = normalize_public_path(os.getenv('WORKFLOW_STUDIO_PATH'), '/workflow-studio/')
WORKFLOW_STUDIO_URL = os.getenv('WORKFLOW_STUDIO_URL', f'{PUBLIC_ORIGIN}{WORKFLOW_STUDIO_PATH}').rstrip('/') + '/'
WORKFLOW_STUDIO_ENABLED = env_flag('WORKFLOW_STUDIO_ENABLED', True)
SANDBOX_IMAGE = os.getenv('SANDBOX_IMAGE', 'essahfi-terminal-sandbox:latest')
SESSION_SECONDS = int(os.getenv('SESSION_SECONDS', '300'))
WORKFLOW_STUDIO_SESSION_SECONDS = int(os.getenv('WORKFLOW_STUDIO_SESSION_SECONDS', str(SESSION_SECONDS)))
CONNECT_WINDOW_SECONDS = int(os.getenv('CONNECT_WINDOW_SECONDS', '60'))
MAX_SESSIONS_PER_HOUR = int(os.getenv('MAX_SESSIONS_PER_HOUR', '3'))
MAX_CONCURRENT_PER_IP = int(os.getenv('MAX_CONCURRENT_PER_IP', '1'))
MAX_GLOBAL_CONCURRENT = int(os.getenv('MAX_GLOBAL_CONCURRENT', '4'))
FREE_ANONYMOUS_SESSIONS = int(os.getenv('FREE_ANONYMOUS_SESSIONS', '1'))
VISITOR_COOKIE_NAME = os.getenv('VISITOR_COOKIE_NAME', 'sandbox_visitor')
AUTH_COOKIE_NAME = os.getenv('AUTH_COOKIE_NAME', 'sandbox_auth')
WORKFLOW_STUDIO_COOKIE_NAME = os.getenv('WORKFLOW_STUDIO_COOKIE_NAME', 'sandbox_studio')
AUTH_COOKIE_MAX_AGE = int(os.getenv('AUTH_COOKIE_MAX_AGE', str(60 * 60 * 24 * 14)))
AUTH_COOKIE_SECRET = os.getenv('AUTH_COOKIE_SECRET') or secrets.token_hex(32)
N8N_DEMO_BASIC_AUTH_USER = os.getenv('N8N_DEMO_BASIC_AUTH_USER', 'studio').strip()
N8N_DEMO_BASIC_AUTH_PASSWORD = os.getenv('N8N_DEMO_BASIC_AUTH_PASSWORD', '').strip()
N8N_DEMO_LOGIN_EMAIL = os.getenv('N8N_DEMO_LOGIN_EMAIL', 'studio-demo@local.invalid').strip()
N8N_DEMO_LOGIN_PASSWORD = os.getenv('N8N_DEMO_LOGIN_PASSWORD', '').strip()
N8N_DEMO_LOGIN_URL = os.getenv('N8N_DEMO_LOGIN_URL', 'http://127.0.0.1:5679/rest/login').strip()
GOOGLE_OAUTH_CLIENT_ID = os.getenv('GOOGLE_OAUTH_CLIENT_ID', '').strip()
GOOGLE_OAUTH_CLIENT_SECRET = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET', '').strip()
GOOGLE_OAUTH_SCOPE = os.getenv('GOOGLE_OAUTH_SCOPE', 'openid email').strip()
GOOGLE_OAUTH_REDIRECT_URL = os.getenv('GOOGLE_OAUTH_REDIRECT_URL', f'{PUBLIC_BASE_URL}/auth/google/callback').rstrip('/')
GOOGLE_OAUTH_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
GOOGLE_OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_OAUTH_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo'

DEFAULT_ALLOWED_ORIGIN_PATTERNS = [
    'https://amine-portfolio-test.vercel.app',
    'https://amine-portfolio-test-8ggn.vercel.app',
    'https://amine-portfolio-test-cfi3.vercel.app',
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
DEFAULT_FRONTEND_ORIGIN = os.getenv('DEFAULT_FRONTEND_ORIGIN', 'https://amine-portfolio-test.vercel.app').rstrip('/')
AWS_DEMO_COOKIE_NAME = os.getenv('AWS_DEMO_COOKIE_NAME', 'sandbox_aws_demo')
AWS_DEMO_PUBLIC_ENABLED = env_flag('AWS_DEMO_PUBLIC_ENABLED', False)
AWS_DEMO_PUBLIC_SPEC_NAME = os.getenv('AWS_DEMO_PUBLIC_SPEC_NAME', 'lowcost-data-platform').strip() or 'lowcost-data-platform'
AWS_DEMO_PUBLIC_TTL_MINUTES = max(1, int(os.getenv('AWS_DEMO_PUBLIC_TTL_MINUTES', '10')))
AWS_DEMO_PUBLIC_MAX_ACTIVE = max(1, int(os.getenv('AWS_DEMO_PUBLIC_MAX_ACTIVE', '1')))
AWS_DEMO_PUBLIC_MAX_LAUNCHES_PER_HOUR = max(1, int(os.getenv('AWS_DEMO_PUBLIC_MAX_LAUNCHES_PER_HOUR', '2')))
PROTECTED_ORIGIN_PATHS = {
    '/sessions',
    '/ws',
    '/auth/status',
    '/auth/logout',
    '/aws-demo/live/status',
    '/aws-demo/live/launch',
    '/aws-demo/live/destroy',
}
ACTIVE_SESSION_STATUSES = {'created', 'starting', 'active'}
AWS_DEMO_ADMIN_HEADER = 'X-Demo-Admin-Token'


@dataclass
class Session:
    session_id: str
    token: str
    client_ip: str
    created_at: float
    visitor_id: str = 'unknown'
    auth_user: str | None = None
    auth_provider: str | None = None
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


def google_oauth_configuration_error() -> str | None:
    if not GOOGLE_OAUTH_CLIENT_ID or not GOOGLE_OAUTH_CLIENT_SECRET:
        return 'missing_credentials'

    if not GOOGLE_OAUTH_CLIENT_ID.endswith('.apps.googleusercontent.com'):
        return 'invalid_google_web_client'

    return None


def google_oauth_enabled() -> bool:
    return google_oauth_configuration_error() is None


def audit_log(event: str, **fields) -> None:
    payload = {
        'event': event,
        'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
    }
    payload.update({key: value for key, value in fields.items() if value is not None})
    print(json.dumps(payload, separators=(',', ':'), sort_keys=True), flush=True)


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


def origin_allowed(origin: str | None, *, require_origin: bool = False) -> bool:
    if not origin:
        return not require_origin
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


def prune_named_rate_limit(app: web.Application, key: str, ip_address: str) -> deque:
    history = app[key][ip_address]
    cutoff = time.time() - 3600
    while history and history[0] < cutoff:
        history.popleft()
    return history


def active_sessions_for_ip(app: web.Application, ip_address: str) -> int:
    return sum(
        1
        for session in app['sessions'].values()
        if session.client_ip == ip_address and session.status in ACTIVE_SESSION_STATUSES
    )


def active_sessions_count(app: web.Application) -> int:
    return sum(
        1
        for session in app['sessions'].values()
        if session.status in ACTIVE_SESSION_STATUSES
    )


def sign_payload(payload: dict) -> str:
    serialized = json.dumps(payload, separators=(',', ':'), sort_keys=True).encode('utf-8')
    encoded = base64.urlsafe_b64encode(serialized).decode('utf-8').rstrip('=')
    signature = hmac.new(AUTH_COOKIE_SECRET.encode('utf-8'), encoded.encode('utf-8'), hashlib.sha256).hexdigest()
    return f'{encoded}.{signature}'


def read_signed_payload(token: str | None) -> dict | None:
    if not token or '.' not in token:
        return None

    encoded, signature = token.rsplit('.', 1)
    expected = hmac.new(AUTH_COOKIE_SECRET.encode('utf-8'), encoded.encode('utf-8'), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        return None

    padding = '=' * (-len(encoded) % 4)
    try:
        decoded = base64.urlsafe_b64decode(f'{encoded}{padding}'.encode('utf-8'))
        payload = json.loads(decoded.decode('utf-8'))
    except (ValueError, json.JSONDecodeError):
        return None

    return payload if isinstance(payload, dict) else None


def new_visitor_state() -> dict:
    return {
        'visitor_id': secrets.token_urlsafe(18),
        'anonymous_sessions_used': 0,
    }


def get_visitor_state(request: web.Request) -> tuple[dict, bool]:
    payload = read_signed_payload(request.cookies.get(VISITOR_COOKIE_NAME))
    if not payload:
        return new_visitor_state(), True

    visitor_id = str(payload.get('visitor_id') or secrets.token_urlsafe(18))
    try:
        anonymous_sessions_used = max(0, int(payload.get('anonymous_sessions_used', 0)))
    except (TypeError, ValueError):
        anonymous_sessions_used = 0

    normalized = {
        'visitor_id': visitor_id,
        'anonymous_sessions_used': anonymous_sessions_used,
    }
    return normalized, normalized != payload


def get_auth_identity(request: web.Request) -> dict | None:
    payload = read_signed_payload(request.cookies.get(AUTH_COOKIE_NAME))
    if not payload:
        return None

    try:
        expiry = int(payload.get('exp', 0))
    except (TypeError, ValueError):
        return None

    if expiry <= int(time.time()):
        return None

    if not payload.get('sub'):
        return None

    return payload


def get_workflow_studio_lease(request: web.Request, *, visitor_state: dict | None = None) -> dict | None:
    payload = read_signed_payload(request.cookies.get(WORKFLOW_STUDIO_COOKIE_NAME))
    if not payload:
        return None

    try:
        expiry = int(payload.get('exp', 0))
    except (TypeError, ValueError):
        return None

    if expiry <= int(time.time()):
        return None

    if payload.get('scope') != 'workflow_studio':
        return None

    if visitor_state and payload.get('visitor_id') != visitor_state.get('visitor_id'):
        return None

    return payload


def set_signed_cookie(
    response: web.StreamResponse,
    cookie_name: str,
    payload: dict,
    *,
    max_age: int,
    path: str = '/',
) -> None:
    response.set_cookie(
        cookie_name,
        sign_payload(payload),
        max_age=max_age,
        secure=True,
        httponly=True,
        samesite='None',
        path=path,
    )


def set_visitor_cookie(response: web.StreamResponse, visitor_state: dict) -> None:
    set_signed_cookie(response, VISITOR_COOKIE_NAME, visitor_state, max_age=60 * 60 * 24 * 365)


def set_auth_cookie(response: web.StreamResponse, auth_identity: dict) -> None:
    set_signed_cookie(response, AUTH_COOKIE_NAME, auth_identity, max_age=AUTH_COOKIE_MAX_AGE)


def build_workflow_studio_lease(visitor_state: dict) -> dict:
    issued_at = int(time.time())
    return {
        'scope': 'workflow_studio',
        'visitor_id': visitor_state['visitor_id'],
        'iat': issued_at,
        'exp': issued_at + WORKFLOW_STUDIO_SESSION_SECONDS,
    }


def set_workflow_studio_lease(
    response: web.StreamResponse,
    visitor_state: dict,
    *,
    lease: dict | None = None,
) -> dict:
    if lease is None:
        lease = build_workflow_studio_lease(visitor_state)

    set_signed_cookie(
        response,
        WORKFLOW_STUDIO_COOKIE_NAME,
        lease,
        max_age=WORKFLOW_STUDIO_SESSION_SECONDS,
        path=WORKFLOW_STUDIO_PATH,
    )
    return lease


def build_aws_demo_lease(visitor_state: dict, *, demo_id: str, expires_at: int) -> dict:
    issued_at = int(time.time())
    return {
        'scope': 'aws_demo',
        'visitor_id': visitor_state['visitor_id'],
        'demo_id': demo_id,
        'iat': issued_at,
        'exp': expires_at,
    }


def get_aws_demo_lease(request: web.Request, *, visitor_state: dict | None = None) -> dict | None:
    payload = read_signed_payload(request.cookies.get(AWS_DEMO_COOKIE_NAME))
    if not payload:
        return None

    try:
        expiry = int(payload.get('exp', 0))
    except (TypeError, ValueError):
        return None

    if expiry <= int(time.time()):
        return None

    if payload.get('scope') != 'aws_demo':
        return None

    if visitor_state and payload.get('visitor_id') != visitor_state.get('visitor_id'):
        return None

    if not payload.get('demo_id'):
        return None

    return payload


def set_aws_demo_lease(response: web.StreamResponse, visitor_state: dict, *, demo_id: str, expires_at: int) -> dict:
    lease = build_aws_demo_lease(visitor_state, demo_id=demo_id, expires_at=expires_at)
    set_signed_cookie(
        response,
        AWS_DEMO_COOKIE_NAME,
        lease,
        max_age=max(1, expires_at - int(time.time())),
    )
    return lease


def clear_cookie(response: web.StreamResponse, cookie_name: str, *, path: str = '/') -> None:
    response.del_cookie(
        cookie_name,
        path=path,
        secure=True,
        httponly=True,
        samesite='None',
    )


def clear_auth_cookie(response: web.StreamResponse) -> None:
    clear_cookie(response, AUTH_COOKIE_NAME)


def clear_aws_demo_cookie(response: web.StreamResponse) -> None:
    clear_cookie(response, AWS_DEMO_COOKIE_NAME)


def normalize_return_to(candidate: str | None) -> str:
    default_return_to = f'{DEFAULT_FRONTEND_ORIGIN}/services/live-terminal-sandbox#live-sandbox'

    if not candidate:
        return default_return_to

    if candidate.startswith('/') and not candidate.startswith('//'):
        return f'{DEFAULT_FRONTEND_ORIGIN}{candidate}'

    parsed = urlparse(candidate)
    origin = f'{parsed.scheme}://{parsed.netloc}'.rstrip('/')
    if parsed.scheme not in {'http', 'https'}:
        return default_return_to

    if origin_allowed(origin, require_origin=True):
        return candidate

    return default_return_to


def append_query_param(url: str, key: str, value: str) -> str:
    parsed = urlparse(url)
    query = dict(parse_qsl(parsed.query, keep_blank_values=True))
    query[key] = value
    return urlunparse(parsed._replace(query=urlencode(query)))


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

    audit_log(
        'sandbox_session_started',
        session_id=session.session_id,
        client_ip=session.client_ip,
        visitor_id=session.visitor_id,
        auth_provider=session.auth_provider,
        auth_user=session.auth_user,
    )

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

        audit_log(
            'sandbox_session_closed',
            session_id=session.session_id,
            client_ip=session.client_ip,
            visitor_id=session.visitor_id,
            auth_provider=session.auth_provider,
            auth_user=session.auth_user,
            reason=reason,
        )

        await send_json_if_open(session, {'type': 'system', 'message': reason, 'closed': True})
        if session.websocket and not session.websocket.closed:
            with contextlib.suppress(Exception):
                await session.websocket.close()


@web.middleware
async def cors_middleware(request: web.Request, handler):
    origin = request.headers.get('Origin')
    require_origin = request.path in PROTECTED_ORIGIN_PATHS

    if not origin_allowed(origin, require_origin=require_origin):
        return web.json_response({'error': 'Origin not allowed.'}, status=403)

    if request.method == 'OPTIONS':
        response = web.Response(status=204)
    else:
        response = await handler(request)

    if origin and origin_allowed(origin):
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.headers['Vary'] = 'Origin'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,DELETE,OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = f'Content-Type, {AWS_DEMO_ADMIN_HEADER}'
    return response


async def health(request: web.Request) -> web.Response:
    app = request.app
    aws_demo_manager = app['aws_demo_manager']
    return web.json_response(
        {
            'status': 'ok',
            'sessions': len(app['sessions']),
            'image': SANDBOX_IMAGE,
            'googleOAuthConfigured': google_oauth_enabled(),
            'awsDemoControlEnabled': aws_demo_manager.settings.enabled,
            'awsDemoPublicEnabled': AWS_DEMO_PUBLIC_ENABLED,
        }
    )


def require_aws_demo_admin(request: web.Request) -> AwsDemoManager:
    manager: AwsDemoManager = request.app['aws_demo_manager']
    if not manager.settings.enabled:
        raise web.HTTPServiceUnavailable(text='AWS demo control plane is disabled on this host.')

    admin_token = request.headers.get(AWS_DEMO_ADMIN_HEADER, '').strip()
    if not manager.authorize(admin_token):
        raise web.HTTPForbidden(text='Missing or invalid AWS demo admin token.')

    return manager


def aws_demo_public_guardrails() -> list[str]:
    return [
        f'One fixed AWS template only: {AWS_DEMO_PUBLIC_SPEC_NAME}.',
        f'Forced teardown after {AWS_DEMO_PUBLIC_TTL_MINUTES} minutes.',
        f'Maximum {AWS_DEMO_PUBLIC_MAX_ACTIVE} live public stack at a time.',
        'No arbitrary YAML, regions, or resource choices from the browser.',
        'Destroy control stays inside the same browser session that launched it.',
    ]


def aws_demo_public_available(manager: AwsDemoManager) -> bool:
    return manager.settings.enabled and AWS_DEMO_PUBLIC_ENABLED


def active_aws_demo_runs(manager: AwsDemoManager) -> list[dict]:
    return [run for run in manager.list_runs() if run['status'] in {'creating', 'ready'}]


def serialize_public_aws_demo_run(run: dict | None) -> dict | None:
    if not run:
        return None

    outputs = run.get('outputs') or {}
    return {
        'id': run['id'],
        'status': run['status'],
        'createdAt': run['createdAt'],
        'expiresAt': run['expiresAt'],
        'destroyedAt': run['destroyedAt'],
        'destroyReason': run.get('destroyReason'),
        'error': run.get('error'),
        'countdownSeconds': max(0, int(run['expiresAt']) - int(time.time())) if run.get('expiresAt') else 0,
        'summary': {
            'region': outputs.get('region') or run.get('region'),
            'bucketName': outputs.get('bucketName'),
            'lambdaName': outputs.get('lambdaName'),
            'eventRuleName': outputs.get('eventRuleName'),
            'glueDatabase': outputs.get('glueDatabase'),
            'glueTable': outputs.get('glueTable'),
            'athenaRowCount': outputs.get('athenaRowCount'),
        },
    }


def current_public_aws_demo_run(
    request: web.Request,
    manager: AwsDemoManager,
    *,
    visitor_state: dict,
) -> tuple[dict | None, bool]:
    lease = get_aws_demo_lease(request, visitor_state=visitor_state)
    if not lease:
        return None, False

    run = manager.get_run(str(lease.get('demo_id')))
    if not run or run['status'] == 'destroyed' or int(run.get('expiresAt') or 0) <= int(time.time()):
        return None, True
    return run, False


async def aws_demo_live_status(request: web.Request) -> web.Response:
    manager: AwsDemoManager = request.app['aws_demo_manager']
    visitor_state, refresh_visitor_cookie = get_visitor_state(request)
    current_run, clear_demo_cookie = current_public_aws_demo_run(request, manager, visitor_state=visitor_state)

    payload = {
        'enabled': AWS_DEMO_PUBLIC_ENABLED,
        'available': aws_demo_public_available(manager),
        'launchTtlMinutes': AWS_DEMO_PUBLIC_TTL_MINUTES,
        'maxActiveRuns': AWS_DEMO_PUBLIC_MAX_ACTIVE,
        'guardrails': aws_demo_public_guardrails(),
        'activeRun': serialize_public_aws_demo_run(current_run),
        'reason': ''
        if aws_demo_public_available(manager)
        else (
            'The public AWS demo launcher is disabled on this host.'
            if not AWS_DEMO_PUBLIC_ENABLED
            else 'The AWS demo runtime is not armed yet on vm2.'
        ),
    }
    response = web.json_response(payload)
    if refresh_visitor_cookie:
        set_visitor_cookie(response, visitor_state)
    if clear_demo_cookie:
        clear_aws_demo_cookie(response)
    return response


async def aws_demo_live_launch(request: web.Request) -> web.Response:
    manager: AwsDemoManager = request.app['aws_demo_manager']
    visitor_state, refresh_visitor_cookie = get_visitor_state(request)
    client_ip = get_client_ip(request)

    if not aws_demo_public_available(manager):
        raise web.HTTPServiceUnavailable(text='The AWS demo runtime is not armed yet on vm2.')

    current_run, clear_demo_cookie = current_public_aws_demo_run(request, manager, visitor_state=visitor_state)
    if current_run:
        return web.json_response(
            {
                'error': 'A live AWS demo is already active in this browser session.',
                'activeRun': serialize_public_aws_demo_run(current_run),
            },
            status=409,
        )

    launch_history = prune_named_rate_limit(request.app, 'aws_demo_rate_limit', client_ip)
    if len(launch_history) >= AWS_DEMO_PUBLIC_MAX_LAUNCHES_PER_HOUR:
        raise web.HTTPTooManyRequests(text='This browser has already launched the maximum AWS demos for the last hour.')

    active_runs = active_aws_demo_runs(manager)
    if len(active_runs) >= AWS_DEMO_PUBLIC_MAX_ACTIVE:
        return web.json_response(
            {'error': 'The public AWS demo is already in use. Wait for the current stack to self-destruct or destroy it first.'},
            status=503,
        )

    try:
        run = await asyncio.to_thread(manager.create_demo, AWS_DEMO_PUBLIC_SPEC_NAME, AWS_DEMO_PUBLIC_TTL_MINUTES)
    except AwsDemoControlError as exc:
        raise web.HTTPServiceUnavailable(text=str(exc)) from exc

    launch_history.append(time.time())
    response = web.json_response(
        {
            'guardrails': aws_demo_public_guardrails(),
            'activeRun': serialize_public_aws_demo_run(run),
        },
        status=201,
    )
    if refresh_visitor_cookie:
        set_visitor_cookie(response, visitor_state)
    elif clear_demo_cookie:
        clear_aws_demo_cookie(response)
    set_aws_demo_lease(response, visitor_state, demo_id=run['id'], expires_at=int(run['expiresAt']))
    audit_log('aws_demo_live_launched', demo_id=run['id'], visitor_id=visitor_state['visitor_id'], client_ip=client_ip)
    return response


async def aws_demo_live_destroy(request: web.Request) -> web.Response:
    manager: AwsDemoManager = request.app['aws_demo_manager']
    visitor_state, refresh_visitor_cookie = get_visitor_state(request)
    current_run, clear_demo_cookie = current_public_aws_demo_run(request, manager, visitor_state=visitor_state)
    if not current_run:
        response = web.json_response({'activeRun': None})
        if refresh_visitor_cookie:
            set_visitor_cookie(response, visitor_state)
        if clear_demo_cookie:
            clear_aws_demo_cookie(response)
        return response

    try:
        run = await asyncio.to_thread(manager.destroy_demo, current_run['id'], reason='browser_destroy')
    except AwsDemoControlError as exc:
        raise web.HTTPBadRequest(text=str(exc)) from exc

    response = web.json_response({'activeRun': serialize_public_aws_demo_run(run)})
    if refresh_visitor_cookie:
        set_visitor_cookie(response, visitor_state)
    clear_aws_demo_cookie(response)
    audit_log('aws_demo_live_destroyed', demo_id=run['id'], visitor_id=visitor_state['visitor_id'])
    return response


async def aws_demo_specs(request: web.Request) -> web.Response:
    manager = require_aws_demo_admin(request)
    return web.json_response({'specs': manager.list_specs()})


async def aws_demo_list_runs(request: web.Request) -> web.Response:
    manager = require_aws_demo_admin(request)
    return web.json_response({'runs': manager.list_runs()})


async def aws_demo_get_run(request: web.Request) -> web.Response:
    manager = require_aws_demo_admin(request)
    demo_id = request.match_info['demo_id']
    run = manager.get_run(demo_id)
    if not run:
        raise web.HTTPNotFound(text=f'Unknown demo run: {demo_id}')
    return web.json_response(run)


async def aws_demo_create_run(request: web.Request) -> web.Response:
    manager = require_aws_demo_admin(request)
    try:
        payload = await request.json()
    except json.JSONDecodeError as exc:
        raise web.HTTPBadRequest(text=f'Invalid JSON body: {exc.msg}') from exc

    if not isinstance(payload, dict):
        raise web.HTTPBadRequest(text='Request body must be a JSON object.')

    spec_name = str(payload.get('specName') or '').strip()
    if not spec_name:
        raise web.HTTPBadRequest(text='specName is required.')

    ttl_minutes = payload.get('ttlMinutes')
    if ttl_minutes is not None:
        try:
            ttl_minutes = int(ttl_minutes)
        except (TypeError, ValueError) as exc:
            raise web.HTTPBadRequest(text='ttlMinutes must be an integer.') from exc

    try:
        run = await asyncio.to_thread(manager.create_demo, spec_name, ttl_minutes)
    except AwsDemoControlError as exc:
        raise web.HTTPBadRequest(text=str(exc)) from exc

    audit_log('aws_demo_created', demo_id=run['id'], spec_name=run['specName'], region=run['region'])
    return web.json_response(run, status=201)


async def aws_demo_destroy_run(request: web.Request) -> web.Response:
    manager = require_aws_demo_admin(request)
    demo_id = request.match_info['demo_id']
    try:
        run = await asyncio.to_thread(manager.destroy_demo, demo_id, reason='manual')
    except AwsDemoControlError as exc:
        message = str(exc)
        if message.startswith('Unknown demo run:'):
            raise web.HTTPNotFound(text=message) from exc
        raise web.HTTPBadRequest(text=message) from exc

    audit_log('aws_demo_destroyed', demo_id=run['id'], reason=run.get('destroyReason'))
    return web.json_response(run)


async def aws_demo_cleanup_loop(app: web.Application) -> None:
    manager: AwsDemoManager = app['aws_demo_manager']
    while True:
        try:
            if manager.settings.enabled:
                expired_ids = await asyncio.to_thread(manager.cleanup_expired)
                if expired_ids:
                    audit_log('aws_demo_expired_cleanup', demo_ids=expired_ids)
            await asyncio.sleep(manager.settings.cleanup_interval_seconds)
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            audit_log('aws_demo_cleanup_failed', error=str(exc))
            await asyncio.sleep(manager.settings.cleanup_interval_seconds)


async def aws_demo_cleanup_context(app: web.Application):
    manager = AwsDemoManager(DemoControlSettings.from_env(base_dir=Path(__file__).resolve().parent))
    app['aws_demo_manager'] = manager
    cleanup_task = asyncio.create_task(aws_demo_cleanup_loop(app))
    try:
        yield
    finally:
        cleanup_task.cancel()
        with contextlib.suppress(asyncio.CancelledError):
            await cleanup_task


async def auth_status(request: web.Request) -> web.Response:
    visitor_state, refresh_visitor_cookie = get_visitor_state(request)
    auth_identity = get_auth_identity(request)
    workflow_studio_available = WORKFLOW_STUDIO_ENABLED and bool(N8N_DEMO_BASIC_AUTH_PASSWORD and N8N_DEMO_LOGIN_PASSWORD)

    response = web.json_response(
        {
            'authenticated': bool(auth_identity),
            'authConfigured': google_oauth_enabled(),
            'authConfigurationError': google_oauth_configuration_error(),
            'provider': 'google',
            'freeAnonymousSessions': FREE_ANONYMOUS_SESSIONS,
            'anonymousSessionsUsed': visitor_state['anonymous_sessions_used'],
            'user': {
                'email': auth_identity.get('email'),
                'name': auth_identity.get('name'),
            }
            if auth_identity
            else None,
            'workflowStudio': {
                'enabled': workflow_studio_available,
                'requiresAuth': False,
                'sessionSeconds': WORKFLOW_STUDIO_SESSION_SECONDS if workflow_studio_available else 0,
                'url': WORKFLOW_STUDIO_URL if workflow_studio_available else '',
            },
        }
    )

    if refresh_visitor_cookie:
        set_visitor_cookie(response, visitor_state)

    return response


async def google_oauth_start(request: web.Request) -> web.StreamResponse:
    if not google_oauth_enabled():
        raise web.HTTPServiceUnavailable(text='Google OAuth is not configured for browser sign-in.')

    return_to = normalize_return_to(request.query.get('returnTo'))
    state = sign_payload(
        {
            'iat': int(time.time()),
            'nonce': secrets.token_urlsafe(12),
            'return_to': return_to,
        }
    )

    audit_log(
        'google_oauth_start',
        client_ip=get_client_ip(request),
        return_to=return_to,
    )

    params = {
        'client_id': GOOGLE_OAUTH_CLIENT_ID,
        'redirect_uri': GOOGLE_OAUTH_REDIRECT_URL,
        'response_type': 'code',
        'scope': GOOGLE_OAUTH_SCOPE,
        'state': state,
        'access_type': 'online',
        'include_granted_scopes': 'true',
        'prompt': 'select_account',
    }

    raise web.HTTPFound(location=f'{GOOGLE_OAUTH_AUTHORIZE_URL}?{urlencode(params)}')


async def google_oauth_callback(request: web.Request) -> web.StreamResponse:
    if not google_oauth_enabled():
        raise web.HTTPServiceUnavailable(text='Google OAuth is not configured for browser sign-in.')

    state = read_signed_payload(request.query.get('state'))
    if not state:
        raise web.HTTPBadRequest(text='Invalid OAuth state.')

    try:
        issued_at = int(state.get('iat', 0))
    except (TypeError, ValueError):
        issued_at = 0

    if issued_at <= 0 or time.time() - issued_at > 600:
        raise web.HTTPBadRequest(text='OAuth state expired.')

    return_to = normalize_return_to(state.get('return_to'))
    error = request.query.get('error')
    code = request.query.get('code')

    if error or not code:
        audit_log(
            'google_oauth_failed',
            client_ip=get_client_ip(request),
            reason=error or 'missing_code',
        )
        raise web.HTTPFound(location=append_query_param(return_to, 'oauth', 'error'))

    async with ClientSession() as client_session:
        token_response = await client_session.post(
            GOOGLE_OAUTH_TOKEN_URL,
            data={
                'code': code,
                'client_id': GOOGLE_OAUTH_CLIENT_ID,
                'client_secret': GOOGLE_OAUTH_CLIENT_SECRET,
                'redirect_uri': GOOGLE_OAUTH_REDIRECT_URL,
                'grant_type': 'authorization_code',
            },
        )
        token_payload = await token_response.json()
        access_token = token_payload.get('access_token')
        if token_response.status >= 400 or not access_token:
            audit_log(
                'google_oauth_failed',
                client_ip=get_client_ip(request),
                reason='token_exchange_failed',
            )
            raise web.HTTPFound(location=append_query_param(return_to, 'oauth', 'error'))

        userinfo_response = await client_session.get(
            GOOGLE_OAUTH_USERINFO_URL,
            headers={'Authorization': f'Bearer {access_token}'},
        )
        userinfo_payload = await userinfo_response.json()
        if userinfo_response.status >= 400 or not userinfo_payload.get('sub'):
            audit_log(
                'google_oauth_failed',
                client_ip=get_client_ip(request),
                reason='userinfo_failed',
            )
            raise web.HTTPFound(location=append_query_param(return_to, 'oauth', 'error'))

    auth_identity = {
        'sub': userinfo_payload.get('sub'),
        'email': userinfo_payload.get('email'),
        'name': userinfo_payload.get('name') or userinfo_payload.get('email') or 'Google user',
        'provider': 'google',
        'exp': int(time.time()) + AUTH_COOKIE_MAX_AGE,
    }

    response = web.HTTPFound(location=append_query_param(return_to, 'oauth', 'success'))
    set_auth_cookie(response, auth_identity)

    visitor_state, _ = get_visitor_state(request)
    set_visitor_cookie(response, visitor_state)

    audit_log(
        'google_oauth_success',
        client_ip=get_client_ip(request),
        email=auth_identity.get('email'),
        sub=auth_identity.get('sub'),
    )

    return response


async def logout(request: web.Request) -> web.Response:
    auth_identity = get_auth_identity(request)
    response = web.json_response({'ok': True})
    clear_auth_cookie(response)

    audit_log(
        'google_oauth_logout',
        client_ip=get_client_ip(request),
        email=auth_identity.get('email') if auth_identity else None,
    )

    return response


async def workflow_studio_access(request: web.Request) -> web.Response:
    if not WORKFLOW_STUDIO_ENABLED:
        return web.json_response({'ok': False, 'error': 'Workflow studio is not configured.'}, status=503)

    origin = request.headers.get('Origin')
    bootstrap_requested = request.query.get('bootstrap') == '1'

    if bootstrap_requested:
        if not origin_allowed(origin, require_origin=True):
            return web.json_response({'ok': False, 'error': 'Origin not allowed.'}, status=403)

        if not N8N_DEMO_BASIC_AUTH_PASSWORD or not N8N_DEMO_LOGIN_PASSWORD:
            return web.json_response({'ok': False, 'error': 'Workflow studio guest access is not configured.'}, status=503)

        visitor_state, refresh_visitor_cookie = get_visitor_state(request)

        async with ClientSession() as client_session:
            async with client_session.post(
                N8N_DEMO_LOGIN_URL,
                auth=BasicAuth(N8N_DEMO_BASIC_AUTH_USER, N8N_DEMO_BASIC_AUTH_PASSWORD),
                json={
                    'emailOrLdapLoginId': N8N_DEMO_LOGIN_EMAIL,
                    'password': N8N_DEMO_LOGIN_PASSWORD,
                },
            ) as login_response:
                set_cookie_headers = login_response.headers.getall('Set-Cookie', [])

                if login_response.status >= 400 or not set_cookie_headers:
                    error_text = (await login_response.text()).strip()
                    audit_log(
                        'workflow_studio_bootstrap_failed',
                        client_ip=get_client_ip(request),
                        visitor_id=visitor_state['visitor_id'],
                        status=login_response.status,
                        reason=error_text[:200] or 'login_failed',
                    )
                    return web.json_response(
                        {'ok': False, 'error': 'The live workflow studio could not start a temporary session.'},
                        status=502,
                    )

        lease = build_workflow_studio_lease(visitor_state)
        response = web.json_response(
            {
                'ok': True,
                'mode': 'temporary',
                'sessionSeconds': WORKFLOW_STUDIO_SESSION_SECONDS,
                'expiresAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(lease['exp'])),
            }
        )
        set_workflow_studio_lease(response, visitor_state, lease=lease)

        for header_value in set_cookie_headers:
            response.headers.add('Set-Cookie', header_value)

        if refresh_visitor_cookie:
            set_visitor_cookie(response, visitor_state)

        response.headers['Cache-Control'] = 'no-store'

        audit_log(
            'workflow_studio_bootstrap_started',
            client_ip=get_client_ip(request),
            visitor_id=visitor_state['visitor_id'],
            expires_at=lease['exp'],
        )

        return response

    visitor_state, refresh_visitor_cookie = get_visitor_state(request)
    lease = get_workflow_studio_lease(request, visitor_state=visitor_state)
    if not lease:
        raise web.HTTPUnauthorized(text='Launch the workflow studio from the workflow demo to start a 5-minute guest session.')

    response = web.Response(status=204)
    if refresh_visitor_cookie:
        set_visitor_cookie(response, visitor_state)
    response.headers['Cache-Control'] = 'no-store'
    return response


async def create_session(request: web.Request) -> web.Response:
    app = request.app
    client_ip = get_client_ip(request)
    history = prune_rate_limit(app, client_ip)
    visitor_state, refresh_visitor_cookie = get_visitor_state(request)
    auth_identity = get_auth_identity(request)
    anonymous_sessions_used = visitor_state['anonymous_sessions_used']
    auth_gate_enabled = google_oauth_enabled() and FREE_ANONYMOUS_SESSIONS >= 0

    if active_sessions_count(app) >= MAX_GLOBAL_CONCURRENT:
        audit_log('sandbox_capacity_blocked', client_ip=client_ip, visitor_id=visitor_state['visitor_id'])
        return web.json_response(
            {'error': 'Sandbox service is at capacity. Please try again later.'},
            status=503,
        )

    if len(history) >= MAX_SESSIONS_PER_HOUR:
        audit_log('sandbox_rate_limited', client_ip=client_ip, visitor_id=visitor_state['visitor_id'])
        return web.json_response(
            {'error': 'Rate limit exceeded for sandbox sessions. Please try again later.'},
            status=429,
        )

    if active_sessions_for_ip(app, client_ip) >= MAX_CONCURRENT_PER_IP:
        return web.json_response(
            {'error': 'Only one active sandbox session per visitor is allowed.'},
            status=429,
        )

    if not auth_identity and auth_gate_enabled and anonymous_sessions_used >= FREE_ANONYMOUS_SESSIONS:
        response = web.json_response(
            {
                'error': 'Your complimentary anonymous terminal session has already been used. Sign in with Google to unlock additional launches.',
                'authRequired': True,
                'authConfigured': google_oauth_enabled(),
                'provider': 'google',
            },
            status=401,
        )
        if refresh_visitor_cookie:
            set_visitor_cookie(response, visitor_state)

        audit_log(
            'sandbox_auth_required',
            client_ip=client_ip,
            visitor_id=visitor_state['visitor_id'],
        )
        return response

    if not auth_identity:
        visitor_state['anonymous_sessions_used'] = anonymous_sessions_used + 1

    session_id = secrets.token_urlsafe(9)
    token = secrets.token_urlsafe(24)
    session = Session(
        session_id=session_id,
        token=token,
        client_ip=client_ip,
        created_at=time.time(),
        visitor_id=visitor_state['visitor_id'],
        auth_user=auth_identity.get('email') if auth_identity else None,
        auth_provider=auth_identity.get('provider') if auth_identity else None,
    )
    app['sessions'][session_id] = session
    history.append(time.time())
    session.connect_timeout_task = asyncio.create_task(
        expire_session(app, session, CONNECT_WINDOW_SECONDS, 'Sandbox request expired before connection.')
    )

    base_ws_url = PUBLIC_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://')
    ws_url = f'{base_ws_url}/ws?sessionId={session_id}&token={token}'

    response = web.json_response(
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
            'authConfigured': google_oauth_enabled(),
            'authProvider': 'google',
            'anonymousSessionsRemaining': max(FREE_ANONYMOUS_SESSIONS - visitor_state['anonymous_sessions_used'], 0),
        }
    )
    set_visitor_cookie(response, visitor_state)

    audit_log(
        'sandbox_session_created',
        session_id=session.session_id,
        client_ip=client_ip,
        visitor_id=session.visitor_id,
        auth_provider=session.auth_provider,
        auth_user=session.auth_user,
    )

    return response


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
    app['aws_demo_rate_limit'] = defaultdict(deque)
    app.cleanup_ctx.append(aws_demo_cleanup_context)
    app.add_routes(
        [
            web.get('/health', health),
            web.post('/sessions', create_session),
            web.options('/sessions', create_session),
            web.get('/ws', websocket_handler),
            web.get('/aws-demo/live/status', aws_demo_live_status),
            web.post('/aws-demo/live/launch', aws_demo_live_launch),
            web.delete('/aws-demo/live/destroy', aws_demo_live_destroy),
            web.get('/aws-demo/specs', aws_demo_specs),
            web.get('/aws-demo/runs', aws_demo_list_runs),
            web.post('/aws-demo/runs', aws_demo_create_run),
            web.get('/aws-demo/runs/{demo_id}', aws_demo_get_run),
            web.delete('/aws-demo/runs/{demo_id}', aws_demo_destroy_run),
            web.get('/auth/status', auth_status),
            web.get('/auth/studio-access', workflow_studio_access),
            web.get('/auth/google/start', google_oauth_start),
            web.get('/auth/google/callback', google_oauth_callback),
            web.post('/auth/logout', logout),
            web.options('/auth/logout', logout),
        ]
    )
    return app


if __name__ == '__main__':
    web.run_app(create_app(), host=HOST, port=PORT)
