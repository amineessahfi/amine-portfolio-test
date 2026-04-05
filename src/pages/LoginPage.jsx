import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaShieldAlt } from 'react-icons/fa'
import { useSiteAuth } from '../context/SiteAuthContext'
import { LIVE_SANDBOX_ROUTE } from '../constants/routes'

function LoginPage() {
  const {
    authReady,
    authState,
    consumeOauthResult,
    signOut,
    startSignIn,
    syncAuthState,
  } = useSiteAuth()
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const signInUnavailable = authReady && !authState.authConfigured
  const statusTitle = authState.authenticated
    ? 'Signed in'
    : !authReady
      ? 'Checking access'
      : signInUnavailable
        ? 'Sign-in temporarily unavailable'
        : 'Ready to sign in'
  const statusDescription = !authReady
    ? 'Checking sign-in availability for the current deployed site.'
    : authState.authenticated
      ? authState.user?.email
        ? `Authenticated as ${authState.user.email}.`
        : 'Authenticated.'
      : authState.authConfigurationError === 'invalid_google_web_client'
        ? 'Google Sign-In is being reconfigured with the correct browser OAuth client. The route stays visible, but the live button is intentionally offline until that replacement is in place.'
        : authState.authConfigured
          ? 'Secure sign-in is available across the website from this route.'
          : 'The sign-in UI is ready, but backend credentials still need to be connected before it can complete.'
  const statusBadgeClass = authState.authenticated
    ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200'
    : signInUnavailable
      ? 'border-amber-400/30 bg-amber-400/10 text-amber-100'
      : 'border-primary-500/30 bg-primary-500/10 text-primary-200'

  useEffect(() => {
    const oauthState = consumeOauthResult()

    if (oauthState === 'success') {
      setNotice('Sign-in complete.')
      setError('')
      void syncAuthState()
    } else if (oauthState === 'error') {
      setError('Sign-in did not complete. Please try again.')
    }
  }, [consumeOauthResult, syncAuthState])

  const handleSignIn = () => {
    const signInError = startSignIn(window.location.href)

    if (signInError) {
      setNotice('')
      setError(signInError)
    }
  }

  const handleSignOut = async () => {
    const signOutError = await signOut()

    if (signOutError) {
      setNotice('')
      setError(signOutError)
      return
    }

    setNotice('Signed out.')
    setError('')
  }

  return (
    <main className="page-shell pt-12">
      <section className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
        <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(20rem,0.98fr)] xl:items-start">
          <div className="space-y-6">
            <span className="section-chip">Login</span>
            <h1 className="section-title max-w-3xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
              Sign in once.
              <span className="gradient-text"> Use the session everywhere.</span>
            </h1>
            <p className="section-copy max-w-2xl text-base sm:text-lg">
              This route is the site-wide entry point for identified access. Once it is active, the same session will carry across the website and into the live shell.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${statusBadgeClass}`}>
                {statusTitle}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-gray-300">
                Route /login
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="metric-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">Scope</p>
                <p className="mt-3 text-sm text-white">Whole website session</p>
              </div>
              <div className="metric-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">Provider</p>
                <p className="mt-3 text-sm text-white">Google sign-in</p>
              </div>
              <div className="metric-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">Next step</p>
                <p className="mt-3 text-sm text-white">Continue into the live shell after access is confirmed</p>
              </div>
            </div>

            {notice ? <p className="mt-4 text-sm text-cyan-200">{notice}</p> : null}
            {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
          </div>

          <div className="metric-card p-6 sm:p-8">
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Access panel</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">{statusTitle}</h2>
              <p className="mt-4 text-sm leading-8 text-gray-400">{statusDescription}</p>

              <div className="mt-6 flex flex-col gap-3">
                {authState.authenticated ? (
                  <>
                    <button type="button" onClick={handleSignOut} className="primary-button gap-2">
                      Sign out
                    </button>
                    <Link to={LIVE_SANDBOX_ROUTE} className="secondary-button gap-2">
                      Continue to live shell
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </>
                ) : authState.authConfigured ? (
                  <button
                    type="button"
                    onClick={handleSignIn}
                    className="primary-button gap-2"
                  >
                    <FaShieldAlt />
                    Continue to sign in
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled
                      className="secondary-button gap-2 opacity-70"
                    >
                      <FaShieldAlt />
                      Sign-in temporarily unavailable
                    </button>
                    <Link to={LIVE_SANDBOX_ROUTE} className="secondary-button gap-2">
                      Continue to complimentary shell access
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </>
                )}
              </div>

              {signInUnavailable ? (
                <div className="mt-6 rounded-[1.4rem] border border-amber-400/20 bg-amber-400/10 px-4 py-4 text-sm leading-7 text-amber-100">
                  The sign-in route stays visible in navigation, but the live Google button is intentionally paused until the correct browser client replaces the current invalid configuration.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
