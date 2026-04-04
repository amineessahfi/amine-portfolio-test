import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaGoogle } from 'react-icons/fa'
import { SANDBOX_API_BASE } from '../constants/sandbox'
import { LIVE_SANDBOX_ROUTE } from '../constants/routes'

function LoginPage() {
  const [authState, setAuthState] = useState({
    authenticated: false,
    authConfigured: false,
    provider: 'google',
    user: null,
  })
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const providerLabel = useMemo(() => {
    if (authState.provider === 'google') return 'Google'
    if (!authState.provider) return 'Google'
    return authState.provider.charAt(0).toUpperCase() + authState.provider.slice(1)
  }, [authState.provider])

  const syncAuthState = async () => {
    try {
      const response = await fetch(`${SANDBOX_API_BASE}/auth/status`, {
        credentials: 'include',
      })

      if (!response.ok) {
        return
      }

      const payload = await response.json()
      setAuthState({
        authenticated: Boolean(payload.authenticated),
        authConfigured: Boolean(payload.authConfigured),
        provider: payload.provider || 'google',
        user: payload.user || null,
      })
    } catch {
      setError('Login status could not be loaded right now.')
    }
  }

  useEffect(() => {
    const currentUrl = new URL(window.location.href)
    const oauthState = currentUrl.searchParams.get('oauth')

    if (oauthState === 'success') {
      setNotice('Google sign-in complete.')
      setError('')
    } else if (oauthState === 'error') {
      setError('Google sign-in did not complete. Please try again.')
    }

    if (oauthState) {
      currentUrl.searchParams.delete('oauth')
      window.history.replaceState({}, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`)
    }

    void syncAuthState()
  }, [])

  const buildReturnToUrl = () => {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.delete('oauth')
    return currentUrl.toString()
  }

  const startGoogleAuth = () => {
    if (!authState.authConfigured) {
      setError('Google sign-in is not configured on the backend yet.')
      return
    }

    window.location.assign(
      `${SANDBOX_API_BASE}/auth/google/start?returnTo=${encodeURIComponent(buildReturnToUrl())}`,
    )
  }

  const signOut = async () => {
    try {
      await fetch(`${SANDBOX_API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      setNotice('Signed out.')
      setError('')
      await syncAuthState()
    } catch {
      setError('Could not sign out right now.')
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-12 sm:px-6 lg:px-8">
      <section className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] xl:items-start">
          <div>
            <span className="section-chip">Login</span>
            <h1 className="section-title max-w-3xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
              Sign in with
              <span className="gradient-text"> Google</span>
            </h1>
            <p className="section-copy max-w-2xl text-base sm:text-lg">
              This route keeps auth simple: open `/login`, sign in with Google, then continue into the live sandbox when you want an identified access path.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
              {authState.authenticated ? (
                <>
                  <button type="button" onClick={signOut} className="primary-button gap-2">
                    Sign out
                  </button>
                  <Link to={LIVE_SANDBOX_ROUTE} className="secondary-button gap-2">
                    Continue to sandbox
                    <FaArrowRight className="text-xs" />
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={startGoogleAuth}
                  className="primary-button gap-2"
                >
                  <FaGoogle />
                  Sign in with Google
                </button>
              )}
            </div>

            {notice ? <p className="mt-4 text-sm text-cyan-200">{notice}</p> : null}
            {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
          </div>

          <div className="metric-card p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Status</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              {authState.authenticated ? 'Signed in' : 'Ready to sign in'}
            </h2>
            <p className="mt-4 text-sm leading-8 text-gray-400">
              {authState.authenticated
                ? authState.user?.email
                  ? `Authenticated as ${authState.user.email}.`
                  : 'Authenticated with Google.'
                : authState.authConfigured
                  ? 'Google sign-in is available from this page.'
                  : 'The Google button is wired here, but backend credentials still need to be configured before it can complete.'}
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-gray-300">
                Route: <span className="text-white">/login</span>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-gray-300">
                Provider: <span className="text-white">{providerLabel}</span>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-gray-300">
                Next step: <span className="text-white">Continue into the live sandbox after sign-in</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
