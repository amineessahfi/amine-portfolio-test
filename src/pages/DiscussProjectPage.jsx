import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaArrowRight, FaEnvelope, FaLinkedin } from 'react-icons/fa'
import { LINKEDIN_URL, createDiscussEmailUrl } from '../constants/links'
import {
  ARCHITECTURE_STACK_ROUTE,
  AWS_CALCULATOR_ROUTE,
  LIVE_SANDBOX_ROUTE,
  SERVICES_DIRECTORY_ROUTE,
} from '../constants/routes'
import { getServiceBySlug } from '../data/services'

const topicPresets = {
  general: {
    eyebrow: 'Project fit',
    title: 'Bring the messy platform problem, not a polished brief.',
    intro:
      'Use this page when you want to move from browsing into a serious delivery conversation. The goal is to make the next step feel obvious, not salesy.',
    emailSubject: 'Project conversation',
    primaryLabel: 'Send the project brief',
    secondaryLabel: 'Browse service paths',
    secondaryTo: SERVICES_DIRECTORY_ROUTE,
  },
  'live-terminal-sandbox': {
    eyebrow: 'Sandbox fit',
    title: 'Turn the live terminal moment into a differentiator on your own platform.',
    intro:
      'If the sandbox is the part that caught your attention, tell me what visitors should be allowed to try, what must stay protected, and what the experience needs to prove.',
    emailSubject: 'Sandbox-led platform discussion',
    primaryLabel: 'Discuss the sandbox flow',
    secondaryLabel: 'Reopen the live sandbox',
    secondaryTo: LIVE_SANDBOX_ROUTE,
  },
  'aws-cost-optimization': {
    eyebrow: 'AWS fit',
    title: 'Take the calculator from rough estimate to a real savings plan.',
    intro:
      'If the model looks close to your current spend profile, the next move is a focused conversation around what is actually wasting money and what can be fixed first.',
    emailSubject: 'AWS optimization discussion',
    primaryLabel: 'Discuss the AWS review',
    secondaryLabel: 'Reopen the savings model',
    secondaryTo: AWS_CALCULATOR_ROUTE,
  },
}

const whatToBring = [
  'The bottleneck, cost pressure, or delivery friction you want removed',
  'Enough stack context to understand the current architecture and team constraints',
  'What success should look like in the first few weeks of work',
]

const platformRoutes = [
  {
    title: 'Live sandbox',
    description: 'Use the terminal demo when you want to feel the interactive product direction first.',
    to: LIVE_SANDBOX_ROUTE,
  },
  {
    title: 'AWS savings model',
    description: 'Use the calculator when cost pressure is the fastest way into the conversation.',
    to: AWS_CALCULATOR_ROUTE,
  },
  {
    title: 'Architecture page',
    description: 'Use the published system breakdown when you want to understand how the live demo is structured.',
    to: ARCHITECTURE_STACK_ROUTE,
  },
]

function DiscussProjectPage() {
  const [searchParams] = useSearchParams()
  const topic = searchParams.get('topic') || 'general'
  const preset = topicPresets[topic] || topicPresets.general
  const relatedService = getServiceBySlug(topic)
  const fitSignals = relatedService?.bestFor || whatToBring
  const nextStepSignals =
    relatedService?.deliverables || [
      'We align on the problem, the operating context, and the highest-leverage starting point.',
      'I map the likely delivery shape: audit, architecture pass, implementation sprint, or a staged engagement.',
      'You get a clear next step instead of a vague "let\'s keep in touch" answer.',
    ]

  return (
    <>
      <section className="page-hero">
        <div className="mx-auto max-w-7xl">
          <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] xl:items-start">
              <div className="relative z-10">
                <span className="section-chip">{preset.eyebrow}</span>
                <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
                  {preset.title}
                </h1>
                <p className="section-copy max-w-3xl text-base sm:text-lg">{preset.intro}</p>

                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
                  <a href={createDiscussEmailUrl(preset.emailSubject)} className="primary-button gap-2">
                    <FaEnvelope className="text-xs" />
                    {preset.primaryLabel}
                  </a>
                  <Link to={preset.secondaryTo} className="secondary-button gap-2">
                    {preset.secondaryLabel}
                    <FaArrowRight className="text-xs" />
                  </Link>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="soft-link inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3"
                  >
                    <FaLinkedin className="mr-2 text-xs" />
                    Connect on LinkedIn
                  </a>
                </div>
              </div>

              <div className="relative z-10 metric-card p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Why this page exists</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Keep the CTA inside the platform</h2>
                <p className="mt-4 text-sm leading-8 text-gray-400">
                  The site should move visitors from interest to proof to a serious conversation. This page is the handoff layer, so the next step feels deliberate instead of placeholder copy.
                </p>
                <div className="mt-6 space-y-3">
                  {whatToBring.map((item) => (
                    <div key={item} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-gray-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="page-shell">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">discuss — fit signals</div>
            </div>

            <div className="terminal-content">
              <div>
                <span className="section-chip">Best starting context</span>
                <h2 className="section-title text-3xl sm:text-4xl">What makes this a strong fit</h2>
                <p className="section-copy">
                  Share the version of the problem that is costing you time, clarity, or platform confidence right now.
                </p>
              </div>

              <ul className="space-y-3 text-sm leading-7 text-gray-300">
                {fitSignals.map((item) => (
                  <li key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="terminal-window">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">discuss — next step</div>
            </div>

            <div className="terminal-content">
              <div>
                <span className="section-chip">Conversation flow</span>
                <h2 className="section-title text-3xl sm:text-4xl">What happens after you reach out</h2>
              </div>

              <ol className="space-y-3">
                {nextStepSignals.map((item, index) => (
                  <li key={item} className="flex gap-4 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-7 text-gray-300">{item}</span>
                  </li>
                ))}
              </ol>

              <div className="rounded-[1.35rem] border border-primary-500/20 bg-primary-500/10 px-4 py-4 text-sm leading-7 text-primary-100">
                The outcome here is a sharp recommendation and a clear path into delivery, not a vague discovery loop.
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {platformRoutes.map((route) => (
            <article key={route.title} className="metric-card card-hover p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Use the platform first</p>
              <h3 className="mt-4 text-xl font-semibold text-white">{route.title}</h3>
              <p className="mt-4 text-sm leading-7 text-gray-400">{route.description}</p>
              <Link to={route.to} className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-200 transition-colors hover:text-white">
                Open route
                <FaArrowRight className="text-xs" />
              </Link>
            </article>
          ))}
        </section>
      </main>
    </>
  )
}

export default DiscussProjectPage
