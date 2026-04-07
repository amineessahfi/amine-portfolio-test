import React from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ARCHITECTURE_STACK_ROUTE,
  COST_REVIEW_ROUTE,
  LIVE_SANDBOX_ROUTE,
  SERVICES_DIRECTORY_ROUTE,
  WORKFLOW_COMPOSER_ROUTE,
  createDiscussUrl,
  createServiceRoute,
} from '../constants/routes'
import { getServiceBySlug } from '../data/services'
import NotFoundPage from './NotFoundPage'

function ServiceDetailPage() {
  const { serviceSlug } = useParams()
  const service = getServiceBySlug(serviceSlug)

  if (!service) {
    return <NotFoundPage />
  }

  const isCostService = service.slug === 'cloud-cost-optimization'
  const isSandboxService = service.slug === 'live-terminal-sandbox'
  const isWorkflowService = service.slug === 'workflow-composer'
  const discussUrl = createDiscussUrl(service.slug)
  const primaryCta = isSandboxService
    ? { label: 'Open the dedicated live demo', to: LIVE_SANDBOX_ROUTE }
    : isCostService
      ? { label: 'Open the dedicated review demo', to: COST_REVIEW_ROUTE }
      : isWorkflowService
        ? { label: 'Open the dedicated workflow demo', to: WORKFLOW_COMPOSER_ROUTE }
        : { label: 'Open the project fit page', to: discussUrl }
  const secondaryCta = isSandboxService || isCostService || isWorkflowService
    ? {
        label: isWorkflowService
          ? 'Discuss the workflow build'
          : isCostService
            ? 'Plan the cost review'
            : 'Discuss this demo flow',
        to: discussUrl,
      }
    : { label: 'Browse all services', to: SERVICES_DIRECTORY_ROUTE }
  const showArchitectureLink = isSandboxService
  const demoPanel = isSandboxService
    ? {
        eyebrow: 'Dedicated demo page',
        title: 'The live shell now sits on its own route',
        description:
          'The service page explains fit and delivery. The terminal, access panel, and guardrails live on a separate page so the demo can stay focused.',
        highlights: [
          'Launch directly into the browser shell from a dedicated route.',
          'Keep sign-in, access policy, and runtime controls together in one place.',
          'Move back into architecture or discussion only after the terminal has made its point.',
        ],
        primaryLabel: 'Open the live demo',
        primaryTo: LIVE_SANDBOX_ROUTE,
        secondaryLabel: 'View architecture',
        secondaryTo: ARCHITECTURE_STACK_ROUTE,
      }
    : isCostService
      ? {
          eyebrow: 'Dedicated demo page',
          title: 'The savings model now lives on its own route',
          description:
            'The service page stays about delivery scope and savings work itself. The scenario model now has its own page so it can be used without stacked service sections around it.',
          highlights: [
            'Adjust the scenario inputs without the rest of the page competing for space.',
            'Keep the estimate-to-discussion path sharper and easier to follow.',
            'Return here when you want delivery context instead of just the model.',
          ],
          primaryLabel: 'Open the review demo',
          primaryTo: COST_REVIEW_ROUTE,
          secondaryLabel: 'Plan the cost review',
          secondaryTo: discussUrl,
        }
      : isWorkflowService
        ? {
            eyebrow: 'Dedicated demo page',
            title: 'The workflow composer now lives on its own route',
            description:
              'The service page stays about automation architecture and delivery scope. The composer now has a separate page so visitors can shape the flow without the rest of the route competing for attention.',
            highlights: [
              'Adjust templates, approvals, and branching logic on a focused canvas.',
              'Keep the orchestration path readable instead of embedding it mid-page.',
              'Move into project scope only after the workflow shape feels right.',
            ],
            primaryLabel: 'Open the workflow demo',
            primaryTo: WORKFLOW_COMPOSER_ROUTE,
            secondaryLabel: 'Discuss the workflow build',
            secondaryTo: discussUrl,
          }
      : null

  return (
    <>
      <section className="page-hero">
        <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(18rem,0.96fr)] xl:items-start">
            <div className="relative z-10">
              <Link to={createServiceRoute()} className="soft-link inline-flex items-center gap-2">
                Back to services
              </Link>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">{service.eyebrow}</p>
              <h1 className="mt-3 max-w-4xl text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                {service.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-gray-300 sm:text-base">{service.summary}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={primaryCta.to} className="primary-button">
                  {primaryCta.label}
                </Link>
                <Link to={secondaryCta.to} className="secondary-button">
                  {secondaryCta.label}
                </Link>
                {showArchitectureLink ? (
                  <Link to={ARCHITECTURE_STACK_ROUTE} className="soft-link inline-flex items-center px-2 py-3">
                    View architecture
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="relative z-10 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
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

      <main className="page-shell">
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
            </div>
          </div>
        </section>

        {demoPanel ? (
          <section className="terminal-window">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">demo — route</div>
            </div>

            <div className="terminal-content">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-start">
                <div>
                  <span className="section-chip">{demoPanel.eyebrow}</span>
                  <h2 className="section-title text-3xl sm:text-4xl">{demoPanel.title}</h2>
                  <p className="section-copy">{demoPanel.description}</p>

                  <ul className="mt-6 space-y-3 text-sm leading-7 text-gray-300">
                    {demoPanel.highlights.map((item) => (
                      <li key={item} className="flex gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="metric-card p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Why this changed</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">The demo no longer has to fight the service page.</h3>
                  <p className="mt-4 text-sm leading-8 text-gray-400">
                    Keep this page for delivery shape, fit, and outcomes. Use the demo page when you want the live experience itself without the rest of the service route crowding it.
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <Link to={demoPanel.primaryTo} className="primary-button justify-center">
                      {demoPanel.primaryLabel}
                    </Link>
                    <Link to={demoPanel.secondaryTo} className="secondary-button justify-center">
                      {demoPanel.secondaryLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

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
      </main>
    </>
  )
}

export default ServiceDetailPage
