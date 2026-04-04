import React from 'react'
import { Link } from 'react-router-dom'

const architectureLayers = [
  {
    title: 'Browser terminal client',
    description:
      'A React page renders the terminal experience in the browser, requests a sandbox session over HTTPS, and switches to a WebSocket stream once the session is approved.',
  },
  {
    title: 'Frontend delivery layer',
    description:
      'The public site is shipped as a static frontend on Vercel. Routing stays client-side, so the architecture page and sandbox pages are delivered from the same application shell.',
  },
  {
    title: 'Sandbox control plane',
    description:
      'A dedicated backend on a Linux host receives session requests, validates the browser origin, applies rate and capacity limits, creates short-lived tokens, and brokers terminal traffic.',
  },
  {
    title: 'Execution layer',
    description:
      'Each visitor gets a fresh Docker container running a constrained Linux shell. The session is destroyed on disconnect or when the five-minute limit is reached.',
  },
]

const requestFlow = [
  'The visitor opens the sandbox service page and launches a session from the browser.',
  'The frontend sends a session request to the sandbox backend through the public reverse proxy.',
  'The backend checks origin policy, per-visitor limits, and total system capacity before approving the request.',
  'A short-lived token is issued and the browser upgrades to a WebSocket terminal connection.',
  'The backend starts an isolated container, attaches a PTY, and streams shell input and output between browser and container.',
  'Cleanup runs automatically when the timer expires, the process exits, or the browser disconnects.',
]

const guardrails = [
  'Five-minute hard session lifetime',
  'Isolated Docker container per session',
  'No outbound network access from the sandbox',
  'Read-only base filesystem with temporary writable scratch space',
  'Non-root execution and dropped Linux capabilities',
  'CPU, memory, process, and file-descriptor limits',
  'Per-visitor rate limiting and a global concurrent session cap',
  'Trusted-origin enforcement for session creation and terminal upgrade',
]

const omittedDetails = [
  'No environment variable names or values',
  'No session token formats or secret material',
  'No private filesystem paths beyond high-level architecture concepts',
  'No operational credentials or deployment secrets',
]

const diagram = String.raw`
+---------------------------+
| Visitor browser           |
| React + terminal UI       |
+-------------+-------------+
              |
              | HTTPS session request
              | WebSocket terminal stream
              v
+---------------------------+
| Vercel-hosted frontend    |
| Static delivery + routing |
+-------------+-------------+
              |
              | Public sandbox path
              v
+---------------------------+
| Reverse proxy on host     |
| TLS termination + routing |
+-------------+-------------+
              |
              v
+---------------------------+
| Sandbox backend           |
| Session broker + PTY hub  |
+-------------+-------------+
              |
              | docker run
              v
+---------------------------+
| Ephemeral Linux container |
| Non-root, isolated shell  |
+---------------------------+
`

function ArchitecturePage() {
  return (
    <>
      <section className="px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[2rem] border border-dark-700/70 bg-dark-900/50 px-6 py-10 shadow-2xl shadow-black/20 backdrop-blur sm:px-10 sm:py-12">
            <Link to="/services/live-terminal-sandbox" className="text-sm text-primary-300 transition-colors hover:text-primary-200">
              ← Back to sandbox service
            </Link>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Architecture</p>
            <h1 className="mt-3 max-w-4xl text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Live sandbox architecture
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-gray-400 sm:text-base">
              This page explains the architecture behind the five-minute browser-accessible Linux sandbox: what runs in the browser, what runs on the backend host, and which controls keep the
              demo constrained.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              <div className="metric-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Frontend</p>
                <p className="mt-3 text-lg font-semibold text-white">React on Vercel</p>
              </div>
              <div className="metric-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Gateway</p>
                <p className="mt-3 text-lg font-semibold text-white">Reverse proxy + TLS</p>
              </div>
              <div className="metric-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Backend</p>
                <p className="mt-3 text-lg font-semibold text-white">Session broker + PTY relay</p>
              </div>
              <div className="metric-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Runtime</p>
                <p className="mt-3 text-lg font-semibold text-white">Ephemeral Docker shell</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 sm:gap-10 sm:px-6 lg:px-8">
        <section className="terminal-window">
          <div className="terminal-header">
            <div className="text-sm text-gray-400">architecture — diagram</div>
          </div>

          <div className="terminal-content">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">System map</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">High-level deployment view</h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-dark-700/70 bg-dark-950/80 p-5">
              <pre className="min-w-[42rem] whitespace-pre text-sm leading-6 text-gray-300">{diagram}</pre>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          {architectureLayers.map((layer) => (
            <div key={layer.title} className="terminal-window">
              <div className="terminal-header">
                <div className="text-sm text-gray-400">architecture — layer</div>
              </div>

              <div className="terminal-content">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Layer</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{layer.title}</h2>
                <p className="mt-4 text-sm leading-8 text-gray-400">{layer.description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">architecture — flow</div>
            </div>

            <div className="terminal-content">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Request lifecycle</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">How a session moves through the system</h2>
              </div>

              <ol className="space-y-3 text-sm leading-7 text-gray-300">
                {requestFlow.map((step, index) => (
                  <li key={step} className="flex gap-4 rounded-2xl border border-dark-700/70 bg-dark-900/40 px-4 py-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500/15 text-sm font-semibold text-primary-300">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="space-y-6">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="text-sm text-gray-400">architecture — controls</div>
              </div>

              <div className="terminal-content">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Guardrails</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Controls that keep the sandbox bounded</h2>
                </div>

                <ul className="space-y-3 text-sm leading-7 text-gray-300">
                  {guardrails.map((item) => (
                    <li key={item} className="flex gap-3 rounded-2xl border border-dark-700/70 bg-dark-900/40 px-4 py-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="terminal-window">
              <div className="terminal-header">
                <div className="text-sm text-gray-400">architecture — published scope</div>
              </div>

              <div className="terminal-content">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Intentionally omitted</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">What this public page does not expose</h2>
                </div>

                <ul className="space-y-3 text-sm leading-7 text-gray-300">
                  {omittedDetails.map((item) => (
                    <li key={item} className="flex gap-3 rounded-2xl border border-dark-700/70 bg-dark-900/40 px-4 py-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/services/live-terminal-sandbox"
                    className="inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    Open sandbox service
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex rounded-xl border border-dark-600 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-dark-700"
                  >
                    Browse all services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default ArchitecturePage
