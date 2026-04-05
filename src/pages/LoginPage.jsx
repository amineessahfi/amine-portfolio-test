import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteAuth } from '../context/SiteAuthContext'

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
      ? 'Checking sign-in'
    : signInUnavailable
      ? 'Sign-in unavailable'
      : 'Ready to sign in'
  const statusDescription = !authReady
    ? 'Checking sign-in availability for this deployment.'
    : authState.authenticated
      ? authState.user?.email
        ? `Signed in as ${authState.user.email}. You can leave this page whenever you want.`
        : 'Signed in. You can leave this page whenever you want.'
      : signInUnavailable
        ? 'Google sign-in is not available right now.'
        : 'Optional authentication for the website. One sign-in applies across the site.'

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
      <section className="mx-auto w-full max-w-lg">
        <div className="rounded-[1.75rem] border border-white/10 bg-[#050816]/72 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl sm:p-8">
          <div className="relative z-10">
            <span className="section-chip">Login</span>
            <h1 className="section-title max-w-none text-3xl sm:text-4xl">Sign in</h1>
            <p className="section-copy max-w-none">
              Optional authentication for the website. Nothing else needs to happen here beyond starting or ending your session.
            </p>

            <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                Status
              </p>
              <p className="mt-3 text-base font-semibold text-white">{statusTitle}</p>
              <p className="mt-2 text-sm leading-7 text-gray-300 sm:text-[15px]">{statusDescription}</p>
            </div>

            {notice ? <p className="mt-4 text-sm text-cyan-200">{notice}</p> : null}
            {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

            <div className="mt-6 flex flex-col gap-3">
              {!authReady ? (
                <button type="button" disabled className="secondary-button opacity-70">
                  Checking sign-in
                </button>
              ) : authState.authenticated ? (
                <button type="button" onClick={handleSignOut} className="primary-button">
                  Sign out
                </button>
              ) : authState.authConfigured ? (
                <button type="button" onClick={handleSignIn} className="primary-button">
                  Sign in with Google
                </button>
              ) : (
                <button type="button" disabled className="secondary-button opacity-70">
                  Sign-in unavailable
                </button>
              )}
            </div>

            <div className="mt-6">
              <Link to="/" className="soft-link">
                Back home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
