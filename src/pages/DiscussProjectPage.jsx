import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaArrowRight, FaEnvelope, FaLinkedin } from 'react-icons/fa'
import { LINKEDIN_URL, createDiscussEmailUrl } from '../constants/links'
import {
  COST_REVIEW_ROUTE,
  LIVE_SANDBOX_ROUTE,
  SERVICES_DIRECTORY_ROUTE,
  WORKFLOW_COMPOSER_ROUTE,
} from '../constants/routes'
import { getServiceBySlug } from '../data/services'

const generalBriefFields = [
  'Problem / pressure point:',
  'Current stack or environment:',
  'What good looks like in the first phase:',
  'Anything time-sensitive:',
]

const sandboxBriefFields = [
  'What visitors should be able to try:',
  'What must stay protected or off-limits:',
  'Where the experience should live:',
  'What the sandbox needs to prove or convert into:',
  'Anything time-sensitive:',
]

const costReviewBriefFields = [
  'Approximate monthly cloud spend or scale:',
  'Biggest suspected waste areas:',
  'Constraints that limit cost changes:',
  'Desired savings target or budget pressure:',
  'Anything time-sensitive:',
]

const workflowBriefFields = [
  'What starts the workflow:',
  'Systems, teams, or integrations involved:',
  'Where approvals or human checkpoints are required:',
  'What outcome the automation must protect:',
  'Anything time-sensitive:',
]

const generalNextSteps = [
  'I review the problem, the constraints, and whether the work is a strong fit.',
  'You get a recommendation on the best starting shape: audit, design pass, implementation sprint, or staged engagement.',
  'If the fit is real, we move into a concrete next step instead of an open-ended discovery loop.',
]

const costReviewPreset = {
  eyebrow: 'Cost review fit',
  title: 'Turn the savings signal into a real efficiency plan.',
  intro:
    'If the model feels directionally right, send the rough spend profile, the budget pressure, and the areas most likely leaking money.',
  emailSubject: 'Cloud cost review discussion',
  emailIntro: 'I would like to discuss a cloud cost-efficiency review.',
  emailPrompts: costReviewBriefFields,
  primaryLabel: 'Email the cost brief',
  secondaryLabel: 'Reopen the savings model',
  secondaryTo: COST_REVIEW_ROUTE,
  responseSteps: [
    'We identify where the biggest savings signal is likely real versus noisy.',
    'I recommend the fastest high-leverage review scope and where execution support matters most.',
    'You get a concrete starting plan instead of a generic cost-optimization checklist.',
  ],
}

const topicPresets = {
  general: {
    eyebrow: 'Project fit',
    title: 'Send the version of the problem that actually matters.',
    intro:
      'You do not need a polished brief. A short note with the bottleneck, the current environment, and the outcome you need is enough to make the next step useful.',
    emailSubject: 'Project conversation',
    emailIntro: 'I would like to discuss a delivery problem.',
    emailPrompts: generalBriefFields,
    primaryLabel: 'Email the project brief',
    secondaryLabel: 'Browse service paths',
    secondaryTo: SERVICES_DIRECTORY_ROUTE,
    responseSteps: generalNextSteps,
  },
  'live-terminal-sandbox': {
    eyebrow: 'Sandbox fit',
    title: 'Turn the live sandbox pattern into a real product surface.',
    intro:
      'If the live shell is the proof point you want, send the visitor action, the guardrails that must hold, and what the experience needs to convert into.',
    emailSubject: 'Sandbox-led platform discussion',
    emailIntro: 'I would like to discuss a live sandbox or ephemeral demo environment.',
    emailPrompts: sandboxBriefFields,
    primaryLabel: 'Email the sandbox brief',
    secondaryLabel: 'Reopen the live sandbox',
    secondaryTo: LIVE_SANDBOX_ROUTE,
    responseSteps: [
      'We clarify the allowed user actions, risk boundaries, and runtime controls.',
      'I recommend the right launch flow and implementation shape for the sandbox experience.',
      'You get a concrete next step for prototype, hardening, or production rollout.',
    ],
  },
  'cloud-cost-optimization': costReviewPreset,
  'aws-cost-optimization': costReviewPreset,
  'workflow-composer': {
    eyebrow: 'Workflow fit',
    title: 'Turn the workflow pattern into an implementation plan.',
    intro:
      'If the workflow demo looks close to the operating problem, send the trigger, the systems involved, and where human approvals or fallback steps must stay in the loop.',
    emailSubject: 'Workflow automation discussion',
    emailIntro: 'I would like to discuss a workflow automation or orchestration build.',
    emailPrompts: workflowBriefFields,
    primaryLabel: 'Email the workflow brief',
    secondaryLabel: 'Reopen the workflow demo',
    secondaryTo: WORKFLOW_COMPOSER_ROUTE,
    responseSteps: [
      'We map the operating sequence, risk points, and where human intervention still matters.',
      'I recommend the right starting shape: workflow design, prototype, or constrained production build.',
      'You get a clear delivery path for orchestration, guardrails, and rollout.',
    ],
  },
}

const whatToBring = [
  'A concrete bottleneck that is costing time, money, or operational confidence',
  'Enough system context to explain where the current constraints come from',
  'The outcome you need in the first phase, not just the long-term ambition',
]

function DiscussProjectPage() {
  const [searchParams] = useSearchParams()
  const topic = searchParams.get('topic') || 'general'
  const preset = topicPresets[topic] || topicPresets.general
  const relatedService = getServiceBySlug(topic)
  const emailHref = createDiscussEmailUrl({
    subject: preset.emailSubject,
    intro: preset.emailIntro,
    prompts: preset.emailPrompts,
  })
  const fitSignals = relatedService?.bestFor || whatToBring
  const nextStepSignals = preset.responseSteps || generalNextSteps

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
                  <a href={emailHref} className="primary-button gap-2">
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
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Best first email</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Send enough context to get a useful answer.</h2>
                <p className="mt-4 text-sm leading-8 text-gray-400">
                  A short note is enough. These prompts make it easier to reply with fit, scope, and the right first engagement instead of a generic discovery reply.
                </p>
                <div className="mt-6 space-y-3">
                  {preset.emailPrompts.map((item) => (
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
                  Share the part of the problem that is burning time, budget, or operator confidence right now.
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
                <h2 className="section-title text-3xl sm:text-4xl">What you should get back</h2>
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
                The goal is a decision and a first delivery shape, not a vague "let's keep in touch" loop.
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}

export default DiscussProjectPage
