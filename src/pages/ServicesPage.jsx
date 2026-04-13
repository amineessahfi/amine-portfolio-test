import React from 'react'
import { Link } from 'react-router-dom'
import ServicesOverview from '../components/ServicesOverview'
import { createDiscussUrl } from '../constants/routes'

const deliverySteps = [
  {
    title: 'Assess',
    description:
      'Review the current stack, operating model, and delivery pain points to focus effort where it will matter most.',
  },
  {
    title: 'Design',
    description:
      'Turn that diagnosis into a practical architecture, delivery shape, and first scope that a team can actually adopt.',
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
  'A delivery shape matched to the team and the constraint',
  'Hands-on implementation when the work needs shipping, not just advice',
]

const fitSignals = [
  'Best when the pressure spans architecture, workflow, and team constraints rather than one isolated task.',
  'Useful when the first phase needs to turn into delivery quickly, not sit as a recommendations deck.',
  'Works well with internal teams that want hands-on collaboration, not a pure throw-over advisory model.',
]

function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="w-full">
          <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] xl:items-start">
              <div>
                <span className="section-chip">Services</span>
                <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
                  Choose the service path that matches the pressure, not the buzzword.
                </h1>
                <p className="section-copy max-w-3xl text-base sm:text-lg">
                  Each service is framed around the decision it should unlock, the first phase it should produce, and the proof you can inspect before you commit to the conversation.
                </p>

                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
                  <a href="#services-directory" className="secondary-button">
                    Browse the directory
                  </a>
                  <Link to={createDiscussUrl('', { intent: 'scope' })} className="primary-button">
                    Discuss the problem
                  </Link>
                </div>
              </div>

              <div className="rounded-[1.55rem] border border-white/10 bg-[#060b1b]/68 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.28)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">What a good start looks like</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                  {expectationPoints.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="page-shell">
        <ServicesOverview
          eyebrow="Service directory"
          title="Choose the service path that matches the problem you need solved"
          intro="Start with the type of pressure you need resolved, then move into the service page that makes the expected scope and proof points concrete."
          enableFilters
          sectionId="services-directory"
          surface="surface"
        />

        <section className="section-surface">
          <div className="section-surface-body">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(22rem,0.96fr)] xl:items-start">
              <div id="service-delivery-model" className="scroll-mt-28">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Approach</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">How the work usually lands</h2>
                  <p className="mt-4 max-w-3xl text-sm leading-8 text-gray-400">
                    The engagement should move from diagnosis into delivery shape quickly, then into implementation where the work actually needs to land.
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
