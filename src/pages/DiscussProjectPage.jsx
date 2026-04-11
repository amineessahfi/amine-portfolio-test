import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaArrowRight, FaCheckCircle, FaEnvelope, FaLinkedin } from 'react-icons/fa'
import {
  LINKEDIN_URL,
  createDiscussEmailUrl,
  createLeadSubmissionEmailUrl,
} from '../constants/links'
import {
  CLOUD_FIT_ROUTE,
  LIVE_SANDBOX_ROUTE,
  SERVICES_DIRECTORY_ROUTE,
  WORKFLOW_COMPOSER_ROUTE,
  createServiceRoute,
} from '../constants/routes'
import { getServiceBySlug } from '../data/services'
import {
  budgetRangeOptions,
  discussIntentPresets,
  discussOfferPresets,
  discussTopicOptions,
  getDiscussTopicPreset,
  normalizeDiscussOffer,
  normalizeDiscussIntent,
  normalizeDiscussTopic,
  responsePromise,
  timelineOptions,
} from '../data/discussTopics'

const defaultFormState = {
  name: '',
  workEmail: '',
  company: '',
  role: '',
  timeline: '',
  budgetRange: '',
  problem: '',
  currentEnvironment: '',
  desiredOutcome: '',
  timeSensitivity: '',
  website: '',
}

const defaultSubmitState = {
  type: 'idle',
  message: '',
  fallbackUrl: '',
}

const whatToBring = [
  'A concrete bottleneck that is costing time, money, or operational confidence',
  'Enough system context to explain where the current constraints come from',
  'The outcome you need in the first phase, not just the long-term ambition',
]

const exploreFitSignals = [
  'The proof surface is close enough to the real problem to pressure-test something meaningful.',
  'You can point to the handoff, failure, or blind spot that needs to become clearer.',
  'You want a technical reply without jumping straight into a formal scoped engagement.',
]

const exploreEmailPrompts = [
  'What part of the system or workflow do you want to inspect first:',
  'What currently feels broken, risky, or unclear:',
  'What would make the proof useful enough to keep going:',
]

const intentCards = [
  {
    value: 'explore',
    title: discussIntentPresets.explore.optionLabel,
    description: 'Start from the demo, trace, or system map when you want a lighter technical reply first.',
  },
  {
    value: 'scope',
    title: discussIntentPresets.scope.optionLabel,
    description: 'Use the structured brief when the problem is real and you want fit, scope, and the first delivery shape.',
  },
]

const offerCards = [
  {
    value: 'review',
    title: discussOfferPresets.review.optionLabel,
    description: discussOfferPresets.review.summaryText,
  },
  {
    value: 'deploy-pack',
    title: discussOfferPresets['deploy-pack'].optionLabel,
    description: discussOfferPresets['deploy-pack'].summaryText,
  },
]

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
    label: 'Reopen the cloud fit model',
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
    label: 'Reopen the live sandbox',
    to: LIVE_SANDBOX_ROUTE,
  },
  'workflow-composer': {
    label: 'Reopen the workflow demo',
    to: WORKFLOW_COMPOSER_ROUTE,
  },
}

function DiscussProjectPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedTopic = normalizeDiscussTopic(searchParams.get('topic') || 'general')
  const selectedIntent = normalizeDiscussIntent(searchParams.get('intent') || 'scope')
  const preset = getDiscussTopicPreset(selectedTopic)
  const intentPreset = discussIntentPresets[selectedIntent]
  const isExploreIntent = selectedIntent === 'explore'
  const isCloudFitTopic = selectedTopic === 'cloud-fit-deployment'
  const selectedOffer =
    !isExploreIntent && isCloudFitTopic ? normalizeDiscussOffer(searchParams.get('offer') || 'review') : 'general'
  const offerPreset = discussOfferPresets[selectedOffer]
  const relatedService = getServiceBySlug(selectedTopic)
  const [formState, setFormState] = useState(defaultFormState)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitState, setSubmitState] = useState(defaultSubmitState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const secondaryAction = topicActions[selectedTopic] || topicActions.general
  const fitSignals = isExploreIntent ? exploreFitSignals : relatedService?.bestFor || whatToBring
  const nextStepSignals = isExploreIntent ? intentPreset.responseSteps : preset.responseSteps
  const discussIntro = isExploreIntent
    ? `I would like to pressure-test whether the ${preset.optionLabel.toLowerCase()} proof path is the right starting point.`
    : isCloudFitTopic && selectedOffer !== 'general'
      ? offerPreset.emailIntro
      : preset.emailIntro
  const directEmailHref = createDiscussEmailUrl({
    subject:
      isExploreIntent
        ? `${preset.emailSubject} exploratory note`
        : isCloudFitTopic && selectedOffer !== 'general'
          ? `${preset.emailSubject} — ${offerPreset.optionLabel}`
          : preset.emailSubject,
    intro: discussIntro,
    prompts: isExploreIntent ? exploreEmailPrompts : preset.emailPrompts,
  })

  const buildFallbackUrl = () =>
    createLeadSubmissionEmailUrl({
      subject:
        isExploreIntent
          ? `${preset.emailSubject} exploratory note`
          : isCloudFitTopic && selectedOffer !== 'general'
            ? `${preset.emailSubject} — ${offerPreset.optionLabel}`
            : preset.emailSubject,
      intro: discussIntro,
      intentLabel: intentPreset.optionLabel,
      topicLabel: preset.optionLabel,
      offerLabel: isCloudFitTopic && selectedOffer !== 'general' ? offerPreset.optionLabel : '',
      name: formState.name,
      workEmail: formState.workEmail,
      company: formState.company,
      role: formState.role,
      timeline: formState.timeline,
      budgetRange: formState.budgetRange,
      problem: formState.problem,
      currentEnvironment: formState.currentEnvironment,
      desiredOutcome: formState.desiredOutcome,
      timeSensitivity: formState.timeSensitivity,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    })

  const handleTopicChange = (event) => {
    const nextTopic = normalizeDiscussTopic(event.target.value)
    const nextSearchParams = new URLSearchParams(searchParams)
    const nextIntent = normalizeDiscussIntent(nextSearchParams.get('intent') || 'scope')

    if (nextTopic === 'general') {
      nextSearchParams.delete('topic')
    } else {
      nextSearchParams.set('topic', nextTopic)
    }

    if (nextTopic === 'cloud-fit-deployment' && nextIntent === 'scope') {
      nextSearchParams.set('offer', normalizeDiscussOffer(nextSearchParams.get('offer') || 'review'))
    } else {
      nextSearchParams.delete('offer')
    }

    setSearchParams(nextSearchParams)
    setFieldErrors({})
    setSubmitState(defaultSubmitState)
  }

  const handleIntentChange = (nextIntent) => {
    const normalizedIntent = normalizeDiscussIntent(nextIntent)
    const nextSearchParams = new URLSearchParams(searchParams)

    if (normalizedIntent === 'scope') {
      nextSearchParams.delete('intent')
    } else {
      nextSearchParams.set('intent', normalizedIntent)
    }

    if (normalizedIntent === 'scope' && selectedTopic === 'cloud-fit-deployment') {
      nextSearchParams.set('offer', normalizeDiscussOffer(nextSearchParams.get('offer') || 'review'))
    } else {
      nextSearchParams.delete('offer')
    }

    setSearchParams(nextSearchParams)
    setFieldErrors({})
    setSubmitState(defaultSubmitState)
  }

  const handleOfferChange = (nextOffer) => {
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('offer', normalizeDiscussOffer(nextOffer))
    setSearchParams(nextSearchParams)
    setFieldErrors({})
    setSubmitState(defaultSubmitState)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setFormState((current) => ({
      ...current,
      [name]: value,
    }))

    if (fieldErrors[name]) {
      setFieldErrors((current) => ({
        ...current,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setIsSubmitting(true)
    setSubmitState({
      type: 'idle',
      message: '',
      fallbackUrl: '',
    })
    setFieldErrors({})

    const payload = {
      ...formState,
      intent: selectedIntent,
      topic: selectedTopic,
      offer: selectedOffer,
      pageUrl: window.location.href,
    }

    try {
      const response = await fetch('/api/discuss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const fallbackUrl = data.mailtoUrl || buildFallbackUrl()

        setFieldErrors(data.fieldErrors || {})
        setSubmitState({
          type: 'error',
          message: data.error || 'The structured brief could not be delivered right now.',
          fallbackUrl,
        })
        return
      }

      if (data.mode === 'mailto') {
        setSubmitState({
          type: 'fallback',
          message: data.message || 'Your prefilled email fallback is ready.',
          fallbackUrl: data.mailtoUrl,
        })
        window.location.href = data.mailtoUrl
        return
      }

      setFormState(defaultFormState)
      setSubmitState({
        type: 'success',
        message: data.message || responsePromise,
        fallbackUrl: '',
      })
    } catch {
      setSubmitState({
        type: 'error',
        message: 'The structured brief could not be delivered right now.',
        fallbackUrl: buildFallbackUrl(),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const pageTitle = isExploreIntent ? 'Start from the proof you want to pressure-test.' : preset.title
  const pageIntro = isExploreIntent
    ? 'If a demo, trace, or system map feels close to the real problem, use the lighter exploration path to explain what you want to inspect before you commit to a scoped engagement.'
    : preset.intro
  const bestUseText = !isExploreIntent && isCloudFitTopic ? offerPreset.summaryText : intentPreset.summaryText
  const problemLabel = isExploreIntent ? 'What do you want to inspect first?' : 'Problem / pressure point'
  const problemPlaceholder = isExploreIntent
    ? 'Which failure, handoff, or technical risk do you want the proof surface to make clearer?'
    : 'What is causing the drag, spend, or operational pain right now?'
  const currentEnvironmentLabel = isExploreIntent ? 'Current stack or environment (optional)' : 'Current stack or environment'
  const currentEnvironmentPlaceholder = isExploreIntent
    ? 'Share the systems, stack, or environment that make the proof relevant.'
    : 'Share the stack, operating model, or environment that matters most here.'
  const desiredOutcomeLabel = isExploreIntent ? 'What would make the proof useful? (optional)' : 'Desired outcome for the first phase'
  const desiredOutcomePlaceholder = isExploreIntent
    ? 'What should be clearer once you have the right trace, map, or proof surface?'
    : 'What should be clearer, safer, faster, or cheaper after the first phase?'
  const timeSensitivityLabel = isExploreIntent ? 'Anything time-sensitive (optional)' : 'Anything time-sensitive'
  const formTitle = !isExploreIntent && isCloudFitTopic ? offerPreset.formTitle : intentPreset.formTitle
  const formIntro = !isExploreIntent && isCloudFitTopic ? offerPreset.formIntro : intentPreset.formIntro
  const successButtonLabel = isExploreIntent ? 'Send exploration note' : !isExploreIntent && isCloudFitTopic ? offerPreset.submitLabel : intentPreset.submitLabel

  return (
    <>
      <section className="page-hero">
        <div className="mx-auto max-w-7xl">
          <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1.02fr)_minmax(22rem,0.98fr)] xl:items-start">
              <div className="relative z-10">
                <span className="section-chip">{intentPreset.eyebrow}</span>
                <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
                  {pageTitle}
                </h1>
                <p className="section-copy max-w-3xl text-base sm:text-lg">{pageIntro}</p>
                <p className="mt-4 text-sm leading-7 text-primary-100">
                  Current focus: <span className="font-semibold text-white">{preset.optionLabel}</span>
                </p>
                {!isExploreIntent && isCloudFitTopic ? (
                  <p className="mt-2 text-sm leading-7 text-primary-100">
                    Selected handoff: <span className="font-semibold text-white">{offerPreset.optionLabel}</span>
                  </p>
                ) : null}

                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
                  <a href="#project-brief-form" className="primary-button gap-2">
                    {intentPreset.submitLabel}
                    <FaArrowRight className="text-xs" />
                  </a>
                  <Link to={secondaryAction.to} className="secondary-button gap-2">
                    {secondaryAction.label}
                    <FaArrowRight className="text-xs" />
                  </Link>
                  <a
                    href={directEmailHref}
                    className="soft-link inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3"
                  >
                    <FaEnvelope className="mr-2 text-xs" />
                    Prefer direct email
                  </a>
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

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {intentCards.map((card) => {
                    const isActive = card.value === selectedIntent

                    return (
                      <button
                        key={card.value}
                        type="button"
                        onClick={() => handleIntentChange(card.value)}
                        className={`rounded-[1.5rem] border p-5 text-left transition ${
                          isActive
                            ? 'border-primary-500/30 bg-primary-500/10'
                            : 'border-white/10 bg-white/[0.03] hover:border-primary-500/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">{card.title}</p>
                        <p className="mt-3 text-sm leading-7 text-gray-300">{card.description}</p>
                      </button>
                    )
                  })}
                </div>

                {!isExploreIntent && isCloudFitTopic ? (
                  <div className="mt-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Choose the scoped handoff</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {offerCards.map((card) => {
                        const isActive = card.value === selectedOffer

                        return (
                          <button
                            key={card.value}
                            type="button"
                            onClick={() => handleOfferChange(card.value)}
                            className={`rounded-[1.5rem] border p-5 text-left transition ${
                              isActive
                                ? 'border-primary-500/30 bg-primary-500/10'
                                : 'border-white/10 bg-white/[0.03] hover:border-primary-500/20 hover:bg-white/[0.05]'
                            }`}
                          >
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">{card.title}</p>
                            <p className="mt-3 text-sm leading-7 text-gray-300">{card.description}</p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="metric-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Response promise</p>
                    <p className="mt-3 text-sm leading-7 text-gray-300">{responsePromise}</p>
                  </div>
                  <div className="metric-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Best use of this path</p>
                    <p className="mt-3 text-sm leading-7 text-gray-300">{bestUseText}</p>
                  </div>
                </div>
              </div>

              <div id="project-brief-form" className="relative z-10 metric-card scroll-mt-28 p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">{intentPreset.formEyebrow}</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">{formTitle}</h2>
                <p className="mt-4 text-sm leading-8 text-gray-400">
                  {formIntro} Direct delivery still uses the API when configured and falls back to a prefilled email when needed.
                </p>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="website"
                    value={formState.website}
                    onChange={handleInputChange}
                    tabIndex="-1"
                    autoComplete="off"
                    className="hidden"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="form-label" htmlFor="topic">
                        Service focus
                      </label>
                      <select
                        id="topic"
                        name="topic"
                        value={selectedTopic}
                        onChange={handleTopicChange}
                        className="form-select"
                      >
                        {discussTopicOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label" htmlFor="name">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formState.name}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Your name"
                      />
                      {fieldErrors.name ? <p className="mt-2 text-sm text-red-300">{fieldErrors.name}</p> : null}
                    </div>

                    <div>
                      <label className="form-label" htmlFor="workEmail">
                        Work email
                      </label>
                      <input
                        id="workEmail"
                        name="workEmail"
                        type="email"
                        value={formState.workEmail}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="name@company.com"
                      />
                      {fieldErrors.workEmail ? <p className="mt-2 text-sm text-red-300">{fieldErrors.workEmail}</p> : null}
                    </div>

                    <div>
                      <label className="form-label" htmlFor="company">
                        {isExploreIntent ? 'Company (optional)' : 'Company'}
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={formState.company}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Company name"
                      />
                      {fieldErrors.company ? <p className="mt-2 text-sm text-red-300">{fieldErrors.company}</p> : null}
                    </div>

                    <div>
                      <label className="form-label" htmlFor="role">
                        {isExploreIntent ? 'Role (optional)' : 'Role'}
                      </label>
                      <input
                        id="role"
                        name="role"
                        type="text"
                        value={formState.role}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="CTO, Head of Platform, Product Lead..."
                      />
                      {fieldErrors.role ? <p className="mt-2 text-sm text-red-300">{fieldErrors.role}</p> : null}
                    </div>

                    {!isExploreIntent ? (
                      <>
                        <div>
                          <label className="form-label" htmlFor="timeline">
                            Timeline
                          </label>
                          <select
                            id="timeline"
                            name="timeline"
                            value={formState.timeline}
                            onChange={handleInputChange}
                            className="form-select"
                          >
                            <option value="">Select a timeline</option>
                            {timelineOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          {fieldErrors.timeline ? <p className="mt-2 text-sm text-red-300">{fieldErrors.timeline}</p> : null}
                        </div>

                        <div>
                          <label className="form-label" htmlFor="budgetRange">
                            Budget range
                          </label>
                          <select
                            id="budgetRange"
                            name="budgetRange"
                            value={formState.budgetRange}
                            onChange={handleInputChange}
                            className="form-select"
                          >
                            <option value="">Select a range</option>
                            {budgetRangeOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          {fieldErrors.budgetRange ? <p className="mt-2 text-sm text-red-300">{fieldErrors.budgetRange}</p> : null}
                        </div>
                      </>
                    ) : null}
                  </div>

                  <div>
                    <label className="form-label" htmlFor="problem">
                      {problemLabel}
                    </label>
                    <textarea
                      id="problem"
                      name="problem"
                      value={formState.problem}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder={problemPlaceholder}
                    />
                    {fieldErrors.problem ? <p className="mt-2 text-sm text-red-300">{fieldErrors.problem}</p> : null}
                  </div>

                  <div>
                    <label className="form-label" htmlFor="currentEnvironment">
                      {currentEnvironmentLabel}
                    </label>
                    <textarea
                      id="currentEnvironment"
                      name="currentEnvironment"
                      value={formState.currentEnvironment}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder={currentEnvironmentPlaceholder}
                    />
                    {fieldErrors.currentEnvironment ? <p className="mt-2 text-sm text-red-300">{fieldErrors.currentEnvironment}</p> : null}
                  </div>

                  <div>
                    <label className="form-label" htmlFor="desiredOutcome">
                      {desiredOutcomeLabel}
                    </label>
                    <textarea
                      id="desiredOutcome"
                      name="desiredOutcome"
                      value={formState.desiredOutcome}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder={desiredOutcomePlaceholder}
                    />
                    {fieldErrors.desiredOutcome ? <p className="mt-2 text-sm text-red-300">{fieldErrors.desiredOutcome}</p> : null}
                  </div>

                  <div>
                    <label className="form-label" htmlFor="timeSensitivity">
                      {timeSensitivityLabel}
                    </label>
                    <textarea
                      id="timeSensitivity"
                      name="timeSensitivity"
                      value={formState.timeSensitivity}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Deadlines, board pressure, launch timing, staffing constraints..."
                    />
                  </div>

                  {submitState.type !== 'idle' ? (
                    <div
                      className={`rounded-[1.35rem] border px-4 py-4 text-sm leading-7 ${
                        submitState.type === 'success'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
                          : submitState.type === 'fallback'
                            ? 'border-amber-500/20 bg-amber-500/10 text-amber-100'
                            : 'border-rose-500/20 bg-rose-500/10 text-rose-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {submitState.type === 'success' ? <FaCheckCircle className="mt-1 text-xs" /> : <FaEnvelope className="mt-1 text-xs" />}
                        <div className="space-y-3">
                          <p>{submitState.message}</p>
                          {submitState.fallbackUrl ? (
                            <a href={submitState.fallbackUrl} className="soft-link inline-flex items-center gap-2 text-current">
                              Open the prefilled email fallback
                              <FaArrowRight className="text-xs" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <button type="submit" disabled={isSubmitting} className="primary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70">
                      {isSubmitting ? (isExploreIntent ? 'Sending note...' : 'Sending brief...') : successButtonLabel}
                    </button>
                    <a href={buildFallbackUrl()} className="secondary-button gap-2">
                      Use email fallback
                    </a>
                    <span className="text-sm text-gray-400">{responsePromise}</span>
                  </div>
                </form>
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
                  {isExploreIntent
                    ? 'Share the part of the system, proof surface, or technical risk you want to make clearer first.'
                    : 'Share the part of the problem that is burning time, budget, or operator confidence right now.'}
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
                {isExploreIntent
                  ? 'The goal is a useful technical next step and a stronger fit read, not premature scoping.'
                  : 'The goal is a decision and a first delivery shape, not a vague "let&apos;s keep in touch" loop.'}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default DiscussProjectPage
