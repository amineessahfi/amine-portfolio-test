import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import {
  CLOUD_FIT_ROUTE,
  LIVE_SANDBOX_ROUTE,
  SERVICES_DIRECTORY_ROUTE,
  WORKFLOW_COMPOSER_ROUTE,
  createDiscussUrl,
} from '../constants/routes'

const flagshipPath = {
  eyebrow: 'Cloud fit',
  title: 'Choose the right cloud stack and move into deploy-ready infrastructure.',
  description:
    'Use cloud fit when provider choice, service selection, or rollout shape is still fuzzy and you need a grounded recommendation fast.',
  highlights: ['Provider shortlist with real tradeoffs', 'Service bill before rollout', 'Review or deploy-pack handoff'],
  primaryLabel: 'Open cloud fit',
  primaryTo: CLOUD_FIT_ROUTE,
  secondaryLabel: 'Discuss cloud fit',
  secondaryTo: createDiscussUrl('cloud-fit-deployment', { intent: 'scope' }),
}

const secondaryPaths = [
  {
    eyebrow: 'Workflow systems',
    title: 'Map the operator flow before anyone builds the automation.',
    description:
      'Use this when approvals, retries, escalations, and handoffs need to be explicit before implementation starts.',
    highlights: ['Model the flow before implementation', 'Use the constrained live studio', 'Turn proof into scoped delivery'],
    primaryLabel: 'Open workflow proof',
    primaryTo: WORKFLOW_COMPOSER_ROUTE,
    secondaryLabel: 'Discuss workflow build',
    secondaryTo: createDiscussUrl('workflow-composer', { intent: 'scope' }),
  },
  {
    eyebrow: 'Platform, data & telecom',
    title: 'Fix the delivery system underneath the product.',
    description:
      'Use this when releases, environments, data flows, or telecom operations are creating drag that product work alone will not solve.',
    highlights: ['Platform diagnostics and paved roads', 'Operational data and orchestration patterns', 'Telecom-heavy internal tooling'],
    primaryLabel: 'Browse services',
    primaryTo: SERVICES_DIRECTORY_ROUTE,
    secondaryLabel: 'Discuss the problem',
    secondaryTo: createDiscussUrl('platform-engineering', { intent: 'scope' }),
  },
]

const proofSurfaces = [
  {
    title: 'Cloud fit planner',
    description:
      'Inspect provider tradeoffs, the service bill, and the deploy-pack path before the conversation turns commercial.',
    to: CLOUD_FIT_ROUTE,
  },
  {
    title: 'Workflow composer',
    description:
      'Preview approval, escalation, and operator flow logic before implementation starts.',
    to: WORKFLOW_COMPOSER_ROUTE,
  },
  {
    title: 'Live sandbox',
    description:
      'Inspect the browser Linux sandbox and see how the proof surface behaves in practice.',
    to: LIVE_SANDBOX_ROUTE,
  },
]

const selectedOutcomes = [
  {
    title: 'Semtech OTA platform',
    label: 'IoT delivery',
    description: 'Internal platform foundations for over-the-air updates across device fleets where rollout safety and operator clarity both mattered.',
    metric: 'Reduced deployment time by 70%',
    ctaLabel: 'Discuss similar platform work',
    ctaTo: createDiscussUrl('platform-engineering', { intent: 'scope' }),
  },
  {
    title: 'Data insight tooling',
    label: 'Operational data',
    description: 'Realtime data pipelines and reporting flows for telecom-heavy metrics where freshness and reliability directly shaped the operating model.',
    metric: 'Processed 2TB+ of daily data',
    ctaLabel: 'Discuss similar data work',
    ctaTo: createDiscussUrl('data-platforms', { intent: 'scope' }),
  },
  {
    title: 'SIM tooling platform',
    label: 'Telecom operations',
    description: 'Provisioning and lifecycle tooling for SIM operations where the platform had to reduce manual handling without hiding critical operator controls.',
    metric: 'Managed 500k+ SIM cards',
    ctaLabel: 'Discuss telecom tooling',
    ctaTo: createDiscussUrl('telco-tooling', { intent: 'scope' }),
  },
]

const workingModel = [
  {
    title: 'Diagnose',
    description: 'Identify the actual bottleneck, the surrounding constraints, and what the first meaningful fix should improve.',
  },
  {
    title: 'Shape',
    description: 'Turn that diagnosis into a concrete architecture, delivery slice, or operator workflow that a team can adopt.',
  },
  {
    title: 'Implement',
    description: 'Ship the highest-value change with the right guardrails, documentation, and handoff instead of stopping at recommendation.',
  },
]

