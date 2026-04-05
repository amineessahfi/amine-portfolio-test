import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaChartLine, FaTerminal } from 'react-icons/fa'
import { COST_REVIEW_ROUTE, LIVE_SANDBOX_ROUTE } from '../constants/routes'

const demoPages = [
  {
    eyebrow: 'Live shell',
    title: 'The terminal demo now has its own service page',
    description:
      'Open the browser shell on a focused sub-route where the runtime, access, and safety controls are not colliding with the rest of the service layout.',
    highlights: ['Five-minute hard expiry', 'Shared site auth at launch', 'Isolated runtime controls'],
    to: LIVE_SANDBOX_ROUTE,
    cta: 'Open live demo',
    icon: FaTerminal,
    dotClassName: 'bg-cyan-300',
    textClassName: 'text-cyan-200',
    iconClassName: 'text-cyan-300',
  },
  {
    eyebrow: 'Cost review',
    title: 'The savings model now runs on its own page',
    description:
      'Keep the calculator useful and the service route readable by giving the interactive review model a dedicated page under Services.',
    highlights: ['Interactive scenario inputs', 'Cleaner estimate-to-discussion flow', 'Dedicated service context nearby'],
    to: COST_REVIEW_ROUTE,
    cta: 'Open review demo',
    icon: FaChartLine,
    dotClassName: 'bg-primary-300',
    textClassName: 'text-primary-200',
    iconClassName: 'text-primary-300',
  },
]

function DemoShowcase() {
  return (
    <section className="terminal-window">
      <div className="terminal-header">
        <div className="text-sm text-gray-400">demos - launchpad</div>
      </div>

      <div className="terminal-content">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="section-chip">Interactive demos</span>
            <h2 className="section-title text-3xl sm:text-4xl">Each demo now lives on its own page under Services</h2>
          </div>
          <p className="max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
            The homepage now previews the demos instead of trying to hold them. Open the dedicated route you want and evaluate the proof point there.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {demoPages.map((demo) => {
            const Icon = demo.icon

            return (
              <article key={demo.title} className="metric-card card-hover flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${demo.dotClassName}`} />
                      <span className={`text-xs font-semibold uppercase tracking-[0.26em] ${demo.textClassName}`}>{demo.eyebrow}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-white">{demo.title}</h3>
                  </div>
                  <span className="skill-badge !px-3 !py-2 text-gray-100">
                    <Icon className={demo.iconClassName} />
                    Demo page
                  </span>
                </div>

                <p className="mt-4 text-sm leading-8 text-gray-400">{demo.description}</p>

                <ul className="mt-6 space-y-3 text-sm text-gray-300">
                  {demo.highlights.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${demo.dotClassName}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <Link to={demo.to} className="primary-button gap-2">
                    {demo.cta}
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default DemoShowcase
