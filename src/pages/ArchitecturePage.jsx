import React from 'react'
import { Link } from 'react-router-dom'
import { LIVE_SANDBOX_ROUTE, LIVE_SANDBOX_SERVICE_ROUTE, createDiscussUrl } from '../constants/routes'

const architectureLayers = [
  {
    title: 'Browser terminal client',
    summary: 'The React frontend renders the sandbox page, opens the terminal UI, and manages the session countdown in the browser.',
  },
  {
    title: 'Frontend delivery layer',
    summary: 'The portfolio is delivered as a static Vercel application, so architecture and sandbox pages live inside the same client-side route tree.',
  },
  {
    title: 'Sandbox control plane',
    summary: 'The backend validates trusted origins, enforces rate and capacity limits, issues short-lived session tokens, and brokers PTY traffic.',
  },
  {
    title: 'Execution layer',
    summary: 'Every visitor receives a fresh Docker-based Linux shell that is destroyed when the timer expires, the session disconnects, or the process exits.',
  },
]

const stackFlow = [
  {
    label: '01',
    title: 'Visitor browser',
    text: 'The user lands on the sandbox demo page and launches a session from a browser-delivered terminal UI.',
  },
  {
    label: '02',
    title: 'Vercel-hosted frontend',
    text: 'The React application serves the interface, copy, routing, and launch flow for the sandbox experience.',
  },
  {
    label: '03',
    title: 'Public reverse proxy',
    text: 'A reverse proxy terminates TLS and routes sandbox traffic from the public path to the backend control plane.',
  },
  {
    label: '04',
    title: 'Sandbox session broker',
    text: 'The backend verifies origin, applies session limits, creates temporary session state, and upgrades terminal traffic to WebSocket.',
  },
  {
    label: '05',
    title: 'Ephemeral Linux runtime',
    text: 'A constrained container starts on demand, attaches to a PTY, and is cleaned up automatically when the session ends.',
  },
]

const requestFlow = [
  'A visitor lands on the sandbox demo page and requests a session from the browser UI.',
  'The backend validates the browser origin, tracks complimentary anonymous usage, and checks per-visitor and total-capacity limits.',
  'A short-lived session token is issued and the browser upgrades to a WebSocket connection.',
  'The backend starts an isolated container and relays shell input/output between browser and runtime.',
  'Automatic cleanup destroys the session on timeout, disconnect, or process exit.',
]

const guardrails = [
  'Five-minute hard session lifetime',
  'Isolated Docker container per session',
  'No outbound network access from the runtime',
  'Read-only base filesystem with temporary writable scratch space',
  'Non-root execution and dropped Linux capabilities',
  'CPU, memory, process, and file descriptor limits',
  'One complimentary anonymous launch before Google-backed repeat access',
  'Per-visitor throttling plus a global concurrent session cap',
  'Trusted-origin enforcement for both session creation and terminal upgrade',
]

const omittedDetails = [
  'Environment variable names and values',
  'Session token structure or signing details',
  'Private deployment paths or secret host configuration',
  'Operational credentials, secrets, or internal-only runtime data',
]

const headlineStats = [
  { label: 'Frontend', value: 'React + Vercel' },
  { label: 'Gateway', value: 'TLS + reverse proxy' },
  { label: 'Backend', value: 'Session broker + PTY relay' },
  { label: 'Runtime', value: 'Ephemeral Docker shell' },
]

function ArchitecturePage() {
  return (
    <>
      <section className="page-hero">
        <div className="w-full">
          <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] xl:items-start">
              <div className="relative z-10">
                <Link to={LIVE_SANDBOX_SERVICE_ROUTE} className="soft-link inline-flex items-center gap-2">
                  Back to live sandbox service
                </Link>
                <div className="mt-6">
                  <span className="section-chip">Sandbox architecture</span>
                  <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
                    Live sandbox architecture,
                    <span className="gradient-text"> from browser to bounded runtime</span>
                  </h1>
                  <p className="section-copy max-w-3xl text-base sm:text-lg">
                    This page sits under the sandbox service because it explains one proof surface in depth: how the browser UI, public routing layer, backend broker, and ephemeral runtime fit together without exposing secrets.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to={LIVE_SANDBOX_ROUTE} className="primary-button">
                    Open sandbox demo
                  </Link>
                  <Link to={createDiscussUrl('live-terminal-sandbox')} className="secondary-button">
                    Discuss the sandbox build
                  </Link>
                </div>
              </div>

              <div className="relative z-10 metric-card p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Published system view</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Architecture for one delivery surface</h2>
                <p className="mt-4 text-sm leading-8 text-gray-400">
                  It is detailed enough to explain the product and security model behind the sandbox, but intentionally avoids secrets, internal values, and deployment-only implementation details.
                </p>

                <div className="mt-6 space-y-3">
                  {omittedDetails.map((item) => (
                    <div key={item} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-gray-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {headlineStats.map((stat) => (
                <div key={stat.label} className="metric-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">{stat.label}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="page-shell">
        <section id="stack-flow" className="grid scroll-mt-28 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">architecture - system stack</div>
            </div>

            <div className="terminal-content">
              <div>
                <span className="section-chip">Stack flow</span>
                <h2 className="section-title text-3xl sm:text-4xl">How traffic moves through the system</h2>
                <p className="section-copy">
                  Instead of an ASCII sketch, this page uses a layered flow so visitors can understand the relationship between the browser, public edge, control plane, and runtime boundary.
                </p>
              </div>

              <div className="space-y-4">
                {stackFlow.map((item, index) => (
                  <div key={item.title} className="relative">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 shadow-[0_18px_60px_rgba(2,6,23,0.28)]">
                      <div className="flex items-start gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-400/20 bg-primary-500/10 text-sm font-semibold text-primary-200">
                          {item.label}
                        </span>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                          <p className="mt-3 text-sm leading-7 text-gray-400">{item.text}</p>
                        </div>
                      </div>
                    </div>
                    {index < stackFlow.length - 1 ? (
                      <div className="mx-auto h-6 w-px bg-gradient-to-b from-primary-400/60 to-cyan-300/10" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="text-sm text-gray-400">architecture - request lifecycle</div>
              </div>

              <div className="terminal-content">
                <div>
                  <span className="section-chip">Session lifecycle</span>
                  <h2 className="section-title text-3xl sm:text-4xl">From click to container cleanup</h2>
                </div>

                <ol className="space-y-3">
                  {requestFlow.map((step, index) => (
                    <li key={step} className="flex gap-4 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <span className="text-sm leading-7 text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="terminal-window">
              <div className="terminal-header">
                <div className="text-sm text-gray-400">architecture - boundaries</div>
              </div>

              <div className="terminal-content">
                <div>
                  <span className="section-chip">Guardrails</span>
                  <h2 className="section-title text-3xl sm:text-4xl">Controls that keep the sandbox bounded</h2>
                </div>

                <div className="flex flex-wrap gap-3">
                  {guardrails.map((item) => (
                    <div key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-gray-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {architectureLayers.map((layer) => (
            <article key={layer.title} className="metric-card card-hover p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Layer</p>
              <h3 className="mt-4 text-xl font-semibold text-white">{layer.title}</h3>
              <p className="mt-4 text-sm leading-7 text-gray-400">{layer.summary}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  )
}

export default ArchitecturePage