function HomePage() {
  return (
    <>
      <Hero />

      <main className="page-shell lg:gap-12">
        <section id="home-services" className="section-surface scroll-mt-24">
          <div className="section-surface-body">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-end">
              <div>
                <span className="section-chip">Core offers</span>
                <h2 className="section-title text-3xl sm:text-4xl">Start from the decision you need to make.</h2>
              </div>
              <p className="max-w-3xl text-sm leading-8 text-gray-400 sm:text-base">
                Most engagements start in one of three places: cloud fit, workflow design, or the platform, data, and telecom systems underneath the product.
              </p>
            </div>

            <div className="space-y-5">
              <article className="relative overflow-hidden rounded-[1.85rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,28,0.92),rgba(8,12,26,0.68))] p-6 shadow-[0_28px_90px_rgba(2,6,23,0.34)] sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.12),transparent_34%)]" />
                <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] xl:items-start">
                  <div>
                    <span className="section-chip">{flagshipPath.eyebrow}</span>
                    <h3 className="mt-5 max-w-3xl text-3xl font-semibold text-white sm:text-[2.2rem] sm:leading-[1.08]">
                      {flagshipPath.title}
                    </h3>
                    <p className="mt-4 max-w-3xl text-sm leading-8 text-gray-400 sm:text-base">
                      {flagshipPath.description}
                    </p>

                    <ul className="mt-6 space-y-3 text-sm text-gray-300">
                      {flagshipPath.highlights.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.55rem] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Best when</p>
                    <p className="mt-4 text-sm leading-8 text-gray-300">
                      You need a grounded recommendation on provider choice, service selection, and rollout shape before anyone starts provisioning.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link to={flagshipPath.primaryTo} className="primary-button">
                        {flagshipPath.primaryLabel}
                      </Link>
                      <Link to={flagshipPath.secondaryTo} className="secondary-button">
                        {flagshipPath.secondaryLabel}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>

              <div className="content-scroller lg:hidden">
                {secondaryPaths.map((path) => (
                  <article
                    key={path.title}
                    className="content-scroller-card rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                  >
                    <span className="section-chip">{path.eyebrow}</span>
                    <h3 className="mt-5 text-2xl font-semibold text-white">{path.title}</h3>
                    <p className="mt-4 text-sm leading-8 text-gray-400">{path.description}</p>

                    <ul className="mt-5 space-y-3 text-sm text-gray-300">
                      {path.highlights.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link to={path.primaryTo} className="primary-button">
                        {path.primaryLabel}
                      </Link>
                      <Link to={path.secondaryTo} className="secondary-button">
                        {path.secondaryLabel}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden gap-4 lg:grid lg:grid-cols-2 lg:items-start">
                {secondaryPaths.map((path) => (
                  <article
                    key={path.title}
                    className="rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-7"
                  >
                    <span className="section-chip">{path.eyebrow}</span>
                    <h3 className="mt-5 text-2xl font-semibold text-white">{path.title}</h3>
                    <p className="mt-4 text-sm leading-8 text-gray-400">{path.description}</p>

                    <ul className="mt-5 space-y-3 text-sm text-gray-300">
                      {path.highlights.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link to={path.primaryTo} className="primary-button">
                        {path.primaryLabel}
                      </Link>
                      <Link to={path.secondaryTo} className="secondary-button">
                        {path.secondaryLabel}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <div className="rounded-[1.55rem] border border-white/10 bg-[#060b1b]/62 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.26)] sm:p-7">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Working proof</p>
                    <h3 className="mt-4 text-2xl font-semibold text-white">Review the proof before you scope the work.</h3>
                    <p className="mt-4 text-sm leading-8 text-gray-400">
                      These surfaces let you inspect the logic before the conversation becomes commercial.
                    </p>
                  </div>

                  <div className="content-scroller md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:[scroll-snap-type:none]">
                    {proofSurfaces.map((surface) => (
                      <Link
                        key={surface.title}
                        to={surface.to}
                        className="content-scroller-card rounded-[1.25rem] border border-white/10 bg-white/[0.035] px-4 py-4 transition hover:border-primary-400/30 hover:bg-white/[0.05]"
                      >
                        <p className="text-sm font-semibold text-white">{surface.title}</p>
                        <p className="mt-2 text-sm leading-7 text-gray-400">{surface.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section-surface scroll-mt-24">
          <div className="section-surface-body">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-end">
              <div>
                <span className="section-chip">Selected outcomes</span>
                <h2 className="section-title text-3xl sm:text-4xl">Representative delivery under real constraints.</h2>
              </div>
              <p className="max-w-3xl text-sm leading-8 text-gray-400 sm:text-base">
                A few concrete examples of the kind of delivery work this turns into.
              </p>
            </div>

            <div className="content-scroller lg:hidden">
              {selectedOutcomes.map((item) => (
                <article key={item.title} className="content-scroller-card rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-200">{item.label}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-gray-400">{item.description}</p>
                  <div className="mt-6 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm text-gray-100">
                    {item.metric}
                  </div>
                  <div className="mt-5">
                    <Link to={item.ctaTo} className="soft-link">
                      {item.ctaLabel}
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden divide-y divide-white/10 lg:block">
              {selectedOutcomes.map((item) => (
                <article
                  key={item.title}
                  className="grid gap-5 py-6 lg:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] lg:items-start lg:gap-8"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-200">{item.label}</p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-4 max-w-3xl text-sm leading-8 text-gray-400">{item.description}</p>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <div className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm text-gray-100">
                      {item.metric}
                    </div>
                    <Link to={item.ctaTo} className="soft-link">
                      {item.ctaLabel}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-surface">
          <div className="section-surface-body">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-end">
              <div>
                <span className="section-chip">Working model</span>
                <h2 className="section-title text-3xl sm:text-4xl">How the engagement usually lands.</h2>
              </div>
              <p className="max-w-3xl text-sm leading-8 text-gray-400 sm:text-base">
                Get to the bottleneck, shape the first move, then ship the part that matters.
              </p>
            </div>

            <div className="content-scroller md:hidden">
              {workingModel.map((step, index) => (
                <div key={step.title} className="content-scroller-card rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-sm font-semibold text-primary-300">0{index + 1}</p>
                  <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="hidden gap-4 md:grid md:grid-cols-3">
              {workingModel.map((step, index) => (
                <div key={step.title} className="rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-sm font-semibold text-primary-300">0{index + 1}</p>
                  <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default HomePage
