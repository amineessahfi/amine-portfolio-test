import React from 'react'
import ServicesOverview from '../components/ServicesOverview'

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

function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="w-full">
          <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] xl:items-start">
              <div>
                <span className="section-chip">Services</span>
                <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
                  Choose the engagement that matches the pressure point.
                </h1>
                <p className="section-copy max-w-3xl text-base sm:text-lg">
                  Each service page is built to show what gets solved, what gets delivered, and where proof exists before you commit to a project conversation.
                </p>
              </div>

              <div className="metric-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">What you should expect</p>
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
          eyebrow="Offerings"
          title="Choose the service path that matches the problem you need solved"
          intro="Start with the bottleneck that is costing the most time, money, or operator confidence right now."
          sectionId="services-directory"
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">delivery — model</div>
            </div>

            <div className="terminal-content">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Approach</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">How the work usually lands</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {deliverySteps.map((step, index) => (
                  <div key={step.title} className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-5">
                    <p className="text-sm font-semibold text-primary-300">0{index + 1}</p>
                    <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-gray-400">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="terminal-window">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">engagement — notes</div>
            </div>

            <div className="terminal-content">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Typical scope</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">How the engagement can start</h2>
              </div>

              <ul className="space-y-3 text-sm leading-7 text-gray-300">
                {engagementNotes.map((note) => (
                  <li key={note} className="flex gap-3 rounded-2xl border border-dark-700/70 bg-dark-900/40 px-4 py-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default ServicesPage
