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
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] xl:items-start">
          <div>
            <span className="section-chip">Login</span>
            <h1 className="section-title max-w-3xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
              Secure sign-in for
              <span className="gradient-text"> identified access</span>
            </h1>
            <p className="section-copy max-w-2xl text-base sm:text-lg">
              Use this route when you want one authenticated session across the website. Sign in here once, then move between pages, demos, and future gated features with the same identified access path.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
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
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="primary-button gap-2"
                >
                  <FaShieldAlt />
                  Continue to sign in
                </button>
              )}
            </div>

            {notice ? <p className="mt-4 text-sm text-cyan-200">{notice}</p> : null}
            {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
          </div>

          <div className="metric-card p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Status</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              {authState.authenticated ? 'Signed in' : authReady ? 'Ready to sign in' : 'Checking access'}
            </h2>
            <p className="mt-4 text-sm leading-8 text-gray-400">
              {!authReady
                ? 'Checking sign-in availability for the current deployed site.'
                : authState.authenticated
                ? authState.user?.email
                  ? `Authenticated as ${authState.user.email}.`
                  : 'Authenticated.'
                : authState.authConfigured
                  ? 'Secure sign-in is available across the website from this route.'
                  : 'The sign-in button is wired here, but backend credentials still need to be configured before it can complete.'}
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-gray-300">
                Route: <span className="text-white">/login</span>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-gray-300">
                Scope: <span className="text-white">Whole website session</span>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-gray-300">
                Next step: <span className="text-white">Move between the site and the live shell with one shared sign-in</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
