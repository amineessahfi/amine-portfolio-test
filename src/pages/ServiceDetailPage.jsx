import React from 'react'
import { Link, useParams } from 'react-router-dom'
import CostCalculator from '../components/CostCalculator'
import SandboxTerminal from '../components/SandboxTerminal'
import { AUDIT_REQUEST_URL, EMAIL_URL } from '../constants/links'
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
  const primaryCtaUrl = isSandboxService ? '#live-sandbox' : isAwsService ? AUDIT_REQUEST_URL : EMAIL_URL
  const primaryCtaLabel = isSandboxService
    ? 'Launch 5-minute sandbox'
    : isAwsService
      ? 'Request AWS audit'
      : 'Discuss this service'

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

              <a
                href={primaryCtaUrl}
                className="inline-flex w-fit rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                {primaryCtaLabel}
              </a>
            </div>
          </div>
        </section>

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
