import React from 'react'
import { Link } from 'react-router-dom'
import IntakeTriggerButton from '../components/IntakeTriggerButton'
import ServicesOverview from '../components/ServicesOverview'
import { CLOUD_FIT_ROUTE, WORKFLOW_COMPOSER_ROUTE } from '../constants/routes'

const deliverySteps = [
  {
    title: 'Assess',
    description:
      'Review the current stack, operating model, and delivery pain points to focus effort where it will matter most.',
  },
  {
    title: 'Design',
    description:
      'Turn that diagnosis into a practical architecture and first delivery plan that a team can actually adopt.',
  },
  {
    title: 'Implement',
    description:
      'Ship the highest-value improvements with the team and leave behind clearer patterns, guardrails, and handoff points.',
  },
]

const engagementNotes = [
  'Architecture and platform assessments with decision-ready outputs',
  'Hands-on implementation alongside internal teams',
  'Short targeted audits or staged engagements for larger programmes',
  'Operational handoff, documentation, and enablement once the core work lands',
]

const expectationPoints = [
  'A concrete diagnosis of the bottleneck',
  'A delivery plan matched to the team and the constraint',
  'Hands-on implementation when the work needs shipping, not just advice',
]

const fitSignals = [
  'Best when the issue crosses architecture, workflow, and delivery constraints instead of one isolated task.',
  'Useful when the first phase needs to turn into real delivery quickly.',
  'Works best with teams that want hands-on collaboration, not a recommendations deck.',
]

const recommendedStarts = [
  {
    eyebrow: 'Cloud decision',
    title: 'Provider choice, service selection, or rollout shape is still fuzzy.',
    recommendation: 'Start with Cloud Fit, IaC & Deployment Packs.',
    to: CLOUD_FIT_ROUTE,
    label: 'Open cloud fit',
  },
  {
    eyebrow: 'Workflow drag',
    title: 'Approvals, escalations, or operator handoffs are slowing delivery.',
    recommendation: 'Start with Workflow Composer & Automation Orchestration.',
    to: WORKFLOW_COMPOSER_ROUTE,
    label: 'Open workflow proof',
  },
  {
    eyebrow: 'Platform, data, or telecom',
    title: 'The real issue sits in the delivery system underneath the product.',
    recommendation: 'Start in the directory or describe the bottleneck directly.',
    kind: 'intake',
    label: 'Discuss the problem',
  },
]

function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="w-full">
          <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] xl:items-start">
              <div>
                <span className="section-chip">Services</span>
                <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
                  Find the service that matches the bottleneck.
                </h1>
                <p className="section-copy max-w-3xl text-base sm:text-lg">
                  If you already know the kind of problem you have, start with the recommended path on the right. If not, browse the full directory below.
                </p>

                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
                  <a href="#services-directory" className="secondary-button">
                    Browse the directory
                  </a>
                  <IntakeTriggerButton className="primary-button">
                    Discuss the problem
                  </IntakeTriggerButton>
                </div>
              </div>

              <div className="rounded-[1.55rem] border border-white/10 bg-[#060b1b]/68 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.28)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Recommended starting paths</p>
                <div className="mt-4 space-y-4">
                  {recommendedStarts.map((item) => (
                    <div key={item.title} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-200">{item.eyebrow}</p>
                      <p className="mt-2 text-sm font-semibold leading-7 text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-7 text-gray-400">{item.recommendation}</p>
                      <div className="mt-4">
                        {item.kind === 'intake' ? (
                          <IntakeTriggerButton className="soft-link text-left">{item.label}</IntakeTriggerButton>
                        ) : (
                          <Link to={item.to} className="soft-link">
                            {item.label}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="page-shell">
        <ServicesOverview
          eyebrow="Full directory"
          title="Browse the full services directory"
          intro="If more than one path could fit, use the filters below and open the service page that makes the scope and proof concrete."
          enableFilters
          sectionId="services-directory"
          surface="surface"
        />

        <section className="section-surface">
          <div className="section-surface-body">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(22rem,0.96fr)] xl:items-start">
              <div id="service-delivery-model" className="scroll-mt-28">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Approach</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">How the work usually runs</h2>
                  <p className="mt-4 max-w-3xl text-sm leading-8 text-gray-400">
                    The work should move from diagnosis into a real delivery plan quickly, then into implementation where it actually needs to land.
                  </p>
                </div>

                <div className="content-scroller mt-6 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:[scroll-snap-type:none]">
                  {deliverySteps.map((step, index) => (
                    <div key={step.title} className="content-scroller-card rounded-[1.45rem] border border-white/10 bg-white/[0.03] px-5 py-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-400/25 bg-white/[0.04] text-sm font-semibold text-primary-200">
                          0{index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                          <p className="mt-3 text-sm leading-7 text-gray-400">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div id="service-engagement-model" className="scroll-mt-28 rounded-[1.55rem] border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Typical scope</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">How the engagement can start</h2>
                  </div>

                  <ul className="mt-5 space-y-3 text-sm leading-7 text-gray-300">
                    {engagementNotes.map((note) => (
                      <li key={note} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Good fit</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">When to bring the work in</h2>
                    <ul className="mt-5 space-y-3 text-sm leading-7 text-gray-300">
                      {fitSignals.map((signal) => (
                        <li key={signal} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default ServicesPage
