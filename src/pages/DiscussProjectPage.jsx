import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaArrowRight, FaLinkedin } from 'react-icons/fa'
import { LINKEDIN_URL } from '../constants/links'
import {
  CLOUD_FIT_ROUTE,
  LIVE_SANDBOX_ROUTE,
  SERVICES_DIRECTORY_ROUTE,
  WORKFLOW_COMPOSER_ROUTE,
  createServiceRoute,
} from '../constants/routes'
import QuickIntakePanel from '../components/QuickIntakePanel'
import {
  discussOfferPresets,
  getDiscussTopicPreset,
  normalizeDiscussIntent,
  normalizeDiscussOffer,
  normalizeDiscussTopic,
  responsePromise,
} from '../data/discussTopics'

const topicActions = {
  general: {
    label: 'Browse service paths',
    to: SERVICES_DIRECTORY_ROUTE,
  },
  'platform-engineering': {
    label: 'Review platform engineering',
    to: createServiceRoute('platform-engineering'),
  },
  'cloud-fit-deployment': {
    label: 'Open cloud fit proof',
    to: CLOUD_FIT_ROUTE,
  },
  'data-platforms': {
    label: 'Review data platform service',
    to: createServiceRoute('data-platforms'),
  },
  'telco-tooling': {
    label: 'Review telco tooling',
    to: createServiceRoute('telco-tooling'),
  },
  'live-terminal-sandbox': {
    label: 'Open the live sandbox',
    to: LIVE_SANDBOX_ROUTE,
  },
  'workflow-composer': {
    label: 'Open workflow proof',
    to: WORKFLOW_COMPOSER_ROUTE,
  },
}

function DiscussProjectPage() {
  const [searchParams] = useSearchParams()
  const selectedTopic = normalizeDiscussTopic(searchParams.get('topic') || 'general')
  const selectedIntent = normalizeDiscussIntent(searchParams.get('intent') || 'scope')
  const selectedOffer =
    selectedTopic === 'cloud-fit-deployment' && selectedIntent === 'scope'
      ? normalizeDiscussOffer(searchParams.get('offer') || 'review')
      : 'general'
  const preset = getDiscussTopicPreset(selectedTopic)
  const offerPreset = discussOfferPresets[selectedOffer]
  const secondaryAction = topicActions[selectedTopic] || topicActions.general
  const contextBadges = [preset.optionLabel, selectedOffer !== 'general' ? offerPreset.optionLabel : ''].filter(Boolean)

  return (
    <>
      <section className="page-hero">
        <div className="w-full">
          <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] xl:items-start">
              <div className="relative z-10">
                <span className="section-chip">Quick intake</span>
                <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
                  Keep the first message short.
                </h1>
                <p className="section-copy max-w-3xl text-base sm:text-lg">
                  Use the quick intake when the problem is live or the proof looks close enough to inspect. You only need the issue, the next useful outcome, and the best email for the reply.
                </p>

                {contextBadges.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {contextBadges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-gray-200"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link to={secondaryAction.to} className="secondary-button gap-2">
                    {secondaryAction.label}
                    <FaArrowRight className="text-xs" />
                  </Link>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="soft-link inline-flex items-center gap-2 px-2 py-3"
                  >
                    <FaLinkedin className="text-xs" />
                    Connect on LinkedIn
                  </a>
                </div>
              </div>

              <div className="relative z-10 metric-card p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">What changes here</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">No long scoping flow up front.</h2>
                <p className="mt-4 text-sm leading-8 text-gray-400">
                  The intake stays deliberately light. Start with a live-problem note or a proof-first note, and I can ask for missing delivery context after reviewing it.
                </p>

                <div className="mt-6 space-y-3 text-sm leading-7 text-gray-300">
                  <div className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>Two short notes plus a work email.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>Switch between a live-problem path and a proof-first path without reopening a different form.</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>{responsePromise}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="page-shell">
        <div className="page-panel-compact">
          <QuickIntakePanel
            variant="page"
            initialTopic={selectedTopic}
            initialIntent={selectedIntent}
            initialOffer={selectedOffer}
          />
        </div>
      </main>
    </>
  )
}

export default DiscussProjectPage
