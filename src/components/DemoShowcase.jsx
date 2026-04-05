import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaChartLine, FaTerminal } from 'react-icons/fa'
import { COST_REVIEW_ROUTE, LIVE_SANDBOX_ROUTE } from '../constants/routes'

const sandboxHighlights = [
  'Browser-based shell access',
  'Five-minute hard expiry',
  'Isolated runtime with bounded controls',
]

const reviewHighlights = [
  'Interactive savings model',
  'Fast commercial conversation starter',
  'Dedicated service page with deeper context',
]

const sandboxPreview = [
  '$ request-session',
  '> validate trusted origin',
  '> attach temporary shell',
  '> open secure browser terminal',
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
            <h2 className="section-title text-3xl sm:text-4xl">Open the proof point without the detour</h2>
          </div>
          <p className="max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
            Each route lands at the working surface itself, so the value shows up before the explanation gets in the way.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <article className="metric-card card-hover flex h-full flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 animate-pulse-slow rounded-full bg-cyan-300" />
                  <span className="text-xs font-semibold uppercase tracking-[0.26em] text-cyan-200">Live shell</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Launch the live shell</h3>
              </div>
              <span className="skill-badge !px-3 !py-2 text-cyan-100">
                <FaTerminal className="text-cyan-300" />
                Runtime demo
              </span>
            </div>

            <p className="mt-4 text-sm leading-8 text-gray-400">
              A browser terminal backed by a short-lived runtime, built to show real operational behavior instead of static screenshots.
            </p>

            <div className="mt-5 rounded-[1.4rem] border border-cyan-400/15 bg-[#040916]/80 p-4 font-mono text-xs leading-7 text-cyan-200">
              {sandboxPreview.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>

            <ul className="mt-5 space-y-3 text-sm text-gray-300">
              {sandboxHighlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={LIVE_SANDBOX_ROUTE} className="primary-button gap-2">
                Open the live shell
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </article>

          <article className="metric-card card-hover flex h-full flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary-300" />
                  <span className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-200">Cost review</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Run the savings model</h3>
              </div>
              <span className="skill-badge !px-3 !py-2 text-primary-100">
                <FaChartLine className="text-primary-300" />
                Scenario model
              </span>
            </div>

            <p className="mt-4 text-sm leading-8 text-gray-400">
              A fast way to frame infrastructure efficiency work around concrete inputs and a sharper review conversation.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-center">
                <p className="text-2xl font-semibold text-white">30%</p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-gray-500">Savings target</p>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-center">
                <p className="text-2xl font-semibold text-white">4</p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-gray-500">Input dimensions</p>
              </div>
              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-center">
                <p className="text-2xl font-semibold text-white">1</p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-gray-500">Conversion path</p>
              </div>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-gray-300">
              {reviewHighlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <Link to={COST_REVIEW_ROUTE} className="secondary-button gap-2">
                Open the review model
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default DemoShowcase
