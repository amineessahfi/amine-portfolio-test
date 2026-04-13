import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LIVE_SANDBOX_ROUTE, SERVICES_DIRECTORY_ROUTE, WORKFLOW_COMPOSER_ROUTE } from '../constants/routes'
import { useSiteAuth } from '../context/SiteAuthContext'

const accessBenefits = [
  'Use the same session across repeat live sandbox launches when you want identified access.',
  'Keep identified access ready before you launch a gated proof surface.',
  'Treat sign-in as utility access, not the main event of the site.',
]

const quickRoutes = [
  {
    title: 'Browse services',
    description: 'Stay in the service directory when you are still deciding where the fit is strongest.',
    to: SERVICES_DIRECTORY_ROUTE,
  },
  {
    title: 'Open the live demo',
    description: 'Jump into the sandbox when you want hands-on product proof first.',
    to: LIVE_SANDBOX_ROUTE,
  },
  {
    title: 'Open the workflow demo',
    description: 'Use the workflow demo when you want a temporary guest session in the restricted live studio.',
    to: WORKFLOW_COMPOSER_ROUTE,
  },
]

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
        ? `Signed in as ${authState.user.email}. Repeat sandbox launches can use the same access state.`
        : 'Signed in. Repeat sandbox launches can use the same access state.'
      : signInUnavailable
        ? 'Google sign-in is not available right now.'
        : 'Browsing stays open. Sign in only when you want identified access for repeat live sandbox launches.'

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
    <section className="page-hero">
      <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-start">
          <div className="relative z-10">
            <span className="section-chip">Access</span>
            <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
              Use sign-in only when a gated demo needs it.
            </h1>
            <p className="section-copy max-w-3xl text-base sm:text-lg">
              Authentication is optional for browsing. It exists only for the small part of the site that actually needs gated proof surfaces.
            </p>

            <div className="mt-8 metric-card p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Access status</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">{statusTitle}</h2>
              <p className="mt-4 text-sm leading-8 text-gray-300">{statusDescription}</p>

              {notice ? <p className="mt-4 text-sm text-cyan-200">{notice}</p> : null}
              {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

                <Link to={SERVICES_DIRECTORY_ROUTE} className="secondary-button">
                  Browse services
                </Link>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="metric-card p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Why access exists</p>
              <h2 className="mt-4 text-2xl font-semibold text-white">Useful when the proof surface is gated.</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-gray-300">
                {accessBenefits.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {quickRoutes.map((route) => (
                <Link key={route.title} to={route.to} className="metric-card card-hover p-5">
                  <p className="text-sm font-semibold text-white">{route.title}</p>
                  <p className="mt-3 text-sm leading-7 text-gray-400">{route.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
