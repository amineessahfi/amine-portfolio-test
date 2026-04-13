import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import { CLOUD_FIT_ROUTE, SERVICES_DIRECTORY_ROUTE, createDiscussUrl } from '../constants/routes'

const metrics = [
  { value: '5+', label: 'Years across platform, cloud, and operational delivery' },
  { value: '50+', label: 'Systems, tools, and delivery workflows shaped' },
  { value: '30%+', label: 'Savings identified in targeted efficiency reviews' },
]

const startOptions = [
  {
    label: 'Discuss a live problem',
    description: 'Use this when the issue is real and you need a fit verdict, architecture direction, or a credible first delivery plan.',
    to: createDiscussUrl('', { intent: 'scope' }),
    action: 'Open the intake',
  },
  {
    label: 'Review working proof',
    description: 'Use this when you want to inspect a planner, workflow model, or sandbox before turning it into a scoped project.',
    to: CLOUD_FIT_ROUTE,
    action: 'Open the demos',
  },
]

const fitSignals = [
  'Best when multiple systems, operators, and delivery constraints are in play at once.',
  'Useful for cloud, workflow, platform, data, and telecom-heavy programmes.',
  'Strongest when the next step needs to ship, not sit in a slide deck.',
]

function Hero() {
  return (
    <header className="page-hero">
      <div className="w-full">
        <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
          <div className="grid gap-12 xl:grid-cols-[minmax(0,1.08fr)_minmax(23rem,0.92fr)] xl:items-start">
            <div className="relative z-10">
              <span className="section-chip">Diagnose hidden failure / make change safer / restore operational trust</span>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.32em] text-primary-200/90">
                Complex operational systems under real pressure
              </p>
              <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4.4rem] lg:leading-[1.02]">
                Diagnose the hidden failure in complex systems.
                <span className="gradient-text"> Then make change safer.</span>
              </h1>
              <p className="section-copy max-w-2xl text-base sm:text-lg">
                I help teams diagnose platform, cloud, workflow, data, and telecom delivery problems when the symptom is obvious but the real failure point is buried underneath.
              </p>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
                <Link to={createDiscussUrl('', { intent: 'scope' })} className="primary-button gap-2">
                  Discuss the problem
                  <FaArrowRight className="text-xs" />
                </Link>
                <Link to={CLOUD_FIT_ROUTE} className="secondary-button gap-2">
                  Review live proof
                  <FaArrowRight className="text-xs" />
                </Link>
                <a href="#projects" className="soft-link inline-flex items-center justify-center px-2 py-3">
                  Review selected outcomes
                </a>
                <Link to={SERVICES_DIRECTORY_ROUTE} className="soft-link inline-flex items-center justify-center px-2 py-3">
                  Browse all services
                </Link>
              </div>

              <div className="content-scroller mt-10 border-t border-white/10 pt-6 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 sm:[scroll-snap-type:none]">
                {metrics.map((metric) => (
                  <div key={metric.label} className="content-scroller-card sm:pr-4">
                    <p className="text-3xl font-semibold text-white sm:text-4xl">{metric.value}</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 rounded-[1.9rem] border border-white/10 bg-[#060b1b]/72 p-6 shadow-[0_28px_90px_rgba(2,6,23,0.36)] backdrop-blur-2xl sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Where to start</p>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-[2rem]">
                Choose the clearest starting point.
              </h2>

              <div className="mt-6 space-y-4">
                {startOptions.map((option) => (
                  <Link
                    key={option.label}
                    to={option.to}
                    className="block rounded-[1.4rem] border border-white/10 bg-white/[0.035] px-5 py-5 transition hover:border-primary-400/30 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">{option.label}</p>
                        <p className="mt-2 text-sm leading-7 text-gray-400">{option.description}</p>
                      </div>
                      <span className="soft-link whitespace-nowrap">{option.action}</span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Best fit</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
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
    </header>
  )
}

export default Hero
