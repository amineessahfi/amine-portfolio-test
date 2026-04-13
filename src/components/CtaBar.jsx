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
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:items-end">
            <div>
              <span className="section-chip">Next step</span>
              <h3 className="section-title text-3xl sm:text-4xl">Pick the path that gives you the clearest next move.</h3>
              <p className="section-copy max-w-3xl">
                Use the lighter proof path when you need to inspect the thinking first. Use the scoped diagnostic when the problem is real and you need a delivery-shaped answer.
              </p>
            </div>

            <div className="metric-card p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Response standard</p>
              <p className="mt-4 text-sm leading-8 text-gray-300">{responsePromise}</p>
            </div>
          </div>

          <div className="content-scroller xl:grid xl:grid-cols-2 xl:overflow-visible xl:pb-0 xl:[scroll-snap-type:none]">
            <div className="metric-card content-scroller-card p-6 sm:p-7 xl:h-full">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Proof-led path</p>
              <h4 className="mt-4 text-2xl font-semibold text-white">Start from proof when technical trust comes first.</h4>
              <p className="mt-4 text-sm leading-8 text-gray-400">
                Best when you want to inspect the direction, the surface area, or the product logic before you commit to a full project conversation.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link to={createDiscussUrl('', { intent: 'explore' })} className="primary-button gap-2">
                  <FaArrowRight />
                  Start from proof
                </Link>
                <Link to={LIVE_SANDBOX_ARCHITECTURE_ROUTE} className="secondary-button gap-2">
                  View sandbox architecture
                </Link>
              </div>
            </div>

            <div className="metric-card content-scroller-card p-6 sm:p-7 xl:h-full">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Scoped path</p>
              <h4 className="mt-4 text-2xl font-semibold text-white">Start the diagnostic when the pressure is already real.</h4>
              <p className="mt-4 text-sm leading-8 text-gray-400">
                Best when you need a fit verdict, a first delivery shape, and a clear recommendation on what should happen next.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link to={createDiscussUrl('', { intent: 'scope' })} className="primary-button gap-2">
                  <FaArrowRight />
                  Scope the diagnostic
                </Link>
                <Link to={SERVICES_DIRECTORY_ROUTE} className="secondary-button gap-2">
                  Browse service fit
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-4 border-t border-white/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-2xl text-sm leading-7 text-gray-400">
              For direct route selection, you can jump into the services directory, inspect the published sandbox system view, or go straight into a guided discussion.
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
