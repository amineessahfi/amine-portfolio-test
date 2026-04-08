import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import { SERVICES_DIRECTORY_ROUTE } from '../constants/routes'

const expertisePillars = [
  {
    title: 'Platform systems',
    description: 'Delivery foundations, paved roads, and runtime guardrails that let teams ship with less friction.',
  },
  {
    title: 'Cost discipline',
    description: 'Architecture and spend decisions that protect margin without making delivery slower.',
  },
  {
    title: 'Operational data',
    description: 'Pipelines and workflow systems built for environments where unreliable operations get expensive fast.',
  },
]

const metrics = [
  { value: '5+', label: 'Years across platform, cloud, and operational delivery' },
  { value: '50+', label: 'Systems, tools, and delivery workflows shaped' },
  { value: '30%+', label: 'Savings identified in targeted efficiency reviews' },
]

const focusAreas = [
  'Platform foundations',
  'Delivery automation',
  'Runtime safety',
  'Cost visibility',
  'Operational data',
  'Telecom-grade tooling',
]

function Hero() {
  return (
    <header className="page-hero">
      <div className="mx-auto max-w-7xl">
        <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] xl:items-start">
            <div className="relative z-10">
              <span className="section-chip">Platform systems / cost discipline / data operations</span>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.32em] text-primary-200/90">
                Engineering delivery for teams under real operational pressure
              </p>
              <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4.4rem] lg:leading-[1.02]">
                Platform, automation, and data systems that
                <span className="gradient-text"> hold up in production.</span>
              </h1>
              <p className="section-copy max-w-2xl text-base sm:text-lg">
                I help teams reduce delivery drag, expose waste, and turn complex operational tooling into systems that stay reliable, usable, and commercially sensible.
              </p>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
                <Link to={SERVICES_DIRECTORY_ROUTE} className="primary-button gap-2">
                  See service fit
                  <FaArrowRight className="text-xs" />
                </Link>
                <a href="#projects" className="soft-link inline-flex items-center justify-center px-2 py-3">
                  Review delivery proof
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="metric-card">
                    <p className="text-3xl font-semibold text-white sm:text-4xl">{metric.value}</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 space-y-5">
              <div className="metric-card p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Positioning</p>
                <h2 className="mt-4 text-2xl font-semibold text-white sm:text-[2rem]">
                  Delivery decisions tied to real operating constraints.
                </h2>
                <p className="mt-4 text-sm leading-8 text-gray-400">
                  The work sits between platform engineering, cost control, and operational tooling, where the answer has to make sense for engineers and the business at the same time.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                {expertisePillars.map((pillar) => (
                  <div key={pillar.title} className="metric-card p-5">
                    <p className="text-sm font-semibold text-white">{pillar.title}</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10 border-t border-white/10 pt-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Delivery strengths</p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                  Best suited to environments where reliability, operator clarity, and commercial pressure all matter at once.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {focusAreas.map((area) => (
                  <span key={area} className="skill-badge">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
