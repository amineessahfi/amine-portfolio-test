import React from 'react'
import { Link, useParams } from 'react-router-dom'
import CostCalculator from '../components/CostCalculator'
import SandboxTerminal from '../components/SandboxTerminal'
import { ARCHITECTURE_STACK_ROUTE, SERVICES_DIRECTORY_ROUTE, createDiscussUrl } from '../constants/routes'
import { getServiceBySlug } from '../data/services'
import NotFoundPage from './NotFoundPage'

function ServiceDetailPage() {
  const { serviceSlug } = useParams()
  const service = getServiceBySlug(serviceSlug)

  if (!service) {
    return <NotFoundPage />
  }

  const isAwsService = service.slug === 'aws-cost-optimization'
  const isSandboxService = service.slug === 'live-terminal-sandbox'
  const discussUrl = createDiscussUrl(service.slug)
  const primaryCta = isSandboxService
    ? { label: 'Jump to the live shell', href: '#live-sandbox' }
    : isAwsService
      ? { label: 'Open the savings model', href: '#aws-cost-calculator' }
      : { label: 'Open the project fit page', to: discussUrl }
  const secondaryCta = isSandboxService
    ? { label: 'Discuss this demo flow', to: discussUrl }
    : isAwsService
      ? { label: 'Plan the AWS review', to: discussUrl }
      : { label: 'Browse all services', to: SERVICES_DIRECTORY_ROUTE }
  const showArchitectureLink = isSandboxService
  const sandboxLaunchSteps = [
    'Land directly on the highlighted sandbox section instead of entering halfway down a long page.',
    'Review the boundaries, then optionally sign in from the login section before launching.',
    'Use the live shell, watch the timer, and let the session self-destruct automatically.',
  ]

  return (
    <>
      <section className="px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-dark-700/70 bg-dark-900/50 px-6 py-10 shadow-2xl shadow-black/20 backdrop-blur sm:px-10 sm:py-12">
            <Link to="/services" className="text-sm text-primary-300 transition-colors hover:text-primary-200">
              ← Back to services
            </Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">{service.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              {service.title}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-gray-400 sm:text-base">{service.summary}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {service.snapshot.map((item) => (
                <div key={item.label} className="metric-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">{item.label}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 sm:gap-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">service — scope</div>
            </div>

            <div className="terminal-content">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">What I deliver</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Scope and deliverables</h2>
              </div>

              <ul className="space-y-3 text-sm leading-7 text-gray-300">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex gap-3 rounded-2xl border border-dark-700/70 bg-dark-900/40 px-4 py-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="terminal-window">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">service — fit</div>
            </div>

            <div className="terminal-content">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Best fit</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">When this service makes sense</h2>
              </div>

              <ul className="space-y-3 text-sm leading-7 text-gray-300">
                {service.bestFor.map((item) => (
                  <li key={item} className="flex gap-3 rounded-2xl border border-dark-700/70 bg-dark-900/40 px-4 py-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                {'href' in primaryCta ? (
                  <a
                    href={primaryCta.href}
                    className="inline-flex w-fit rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    {primaryCta.label}
                  </a>
                ) : (
                  <Link
                    to={primaryCta.to}
                    className="inline-flex w-fit rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    {primaryCta.label}
                  </Link>
                )}
                <Link
                  to={secondaryCta.to}
                  className="inline-flex w-fit rounded-xl border border-dark-600 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-dark-700"
                >
                  {secondaryCta.label}
                </Link>
                {showArchitectureLink ? <Link to={ARCHITECTURE_STACK_ROUTE} className="secondary-button">View architecture</Link> : null}
              </div>
            </div>
          </div>
        </section>

        {isSandboxService ? (
          <section className="terminal-window">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">sandbox - launch rail</div>
            </div>

            <div className="terminal-content">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
                <div>
                  <span className="section-chip">Live entry sequence</span>
                  <h2 className="section-title text-3xl sm:text-4xl">A cleaner path into the terminal experience</h2>
                  <p className="section-copy">
                    The sandbox should feel like a deliberate product moment, not just a utility block buried in the route. This launch rail now hands visitors directly into the live shell instead of making them hunt for it.
                  </p>

                  <ol className="mt-6 space-y-3">
                    {sandboxLaunchSteps.map((step, index) => (
                      <li key={step} className="flex gap-4 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-sm font-semibold text-white">
                          {index + 1}
                        </span>
                        <span className="text-sm leading-7 text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="metric-card p-6">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2.5 w-2.5 animate-pulse-slow rounded-full bg-cyan-300" />
                    <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Live terminal route</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">Jump straight into the shell</h3>
                  <p className="mt-4 text-sm leading-8 text-gray-400">
                    The terminal stays on its own route with stronger focus, sharper copy, one complimentary anonymous run, and a cleaner handoff into Google-backed repeat access when visitors want more.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href="#live-sandbox" className="primary-button">
                      Start the live sandbox
                    </a>
                    <a href="#sandbox-login" className="secondary-button">
                      Sign in first
                    </a>
                    <Link to={createDiscussUrl(service.slug)} className="secondary-button">
                      Discuss this experience
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {isSandboxService ? <SandboxTerminal /> : null}

        <section className="terminal-window">
          <div className="terminal-header">
            <div className="text-sm text-gray-400">service — outcomes</div>
          </div>

          <div className="terminal-content">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Expected outcomes</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">What this engagement is designed to improve</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {service.outcomes.map((item) => (
                <div key={item} className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-5 text-sm leading-7 text-gray-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {isAwsService ? <CostCalculator /> : null}
      </main>
    </>
  )
}

export default ServiceDetailPage
