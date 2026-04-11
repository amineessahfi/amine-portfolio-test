import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import { SERVICES_DIRECTORY_ROUTE, createDiscussUrl } from '../constants/routes'

const entryCards = [
  {
    title: 'Explore live proof',
    description: 'Start from demos, traces, and system maps when you want technical trust before you ask for scope.',
  },
  {
    title: 'Scope the diagnostic',
    description: 'Use the guided funnel when the problem is real and you want a first delivery shape, not just a chat.',
  },
  {
    title: 'Shared thesis',
    description: 'The common thread is diagnosing hidden failure, making change safer, and restoring enough trust to act.',
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
      <div className="w-full">
        <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] xl:items-start">
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
                I help teams see where flows break, how change ripples, and where to intervene first across telco operations, event-driven software, and real-time data.
              </p>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
                <a href="#home-proof" className="primary-button gap-2">
                  Explore live proof
                  <FaArrowRight className="text-xs" />
                </a>
                <Link to={createDiscussUrl('', { intent: 'scope' })} className="secondary-button gap-2">
                  Scope the diagnostic
                  <FaArrowRight className="text-xs" />
                </Link>
                <a href="#projects" className="soft-link inline-flex items-center justify-center px-2 py-3">
                  Review delivery proof
                </a>
                <Link to={SERVICES_DIRECTORY_ROUTE} className="soft-link inline-flex items-center justify-center px-2 py-3">
                  Browse service fit
                </Link>
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
                  One brand, two ways in.
                </h2>
                <p className="mt-4 text-sm leading-8 text-gray-400">
                  Start from live proof when you need technical trust first. Start from the diagnostic when the problem is already real and the next step needs shape.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                {entryCards.map((card) => (
                  <div key={card.title} className="metric-card p-5">
                    <p className="text-sm font-semibold text-white">{card.title}</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">{card.description}</p>
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
