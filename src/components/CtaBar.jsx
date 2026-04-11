import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaTerminal } from 'react-icons/fa'
import {
  GITHUB_URL,
  LINKEDIN_URL,
} from '../constants/links'
import {
  CLOUD_FIT_ROUTE,
  LIVE_SANDBOX_ROUTE,
  SERVICES_DIRECTORY_ROUTE,
  WORKFLOW_COMPOSER_ROUTE,
  createDiscussUrl,
} from '../constants/routes'

function CtaBar() {
  return (
    <section id="contact" className="scroll-mt-24">
      <div className="hero-shell px-6 py-8 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <span className="section-chip">Next step</span>
          <h3 className="section-title text-3xl sm:text-4xl">Choose the path that matches your intent.</h3>
          <p className="section-copy">
            Start from proof when you want to inspect the system first. Start from scope when the problem is already real and you want a diagnostic, redesign, or implementation path.
          </p>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-2">
          <div className="metric-card p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Personal / proof-led</p>
            <h4 className="mt-4 text-2xl font-semibold text-white">Explore live proof before you ask for scope.</h4>
            <p className="mt-4 text-sm leading-8 text-gray-400">
              Use the demos, traces, and maps when you want to judge runtime safety, change ripple, or data freshness quickly and keep the next step technical.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to={createDiscussUrl('', { intent: 'explore' })} className="primary-button gap-2">
                <FaArrowRight />
                Start from proof
              </Link>
              <Link to={WORKFLOW_COMPOSER_ROUTE} className="secondary-button gap-2">
                Open workflow proof
              </Link>
              <Link to={LIVE_SANDBOX_ROUTE} className="secondary-button gap-2">
                <FaTerminal />
                Open live sandbox
              </Link>
            </div>
          </div>

          <div className="metric-card p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Company / enterprise</p>
            <h4 className="mt-4 text-2xl font-semibold text-white">Scope the diagnostic when the problem is already real.</h4>
              <p className="mt-4 text-sm leading-8 text-gray-400">
              Use the guided funnel when you need a fit verdict, a first delivery shape, and a faster move into diagnostics, redesign, or hands-on implementation.
              </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to={createDiscussUrl('', { intent: 'scope' })} className="primary-button gap-2">
                <FaArrowRight />
                Scope the diagnostic
              </Link>
              <Link to={SERVICES_DIRECTORY_ROUTE} className="secondary-button gap-2">
                See service fit
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <Link to={LIVE_SANDBOX_ROUTE} className="metric-card card-hover p-5">
            <p className="text-sm font-semibold text-white">Sandbox proof</p>
            <p className="mt-3 text-sm leading-7 text-gray-400">Use the live shell when runtime safety, access flow, and product feel need to be judged together.</p>
          </Link>

          <Link to={CLOUD_FIT_ROUTE} className="metric-card card-hover p-5">
            <p className="text-sm font-semibold text-white">Cloud fit proof</p>
            <p className="mt-3 text-sm leading-7 text-gray-400">Use the planner when you need a fast shortlist, explicit services listing, and a deploy-shaped next step.</p>
          </Link>

          <Link to={WORKFLOW_COMPOSER_ROUTE} className="metric-card card-hover p-5">
            <p className="text-sm font-semibold text-white">Workflow proof</p>
            <p className="mt-3 text-sm leading-7 text-gray-400">Use the composer when orchestration clarity and safe operator handoffs are the strongest proof points.</p>
          </Link>
        </div>
 
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
          <Link to={createDiscussUrl('', { intent: 'explore' })} className="soft-link">
            Proof-led note
          </Link>
          <Link to={createDiscussUrl('', { intent: 'scope' })} className="soft-link">
            Scoped funnel
          </Link>
          <Link to={SERVICES_DIRECTORY_ROUTE} className="soft-link">
            Browse services
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="soft-link">
            Code profile
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="soft-link">
            Professional profile
          </a>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="grid gap-4 text-center sm:grid-cols-2 xl:grid-cols-4">
            <div className="metric-card p-4">
              <div className="text-2xl font-semibold text-white">5+</div>
              <div className="mt-2 text-sm text-gray-400">Years in complex delivery</div>
            </div>
            <div className="metric-card p-4">
              <div className="text-2xl font-semibold text-white">30%+</div>
              <div className="mt-2 text-sm text-gray-400">Savings identified</div>
            </div>
            <div className="metric-card p-4">
              <div className="text-2xl font-semibold text-white">Fast</div>
              <div className="mt-2 text-sm text-gray-400">From diagnosis to action</div>
            </div>
            <div className="metric-card p-4">
              <div className="text-2xl font-semibold text-white">Hands-on</div>
              <div className="mt-2 text-sm text-gray-400">Architecture through handoff</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaBar
