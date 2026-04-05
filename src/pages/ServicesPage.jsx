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
      'Translate that assessment into a practical architecture, roadmap, and service approach that teams can actually adopt.',
  },
  {
    title: 'Implement',
    description:
      'Work hands-on with engineering teams to ship the highest-value improvements and leave behind maintainable patterns.',
  },
]

const engagementNotes = [
  'Architecture and platform assessments',
  'Hands-on implementation with internal teams',
  'Short targeted audits or longer delivery engagements',
  'Follow-up enablement, docs, and operational handoff',
]

function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="mx-auto max-w-7xl">
          <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] xl:items-start">
              <div>
                <span className="section-chip">Services</span>
                <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
                  Choose the route that matches the bottleneck you want
                  <span className="gradient-text"> gone</span>
                  .
                </h1>
                <p className="section-copy max-w-3xl text-base sm:text-lg">
                  These pages are built so visitors can self-qualify fast: pick the problem, open the strongest proof point, and decide whether it is time to start a real project conversation.
                </p>
              </div>

              <div className="metric-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Why this layout</p>
                <p className="mt-4 text-sm leading-8 text-gray-400">
                  A premium service site needs sharper hierarchy and more deliberate routing than a flat one-pager. Each path here is meant to pull the visitor toward the right action instead of just showing more content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="page-shell">
        <ServicesOverview
          eyebrow="Offerings"
          title="Choose the service path that matches the problem you need solved"
          intro="Open the route that looks closest to your current friction point, then move from proof into the discuss page once the fit is clear."
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
                <h2 className="mt-2 text-2xl font-semibold text-white">How engagements usually work</h2>
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
                <h2 className="mt-2 text-2xl font-semibold text-white">Flexible engagement model</h2>
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
