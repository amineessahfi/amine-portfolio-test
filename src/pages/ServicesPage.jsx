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
      <section className="px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-dark-700/70 bg-dark-900/50 px-6 py-10 shadow-2xl shadow-black/20 backdrop-blur sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Services</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Dedicated service pages for platform, cloud, data, and telecom delivery.
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-gray-400 sm:text-base">
              If the website is meant to generate service work, visitors need clear offers and dedicated pages that explain the outcome, fit, and next step for each engagement.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 sm:gap-10 sm:px-6 lg:px-8">
        <ServicesOverview
          eyebrow="Offerings"
          title="Choose the service path that matches the problem you need solved"
          intro="Each service page is structured to support future expansion into richer case studies, lead forms, and more specific commercial messaging."
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
