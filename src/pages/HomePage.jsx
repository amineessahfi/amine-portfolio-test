import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import {
  CLOUD_FIT_ROUTE,
  SERVICES_DIRECTORY_ROUTE,
  WORKFLOW_COMPOSER_ROUTE,
  createDiscussUrl,
} from '../constants/routes'

const problemPaths = [
  {
    eyebrow: 'Cloud decisions',
    title: 'Choose the right cloud stack and rollout path.',
    description:
      'Best when provider choice, service selection, or deployment shape is still fuzzy and you need a grounded recommendation fast.',
    bestFirstOutput: 'Shortlist, service bill, and review or deploy-pack recommendation.',
    primaryLabel: 'Open cloud fit',
    primaryTo: CLOUD_FIT_ROUTE,
    secondaryLabel: 'Discuss cloud fit',
    secondaryTo: createDiscussUrl('cloud-fit-deployment', { intent: 'scope' }),
  },
  {
    eyebrow: 'Workflow design',
    title: 'Map the operator flow before anyone automates it.',
    description:
      'Best when approvals, escalations, retries, and handoffs need to be explicit before implementation starts.',
    bestFirstOutput: 'A clearer flow model, a better implementation handoff, or proof that the workflow deserves the build.',
    primaryLabel: 'Open workflow proof',
    primaryTo: WORKFLOW_COMPOSER_ROUTE,
    secondaryLabel: 'Discuss workflow build',
    secondaryTo: createDiscussUrl('workflow-composer', { intent: 'scope' }),
  },
  {
    eyebrow: 'Platform, data & telecom',
    title: 'Fix the delivery system underneath the product.',
    description:
      'Best when the real drag sits in releases, internal tooling, data movement, or telecom operations rather than the product layer alone.',
    bestFirstOutput: 'A concrete first phase for platform cleanup, operational data work, or internal tooling changes.',
    primaryLabel: 'Browse services',
    primaryTo: SERVICES_DIRECTORY_ROUTE,
    secondaryLabel: 'Discuss the problem',
    secondaryTo: createDiscussUrl('platform-engineering', { intent: 'scope' }),
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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-end">
              <div>
                <span className="section-chip">Common starting points</span>
                <h2 className="section-title text-3xl sm:text-4xl">Most engagements start when one of these problems becomes hard to ignore.</h2>
              </div>
              <p className="max-w-3xl text-sm leading-8 text-gray-400 sm:text-base">
                If you already know the pressure, start with the matching path below. If not, browse the full services directory and narrow it down from there.
              </p>
            </div>

            <div className="content-scroller lg:grid lg:grid-cols-3 lg:items-start lg:overflow-visible lg:pb-0 lg:[scroll-snap-type:none]">
              {problemPaths.map((path) => (
                <article
                  key={path.title}
                  className="content-scroller-card rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-7"
                >
                  <span className="section-chip">{path.eyebrow}</span>
                  <h3 className="mt-5 text-2xl font-semibold text-white">{path.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-gray-400">{path.description}</p>

                  <div className="mt-6 rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-200">Best first output</p>
                    <p className="mt-2 text-sm leading-7 text-gray-300">{path.bestFirstOutput}</p>
                  </div>

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
          </div>
        </section>

        <section id="projects" className="section-surface scroll-mt-24">
          <div className="section-surface-body">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-end">
              <div>
                <span className="section-chip">Selected outcomes</span>
                <h2 className="section-title text-3xl sm:text-4xl">What this work has looked like in practice.</h2>
              </div>
              <p className="max-w-3xl text-sm leading-8 text-gray-400 sm:text-base">
                A few concrete examples of the kinds of systems involved and the outcomes the first phase was meant to create.
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
                  className="grid grid-cols-1 gap-5 py-6 lg:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] lg:items-start lg:gap-8"
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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-end">
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
