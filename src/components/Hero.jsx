import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import IntakeTriggerButton from './IntakeTriggerButton'
import {
  CLOUD_FIT_ROUTE,
  LIVE_SANDBOX_ROUTE,
  SERVICES_DIRECTORY_ROUTE,
  WORKFLOW_COMPOSER_ROUTE,
} from '../constants/routes'

const firstOutputs = [
  {
    label: 'Fit verdict',
    description: 'A clear read on where the real problem sits and whether the work is a strong fit.',
  },
  {
    label: 'First delivery plan',
    description: 'A practical first phase instead of a vague discovery loop.',
  },
  {
    label: 'Clear next step',
    description: 'Move into proof, review, or implementation with less ambiguity.',
  },
]

const proofSurfaces = [
  { label: 'Cloud fit planner', to: CLOUD_FIT_ROUTE },
  { label: 'Workflow composer', to: WORKFLOW_COMPOSER_ROUTE },
  { label: 'Live sandbox', to: LIVE_SANDBOX_ROUTE },
]

function Hero() {
  return (
    <header className="page-hero">
      <div className="w-full">
        <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
          <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] xl:items-start">
            <div className="relative z-10">
              <span className="section-chip sm:hidden">Technical systems consulting</span>
              <span className="section-chip hidden sm:inline-flex">
                Independent consulting for cloud, workflow, platform, data, and telecom systems
              </span>
              <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4.4rem] lg:leading-[1.02]">
                I help teams fix technical systems that are slowing delivery or increasing risk.
              </h1>
              <p className="section-copy max-w-2xl text-base sm:text-lg">
                Best when the issue sits in cloud, workflow, platform, data, or telecom operations and you need a diagnosis, a clear recommendation, and a credible first delivery plan.
              </p>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
                <IntakeTriggerButton className="primary-button gap-2">
                  Discuss the problem
                  <FaArrowRight className="text-xs" />
                </IntakeTriggerButton>
                <Link to={CLOUD_FIT_ROUTE} className="secondary-button gap-2">
                  Review live proof
                  <FaArrowRight className="text-xs" />
                </Link>
                <Link to={SERVICES_DIRECTORY_ROUTE} className="soft-link inline-flex items-center justify-center px-2 py-3">
                  Browse all services
                </Link>
              </div>

              <div className="content-scroller mt-10 border-t border-white/10 pt-6 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 sm:[scroll-snap-type:none]">
                {firstOutputs.map((item) => (
                  <div key={item.label} className="content-scroller-card sm:pr-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-200">{item.label}</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 rounded-[1.9rem] border border-white/10 bg-[#060b1b]/72 p-6 shadow-[0_28px_90px_rgba(2,6,23,0.36)] backdrop-blur-2xl sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Fastest way in</p>
              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-[2rem]">
                Start with the path that matches how certain you already are.
              </h2>
              <p className="mt-4 text-sm leading-8 text-gray-400">
                If the problem is already live, open the intake. If you need technical trust first, review the proof surfaces before you scope the work.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <IntakeTriggerButton className="primary-button gap-2">
                  Open the intake
                  <FaArrowRight className="text-xs" />
                </IntakeTriggerButton>
                <Link to={CLOUD_FIT_ROUTE} className="secondary-button gap-2">
                  Review proof first
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Proof you can inspect now</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {proofSurfaces.map((surface) => (
                    <Link key={surface.label} to={surface.to} className="secondary-button !px-4 !py-2.5">
                      {surface.label}
                    </Link>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-gray-400">
                  If you already know the service lane, you can also go straight to the directory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
