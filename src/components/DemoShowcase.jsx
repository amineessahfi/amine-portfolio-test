import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaChartLine, FaShieldAlt, FaTerminal } from 'react-icons/fa'
import { ARCHITECTURE_STACK_ROUTE, AWS_CALCULATOR_ROUTE, LIVE_SANDBOX_ROUTE } from '../constants/routes'

const sandboxHighlights = [
  'Browser-based Linux shell',
  'Five-minute hard expiry',
  'Isolated runtime with bounded controls',
]

const calculatorHighlights = [
  'Interactive AWS savings model',
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
            <h2 className="section-title text-3xl sm:text-4xl">Jump straight to the proof, not just the page</h2>
          </div>
          <p className="max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
            These launch cards now land on the highlighted experience itself, so visitors hit the terminal or calculator where the value starts instead of re-scanning a long route from the middle.
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
                <h3 className="mt-4 text-2xl font-semibold text-white">Enter the SSH-style sandbox</h3>
              </div>
              <span className="skill-badge !px-3 !py-2 text-cyan-100">
                <FaTerminal className="text-cyan-300" />
                Linux demo
              </span>
            </div>

            <p className="mt-4 text-sm leading-8 text-gray-400">
              The strongest "show, don&apos;t tell" route: a browser terminal backed by a real ephemeral Linux runtime, designed to turn curiosity into a serious project conversation.
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
                Launch the live sandbox
                <FaArrowRight className="text-xs" />
              </Link>
              <Link to={ARCHITECTURE_STACK_ROUTE} className="secondary-button gap-2">
                <FaShieldAlt className="text-xs" />
                Inspect the architecture
              </Link>
            </div>
          </article>

          <article className="metric-card card-hover flex h-full flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary-300" />
                  <span className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-200">Cloud demo</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Run the AWS savings calculator</h3>
              </div>
              <span className="skill-badge !px-3 !py-2 text-primary-100">
                <FaChartLine className="text-primary-300" />
                Cost model
              </span>
            </div>

            <p className="mt-4 text-sm leading-8 text-gray-400">
              A fast commercial proof point for teams that already suspect waste in their AWS footprint and want a smarter entry into the review conversation.
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
              {calculatorHighlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <Link to={AWS_CALCULATOR_ROUTE} className="secondary-button gap-2">
                Open the AWS cost model
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
