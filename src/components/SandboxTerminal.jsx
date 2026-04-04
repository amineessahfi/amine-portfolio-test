import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import { SANDBOX_API_BASE } from '../constants/sandbox'

const restrictions = [
  '5-minute hard time limit',
  'No outbound network access',
  'Ephemeral filesystem and session reset',
  'Non-root shell inside a constrained container',
]

function SandboxTerminal() {
  const terminalHostRef = useRef(null)
  const terminalRef = useRef(null)
  const fitAddonRef = useRef(null)
  const socketRef = useRef(null)
  const resizeObserverRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [timeLeft, setTimeLeft] = useState('')
  const [sessionMeta, setSessionMeta] = useState(null)

  const statusLabel = useMemo(() => {
    if (status === 'creating') return 'Requesting session'
    if (status === 'connecting') return 'Connecting terminal'
    if (status === 'active') return 'Live session active'
    if (status === 'ended') return 'Session ended'
    if (status === 'error') return 'Session unavailable'
    return 'Ready to launch'
  }, [status])

  const disposeTerminal = () => {
    resizeObserverRef.current?.disconnect()
    resizeObserverRef.current = null
    socketRef.current?.close()
    socketRef.current = null
    terminalRef.current?.dispose()
    terminalRef.current = null
    fitAddonRef.current = null
    if (terminalHostRef.current) {
      terminalHostRef.current.innerHTML = ''
    }
  }

  useEffect(() => {
    return () => {
      disposeTerminal()
    }
  }, [])

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft('')
      return undefined
    }

    const updateTimeLeft = () => {
      const remainingMs = new Date(expiresAt).getTime() - Date.now()
      if (remainingMs <= 0) {
        setTimeLeft('Expired')
        return
      }

      const totalSeconds = Math.ceil(remainingMs / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')} remaining`)
    }

    updateTimeLeft()
    const intervalId = window.setInterval(updateTimeLeft, 1000)
    return () => window.clearInterval(intervalId)
  }, [expiresAt])

  const writeSystemLine = (text) => {
    if (terminalRef.current) {
      terminalRef.current.writeln(`\r\n${text}`)
    }
  }

  const sendResize = () => {
    const fitAddon = fitAddonRef.current
    const socket = socketRef.current
    const terminal = terminalRef.current

    if (!fitAddon || !socket || socket.readyState !== WebSocket.OPEN || !terminal) {
      return
    }

    fitAddon.fit()
    socket.send(
      JSON.stringify({
        type: 'resize',
        cols: terminal.cols,
        rows: terminal.rows,
      }),
    )
  }

  const initializeTerminal = () => {
    if (!terminalHostRef.current || terminalRef.current) {
      return
    }

    const terminal = new Terminal({
      cursorBlink: true,
      convertEol: true,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 13,
      lineHeight: 1.35,
      theme: {
        background: '#020617',
        foreground: '#e2e8f0',
        cursor: '#60a5fa',
        selectionBackground: '#1d4ed8',
      },
    })
    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.open(terminalHostRef.current)
    fitAddon.fit()
    terminal.focus()
    terminalRef.current = terminal
    fitAddonRef.current = fitAddon

    resizeObserverRef.current = new ResizeObserver(() => {
      sendResize()
    })
    resizeObserverRef.current.observe(terminalHostRef.current)
  }

  const endSession = (message) => {
    if (message) {
      writeSystemLine(message)
    }
    socketRef.current?.close()
    socketRef.current = null
    setStatus('ended')
  }

  const handleSocketMessage = (event) => {
    try {
      const payload = JSON.parse(event.data)
      if (payload.type === 'ready') {
        setStatus('active')
        setExpiresAt(payload.expiresAt || '')
        setSessionMeta(payload)
        writeSystemLine('Sandbox ready. Session expires automatically after 5 minutes.')
        sendResize()
        return
      }

      if (payload.type === 'output') {
        terminalRef.current?.write(payload.data || '')
        return
      }

      if (payload.type === 'system') {
        writeSystemLine(payload.message || 'Session updated.')
        if (payload.closed) {
          setStatus('ended')
        }
      }
    } catch {
      terminalRef.current?.write(event.data)
    }
  }

  const connectSession = (session) => {
    initializeTerminal()

    if (!terminalRef.current) {
      setStatus('error')
      setError('Terminal failed to initialize in the browser.')
      return
    }

    terminalRef.current.clear()
    terminalRef.current.writeln('Launching sandbox...')
    const socket = new WebSocket(session.wsUrl)
    socketRef.current = socket

    terminalRef.current.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'input', data }))
      }
    })

    socket.addEventListener('open', () => {
      sendResize()
    })
    socket.addEventListener('message', handleSocketMessage)
    socket.addEventListener('close', () => {
      if (status !== 'ended') {
        setStatus('ended')
      }
    })
    socket.addEventListener('error', () => {
      setStatus('error')
      setError('The terminal session could not connect to the backend.')
    })
  }

  const startSandbox = async () => {
    setError('')
    setExpiresAt('')
    setSessionMeta(null)
    disposeTerminal()
    setStatus('creating')

    try {
      const response = await fetch(`${SANDBOX_API_BASE}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Sandbox session could not be created.')
      }

      setStatus('connecting')
      connectSession(payload)
    } catch (requestError) {
      setStatus('error')
      setError(requestError.message)
    }
  }

  return (
    <section id="live-sandbox" className="terminal-window">
      <div className="terminal-header">
        <div className="text-sm text-gray-400">sandbox — live terminal</div>
      </div>

      <div className="terminal-content">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Live sandbox</p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Try a real Linux shell for 5 minutes</h2>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm text-gray-400 lg:items-end">
            <span className="rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-primary-200">
              {statusLabel}
            </span>
            {timeLeft ? <span>{timeLeft}</span> : null}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="rounded-2xl border border-dark-700/70 bg-dark-950/80 p-4">
            <div
              ref={terminalHostRef}
              className="min-h-[24rem] overflow-hidden rounded-xl border border-dark-700/70 bg-[#020617] p-2"
            />
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-5">
              <h3 className="text-lg font-semibold text-white">Safety controls</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                {restrictions.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-5">
              <h3 className="text-lg font-semibold text-white">How it works</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                Each session starts a fresh container on the backend, gives you a temporary shell, and is destroyed
                automatically when the timer ends or the browser disconnects.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={startSandbox}
                  disabled={status === 'creating' || status === 'connecting' || status === 'active'}
                  className="inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-800/70"
                >
                  {status === 'active' ? 'Session running' : 'Start 5-minute sandbox'}
                </button>

                <button
                  type="button"
                  onClick={() => endSession('Sandbox session closed.')}
                  disabled={status !== 'active'}
                  className="inline-flex rounded-xl border border-dark-600 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-dark-700 disabled:cursor-not-allowed disabled:text-gray-500"
                >
                  End session
                </button>
              </div>

              {sessionMeta?.sessionId ? (
                <p className="mt-4 text-xs text-gray-500">Session ID: {sessionMeta.sessionId}</p>
              ) : null}
              {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SandboxTerminal
