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
  const discussUrl = createDiscussUrl(service.slug, { intent: 'scope' })
  const primaryCta = isSandboxService
    ? { label: 'Open the live sandbox', to: LIVE_SANDBOX_ROUTE }
    : isCostService
      ? { label: 'Open the savings model', to: COST_REVIEW_ROUTE }
      : isWorkflowService
        ? { label: 'Open the workflow demo', to: WORKFLOW_COMPOSER_ROUTE }
        : { label: 'Start the project brief', to: discussUrl }
  const secondaryCta = isSandboxService || isCostService || isWorkflowService
    ? {
        label: isWorkflowService
          ? 'Discuss the workflow build'
          : isCostService
            ? 'Plan the cost review'
            : 'Discuss the sandbox build',
        to: discussUrl,
      }
    : { label: 'Browse all services', to: SERVICES_DIRECTORY_ROUTE }
  const showArchitectureLink = isSandboxService
  const demoPanel = isSandboxService
    ? {
        eyebrow: 'Hands-on proof',
        title: 'Open the live sandbox when you want to judge the product moment itself',
        description:
          'The demo lets you test launch clarity, access, guardrails, and the short-lived runtime in one pass before moving into scope.',
        highlights: [
          'Five-minute Linux session with bounded runtime controls.',
          'Optional sign-in when you want identified repeat access.',
          'Published sandbox architecture for teams that need to understand the system behind the experience.',
        ],
        primaryLabel: 'Open the live demo',
        primaryTo: LIVE_SANDBOX_ROUTE,
        secondaryLabel: 'View sandbox architecture',
        secondaryTo: ARCHITECTURE_STACK_ROUTE,
        supportingEyebrow: 'What the demo proves',
        supportingTitle: 'It should feel trustworthy before it feels clever.',
        supportingText:
          'The value is in the combination of launch flow, runtime guardrails, and a clear explanation of how the system stays bounded.',
      }
    : isCostService
      ? {
          eyebrow: 'Interactive proof',
          title: 'Open the savings model when you need a fast signal on efficiency',
          description:
            'Use the calculator to pressure-test spend, likely savings, and the business case before turning the work into a focused cost review.',
          highlights: [
            'Adjust the scenario inputs against your current spend pressure.',
            'See whether the likely savings are big enough to justify a real review.',
            'Move into a cost conversation only after the estimate feels directionally right.',
          ],
          primaryLabel: 'Open the review demo',
          primaryTo: COST_REVIEW_ROUTE,
          secondaryLabel: 'Plan the cost review',
          secondaryTo: discussUrl,
          supportingEyebrow: 'What the demo proves',
          supportingTitle: 'The savings case should become legible quickly.',
          supportingText:
            'The model is meant to create a fast decision: keep exploring, or move into a real efficiency engagement with clearer priorities.',
        }
      : isWorkflowService
        ? {
            eyebrow: 'Interactive proof',
            title: 'Open the workflow demo when orchestration design is the clearest proof point',
            description:
              'Preview triggers, branches, approvals, and the restricted live studio so you can judge the operating pattern before building the real workflow surface.',
            highlights: [
              'Template-led preview for triggers, branching, and human checkpoints.',
              'Temporary five-minute launch into the restricted live n8n studio.',
              'A cleaner handoff into the discussion once the orchestration pattern feels right.',
            ],
            primaryLabel: 'Open the workflow demo',
            primaryTo: WORKFLOW_COMPOSER_ROUTE,
            secondaryLabel: 'Discuss the workflow build',
            secondaryTo: discussUrl,
            supportingEyebrow: 'What the demo proves',
            supportingTitle: 'The orchestration pattern should feel build-worthy.',
            supportingText:
              'The preview and live studio should make it obvious whether the workflow deserves implementation and where guardrails need to stay.',
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
              <div className="text-sm text-gray-400">demo — proof</div>
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
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">{demoPanel.supportingEyebrow}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{demoPanel.supportingTitle}</h3>
                  <p className="mt-4 text-sm leading-8 text-gray-400">
                    {demoPanel.supportingText}
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
