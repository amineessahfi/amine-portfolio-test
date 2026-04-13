import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import {
  GITHUB_URL,
  LINKEDIN_URL,
} from '../constants/links'
import {
  SERVICES_DIRECTORY_ROUTE,
  LIVE_SANDBOX_ARCHITECTURE_ROUTE,
  createDiscussUrl,
} from '../constants/routes'
import { responsePromise } from '../data/discussTopics'

function CtaBar() {
  return (
    <section id="contact" className="scroll-mt-24">
      <div className="section-surface">
        <div className="section-surface-body">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:items-end">
            <div>
              <span className="section-chip">Next step</span>
              <h3 className="section-title text-3xl sm:text-4xl">Choose the next step that fits the level of certainty you need.</h3>
              <p className="section-copy max-w-3xl">
                Review proof first when you want to inspect the logic. Use the intake when the problem is already live and you need a concrete recommendation.
              </p>
            </div>

            <div className="metric-card p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Response standard</p>
              <p className="mt-4 text-sm leading-8 text-gray-300">{responsePromise}</p>
            </div>
          </div>

          <div className="content-scroller xl:grid xl:grid-cols-2 xl:overflow-visible xl:pb-0 xl:[scroll-snap-type:none]">
            <div className="metric-card content-scroller-card p-6 sm:p-7 xl:h-full">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Proof first</p>
              <h4 className="mt-4 text-2xl font-semibold text-white">Review working proof before you scope the work.</h4>
              <p className="mt-4 text-sm leading-8 text-gray-400">
                Best when you want to inspect the planner, workflow logic, or sandbox surface before you commit to a project conversation.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link to={createDiscussUrl('', { intent: 'explore' })} className="primary-button gap-2">
                  <FaArrowRight />
                  Review the proof
                </Link>
                <Link to={LIVE_SANDBOX_ARCHITECTURE_ROUTE} className="secondary-button gap-2">
                  View sandbox architecture
                </Link>
              </div>
            </div>

            <div className="metric-card content-scroller-card p-6 sm:p-7 xl:h-full">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Bring a live problem</p>
              <h4 className="mt-4 text-2xl font-semibold text-white">Use the intake when you already need a real answer.</h4>
              <p className="mt-4 text-sm leading-8 text-gray-400">
                Best when you need a fit verdict, a first delivery plan, and a clear recommendation on what should happen next.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link to={createDiscussUrl('', { intent: 'scope' })} className="primary-button gap-2">
                  <FaArrowRight />
                  Open the intake
                </Link>
                <Link to={SERVICES_DIRECTORY_ROUTE} className="secondary-button gap-2">
                  Browse service fit
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-4 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-gray-400">
              If you already know the route, go straight to the services directory, the published sandbox architecture, or the intake.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
              <Link to={SERVICES_DIRECTORY_ROUTE} className="soft-link">
                Browse services
              </Link>
              <Link to={LIVE_SANDBOX_ARCHITECTURE_ROUTE} className="soft-link">
                Sandbox architecture
              </Link>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="soft-link">
                Code profile
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="soft-link">
                Professional profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaBar
