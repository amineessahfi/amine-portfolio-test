import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaTerminal } from 'react-icons/fa'
import {
  GITHUB_URL,
  LINKEDIN_URL,
  RESUME_REQUEST_URL,
  createDiscussEmailUrl,
} from '../constants/links'
import { COST_REVIEW_ROUTE, LIVE_SANDBOX_ROUTE, WORKFLOW_COMPOSER_ROUTE, createDiscussUrl } from '../constants/routes'

function CtaBar() {
  return (
    <section id="contact" className="scroll-mt-24">
      <div className="hero-shell px-6 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="max-w-xl">
            <span className="section-chip">Next step</span>
            <h3 className="section-title text-3xl sm:text-4xl">If the fit is real, send the brief.</h3>
            <p className="section-copy">
              A short project brief is enough when the problem is concrete. Share the bottleneck, the current environment, and the outcome you need, then move into scope from there.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)]">
            <div className="metric-card p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Best handoff</p>
              <h4 className="mt-4 text-2xl font-semibold text-white">Move from proof into a scoped conversation.</h4>
              <p className="mt-4 text-sm leading-8 text-gray-400">
                Use the discuss flow to package the pressure point, what has already been tried, and what a useful first engagement should actually achieve.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row xl:flex-col">
                <Link to={createDiscussUrl()} className="primary-button gap-2">
                  <FaArrowRight />
                  Start the project brief
                </Link>
                <Link to={LIVE_SANDBOX_ROUTE} className="secondary-button gap-2">
                  <FaTerminal />
                  Review the live sandbox
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <Link to={LIVE_SANDBOX_ROUTE} className="metric-card card-hover p-5">
                <p className="text-sm font-semibold text-white">Sandbox proof</p>
                <p className="mt-3 text-sm leading-7 text-gray-400">Use the live shell when runtime safety, access flow, and product feel need to be judged together.</p>
              </Link>

              <Link to={COST_REVIEW_ROUTE} className="metric-card card-hover p-5">
                <p className="text-sm font-semibold text-white">Savings proof</p>
                <p className="mt-3 text-sm leading-7 text-gray-400">Use the model when you need a fast signal on whether a cost-efficiency review is worth pursuing now.</p>
              </Link>

              <Link to={WORKFLOW_COMPOSER_ROUTE} className="metric-card card-hover p-5">
                <p className="text-sm font-semibold text-white">Workflow proof</p>
                <p className="mt-3 text-sm leading-7 text-gray-400">Use the composer when orchestration clarity and safe operator handoffs are the strongest proof points.</p>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
          <a href={createDiscussEmailUrl()} className="soft-link">
            Email the brief
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="soft-link">
            Code profile
          </a>
          <a href={RESUME_REQUEST_URL} className="soft-link">
            Request resume
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
