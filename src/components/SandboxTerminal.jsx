import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import { createDiscussUrl } from '../constants/routes'
import { SANDBOX_API_BASE } from '../constants/sandbox'
import { useSiteAuth } from '../context/SiteAuthContext'

const baseRestrictions = [
  '5-minute hard time limit',
  'No outbound network access',
  'Ephemeral filesystem and session reset',
  'Non-root shell inside a constrained container',
]

const signInBenefits = [
  'Unlock repeat sandbox launches proactively instead of waiting for the gate.',
  'Create an identified access path before the shell session begins.',
  'Keep repeat launches attributable once authenticated access is enabled.',
]

function SandboxTerminal() {
  const terminalHostRef = useRef(null)
  const terminalRef = useRef(null)
  const fitAddonRef = useRef(null)
  const socketRef = useRef(null)
  const resizeObserverRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [timeLeft, setTimeLeft] = useState('')
  const [sessionMeta, setSessionMeta] = useState(null)
  const {
    authReady,
    authState,
    consumeOauthResult,
    signOut,
    startSignIn,
    syncAuthState,
  } = useSiteAuth()

  const complimentarySessionsRemaining = useMemo(
    () => Math.max((authState.freeAnonymousSessions || 0) - (authState.anonymousSessionsUsed || 0), 0),
    [authState.anonymousSessionsUsed, authState.freeAnonymousSessions],
  )
  const requiresSignInBeforeLaunch =
    !authState.authenticated && authState.authConfigured && complimentarySessionsRemaining === 0
  const restrictions = useMemo(
    () => [
      ...baseRestrictions,
      authState.authConfigured
        ? '1 complimentary anonymous session, then sign-in for repeat launches'
        : 'Secure sign-in is wired for repeat launches and becomes active once backend credentials are configured',
    ],
    [authState.authConfigured],
  )

  const accessStatus = useMemo(() => {
    if (!authReady) {
      return 'Checking current site access state'
    }

    if (authState.authenticated) {
      return `Signed in${authState.user?.email ? ` as ${authState.user.email}` : ''}`
    }

    if (complimentarySessionsRemaining > 0) {
      return `${complimentarySessionsRemaining} complimentary launch${complimentarySessionsRemaining === 1 ? '' : 'es'} remaining`
    }

    if (authState.authConfigured) {
      return 'Sign in unlocks more launches'
    }

    return 'Secure sign-in will unlock repeat launches once configured'
  }, [authReady, authState.authenticated, authState.authConfigured, authState.user, complimentarySessionsRemaining])

  const statusLabel = useMemo(() => {
    if (status === 'idle' && !authReady) return 'Checking access'
    if (status === 'creating') return 'Requesting session'
    if (status === 'connecting') return 'Connecting terminal'
    if (status === 'active') return 'Live session active'
    if (status === 'ended') return 'Session ended'
    if (status === 'error') return 'Session unavailable'
    if (requiresSignInBeforeLaunch) return 'Sign-in required'
    return 'Ready to launch'
  }, [authReady, requiresSignInBeforeLaunch, status])
  const signInStatus = useMemo(() => {
    if (authState.authenticated) {
      return {
        label: 'Signed in',
        className: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
      }
    }

    if (!authReady) {
      return {
        label: 'Checking site auth',
        className: 'border-white/10 bg-white/[0.04] text-gray-300',
      }
    }

    if (authState.authConfigured) {
      return {
        label: 'Optional sign-in',
        className: 'border-primary-500/30 bg-primary-500/10 text-primary-200',
      }
    }

    return {
      label: 'Access panel ready',
      className: 'border-white/10 bg-white/[0.04] text-gray-300',
    }
  }, [authReady, authState.authConfigured, authState.authenticated])

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
    const oauthState = consumeOauthResult()

    if (oauthState === 'success') {
      setAuthNotice('Sign-in complete. Additional terminal sessions are now available.')
      setError('')
      void syncAuthState()
    } else if (oauthState === 'error') {
      setError('Sign-in did not complete. Please try again.')
    }

    void syncAuthState()

    return () => {
      disposeTerminal()
    }
  }, [consumeOauthResult, syncAuthState])

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

  const buildReturnToUrl = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.delete('oauth')
    currentUrl.hash = 'live-sandbox'
    return currentUrl.toString()
  }

  const handleStartSignIn = () => {
    const signInError = startSignIn(buildReturnToUrl())

    if (signInError) {
      setError(signInError)
    }
  }

  const handleSignOut = async () => {
    const signOutError = await signOut()

    if (signOutError) {
      setError(signOutError)
    } else {
      setAuthNotice('Signed out. You can still use the complimentary anonymous launch if it has not been used yet.')
      setError('')
    }
  }

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
      setStatus((currentStatus) => (currentStatus === 'error' ? currentStatus : 'ended'))
    })
    socket.addEventListener('error', () => {
      setStatus('error')
      setError('The terminal session could not connect to the backend.')
    })
  }

  const startSandbox = async () => {
    if (requiresSignInBeforeLaunch) {
      setStatus('idle')
      handleStartSignIn()
      return
    }

    setError('')
    setAuthNotice('')
    setExpiresAt('')
    setSessionMeta(null)
    disposeTerminal()
    setStatus('creating')

    try {
      const response = await fetch(`${SANDBOX_API_BASE}/sessions`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const payload = await response.json()
      await syncAuthState()

      if (!response.ok) {
        if (payload.authRequired) {
          setStatus('idle')
          setError(payload.error || 'Sign in to unlock more terminal sessions.')
          return
        }

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
    <section id="live-sandbox" className="terminal-window scroll-mt-28">
      <div className="terminal-header">
        <div className="text-sm text-gray-400">sandbox — live terminal</div>
      </div>

      <div className="terminal-content">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Live sandbox</p>
            <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Try a real shell for 5 minutes</h2>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm text-gray-400 lg:items-end">
            <span className="rounded-full border border-primary-500/30 bg-primary-500/10 px-3 py-1 text-primary-200">
              {statusLabel}
            </span>
            <span>{accessStatus}</span>
            {timeLeft ? <span>{timeLeft}</span> : null}
          </div>
        </div>

        <div id="sandbox-login" className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-5 scroll-mt-28">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Access control</p>
              <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">Prefer identified access before launching?</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                If a visitor wants an identified access path before touching the terminal, this panel uses the same sign-in state that is now available across the rest of the website.
              </p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${signInStatus.className}`}>
              {signInStatus.label}
            </span>
          </div>

          <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
            {signInBenefits.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap gap-3">
            {authState.authenticated ? (
              <>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="secondary-button !rounded-xl !px-4 !py-2"
                >
                  Sign out
                </button>
                <span className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300">
                  {authState.user?.email ? `Signed in as ${authState.user.email}` : 'Signed in'}
                </span>
              </>
            ) : authState.authConfigured ? (
              <>
                <button
                  type="button"
                  onClick={handleStartSignIn}
                  className="primary-button !rounded-xl !px-4 !py-2"
                >
                  Continue to sign in
                </button>
                <span className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300">
                  Or use the complimentary anonymous launch below
                </span>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  className="secondary-button !rounded-xl !px-4 !py-2 opacity-70"
                >
                  Secure sign-in coming online
                </button>
                <Link to={createDiscussUrl('live-terminal-sandbox')} className="secondary-button !rounded-xl !px-4 !py-2">
                  Request authenticated access
                </Link>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-gray-500">
            {authState.authConfigured
              ? 'Use sign-in any time if you want the sandbox tied to an identified access path before you launch, while keeping the same session available across the site.'
              : 'The sign-in UI is now in place. The live button will fully activate once backend credentials are added.'}
          </p>
          {authNotice ? <p className="mt-4 text-sm text-cyan-200">{authNotice}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
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
              <h3 className="text-lg font-semibold text-white">Access policy</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                Every browser gets one complimentary launch. Once sign-in is enabled on the backend, repeat sessions become attributable and auditable without turning the terminal into an open public toy.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={startSandbox}
                  disabled={!requiresSignInBeforeLaunch && (status === 'creating' || status === 'connecting' || status === 'active')}
                  className="inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-800/70"
                >
                  {status === 'active'
                    ? 'Session running'
                    : requiresSignInBeforeLaunch
                      ? 'Continue to sign in'
                      : authState.authenticated
                        ? 'Start another 5-minute sandbox'
                        : 'Start complimentary 5-minute sandbox'}
                </button>

                <button
                  type="button"
                  onClick={() => endSession('Sandbox session closed.')}
                  disabled={status !== 'active'}
                  className="inline-flex rounded-xl border border-dark-600 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-dark-700 disabled:cursor-not-allowed disabled:text-gray-500"
                >
                  End session
                </button>

                {!authState.authConfigured ? (
                  <Link to={createDiscussUrl('live-terminal-sandbox')} className="secondary-button !rounded-xl !px-4 !py-2">
                    Discuss extended access
                  </Link>
                ) : null}
              </div>

              {sessionMeta?.sessionId ? (
                <p className="mt-4 text-xs text-gray-500">Session ID: {sessionMeta.sessionId}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SandboxTerminal
