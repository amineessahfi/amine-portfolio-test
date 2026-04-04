import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaLock, FaUserPlus } from 'react-icons/fa'
import { SANDBOX_LOGIN_ROUTE, createDiscussUrl } from '../constants/routes'

const signInPoints = [
  'Head straight into the sandbox login flow before touching the live terminal.',
  'Best for returning visitors who want an identified path once OAuth is fully active.',
  'Keeps repeat access tied to a cleaner, attributable session model.',
]

const signUpPoints = [
  'Use this when you want more than the complimentary guest flow.',
  'Good for teams that want a branded sandbox, recurring access, or a tailored demo path.',
  'Drops into the discuss route so the signup step leads to a real delivery conversation.',
]

const accessHighlights = [
  { value: '1', label: 'Complimentary guest launch' },
  { value: 'OAuth', label: 'Identified repeat-access path' },
  { value: 'Custom', label: 'Signup route for broader access' },
]

function LandingAccessPanel() {
  return (
    <section id="landing-auth" className="scroll-mt-28">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="text-sm text-gray-400">access - sign in / sign up</div>
        </div>

        <div className="terminal-content">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="section-chip">Access options</span>
              <h2 className="section-title text-3xl sm:text-4xl">Sign in or sign up directly from the landing page</h2>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
              This sits on the homepage so visitors can choose an account path before they browse deeper: sign in for identified sandbox access, or sign up for a broader access conversation.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <article className="metric-card card-hover flex h-full flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    <span className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">Returning access</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">Sign in</h3>
                </div>
                <span className="skill-badge !px-3 !py-2 text-cyan-100">
                  <FaLock className="text-cyan-300" />
                  Login
                </span>
              </div>

              <p className="mt-4 text-sm leading-8 text-gray-400">
                Use the sign-in path if you want to reach the sandbox through the identified access flow instead of starting anonymously.
              </p>

              <ul className="mt-5 space-y-3 text-sm text-gray-300">
                {signInPoints.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <Link to={SANDBOX_LOGIN_ROUTE} className="primary-button gap-2">
                  Go to sign in
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </article>

            <article className="metric-card card-hover flex h-full flex-col p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary-300" />
                    <span className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-200">New access</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">Sign up</h3>
                </div>
                <span className="skill-badge !px-3 !py-2 text-primary-100">
                  <FaUserPlus className="text-primary-300" />
                  Signup
                </span>
              </div>

              <p className="mt-4 text-sm leading-8 text-gray-400">
                Use the signup route if you want a fuller access path, a custom sandbox angle, or a direct conversation about bringing this experience into your own platform.
              </p>

              <ul className="mt-5 space-y-3 text-sm text-gray-300">
                {signUpPoints.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <Link to={createDiscussUrl('live-terminal-sandbox')} className="secondary-button gap-2">
                  Start sign up
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </article>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {accessHighlights.map((item) => (
              <div key={item.label} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-center">
                <p className="text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingAccessPanel
