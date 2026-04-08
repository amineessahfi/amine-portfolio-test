import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaChartLine, FaCodeBranch, FaTerminal } from 'react-icons/fa'
import { COST_REVIEW_ROUTE, LIVE_SANDBOX_ROUTE, WORKFLOW_COMPOSER_ROUTE } from '../constants/routes'

const demoPages = [
  {
    eyebrow: 'Live shell',
    title: 'Test the live shell under real guardrails',
    description:
      'Open the browser shell when you want to judge launch clarity, access, and bounded runtime behavior in one pass.',
    highlights: ['Five-minute hard expiry', 'Optional identified access', 'Published sandbox architecture'],
    to: LIVE_SANDBOX_ROUTE,
    cta: 'Open live demo',
    icon: FaTerminal,
    dotClassName: 'bg-cyan-300',
    textClassName: 'text-cyan-200',
    iconClassName: 'text-cyan-300',
  },
  {
    eyebrow: 'Cost review',
    title: 'Model the savings case before you scope the cleanup',
    description:
      'Pressure-test the scenario inputs and see whether the likely efficiency gain is strong enough to justify a focused review.',
    highlights: ['Interactive scenario inputs', 'Fast savings signal', 'Direct handoff into a cost discussion'],
    to: COST_REVIEW_ROUTE,
    cta: 'Open review demo',
    icon: FaChartLine,
    dotClassName: 'bg-primary-300',
    textClassName: 'text-primary-200',
    iconClassName: 'text-primary-300',
  },
  {
    eyebrow: 'Workflow composer',
    title: 'Preview the workflow shape, then open the live studio',
    description:
      'Map triggers, branches, approvals, and the launch into the restricted editor when orchestration is the clearest proof point.',
    highlights: ['Template-driven orchestration', 'Restricted live studio launch', 'Clear handoff into delivery scope'],
    to: WORKFLOW_COMPOSER_ROUTE,
    cta: 'Open workflow demo',
    icon: FaCodeBranch,
    dotClassName: 'bg-violet-300',
    textClassName: 'text-violet-200',
    iconClassName: 'text-violet-300',
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
            <h2 className="section-title text-3xl sm:text-4xl">Open the strongest proof point first</h2>
          </div>
          <p className="max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
            The homepage previews the interactive work. Go straight to the demo that matches the bottleneck you want to evaluate.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                    Proof point
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
