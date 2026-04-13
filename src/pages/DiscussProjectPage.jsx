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
    description: 'Use the guided path when the problem is real and you want fit, scope, and a credible first delivery plan.',
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const funnelFieldOrder = [
  'problem',
  'currentEnvironment',
  'desiredOutcome',
  'timeline',
  'budgetRange',
  'name',
  'workEmail',
  'company',
  'role',
]
const fieldStepMap = {
  problem: 'problem',
  currentEnvironment: 'problem',
  desiredOutcome: 'shape',
  timeline: 'shape',
  budgetRange: 'shape',
  name: 'contact',
  workEmail: 'contact',
  company: 'contact',
  role: 'contact',
}

function trimText(value = '') {
  return typeof value === 'string' ? value.trim() : ''
}

function hasContent(value = '') {
  return Boolean(trimText(value))
}

function summarizeField(value, fallback) {
  const trimmed = trimText(value)

  if (!trimmed) {
    return fallback
  }

  return trimmed.length > 150 ? `${trimmed.slice(0, 147)}...` : trimmed
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
  const [activeStep, setActiveStep] = useState('path')

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
  const successButtonLabel = isExploreIntent
    ? 'Send exploration request'
    : !isExploreIntent && isCloudFitTopic
      ? offerPreset.submitLabel
      : intentPreset.submitLabel

  const funnelSteps = [
    {
      id: 'path',
      label: '1. Direction',
      shortLabel: 'Direction',
      eyebrow: 'Choose the lane',
      title: 'Choose the lane and service focus.',
      description: 'Pick the type of conversation, the service focus, and the handoff before you describe the problem.',
      teaser: 'Choose the lane, focus, and handoff.',
    },
    {
      id: 'problem',
      label: '2. Pressure',
      shortLabel: 'Pressure',
      eyebrow: isExploreIntent ? 'Name the proof gap' : 'Name the pressure point',
      title: isExploreIntent
        ? 'Describe the risk, failure, or handoff that needs pressure-testing.'
        : 'Describe the bottleneck and the current environment behind it.',
      description: isExploreIntent
        ? 'A lighter note still works best when it points to the specific system friction you want to make clearer.'
        : 'A strong scoped reply starts from the real bottleneck and the environment it lives inside.',
      teaser: isExploreIntent ? 'Show what needs pressure-testing.' : 'Show what is breaking and where it lives.',
    },
    {
      id: 'shape',
      label: '3. Outcome',
      shortLabel: 'Outcome',
      eyebrow: isExploreIntent ? 'Make the proof useful' : 'Shape the first phase',
      title: isExploreIntent
        ? 'Say what would make the proof worth continuing.'
        : 'Add the outcome, timing, and commercial shape that make the next step real.',
      description: isExploreIntent
        ? 'This keeps the reply technical and useful without forcing premature scoping.'
        : 'This keeps the response grounded in a realistic first move instead of a vague future state.',
      teaser: isExploreIntent ? 'Explain what the proof should unlock.' : 'Shape the first phase and urgency.',
    },
    {
      id: 'contact',
      label: '4. Reply',
      shortLabel: 'Reply',
      eyebrow: 'Ready to send',
      title: 'Add your reply details and send the note.',
      description: `${formIntro} Direct delivery still uses the API when configured and falls back to a prefilled email when needed.`,
      teaser: 'Add contact details, review the note, and send it.',
    },
  ]

  const activeStepIndex = funnelSteps.findIndex((step) => step.id === activeStep)
  const activeStepMeta = funnelSteps[activeStepIndex] || funnelSteps[0]
  const requiredFields = new Set(intentPreset.requiredFields)
  const stepValidationFields = {
    path: [],
    problem: ['problem', 'currentEnvironment'],
    shape: ['desiredOutcome', 'timeline', 'budgetRange'],
    contact: ['name', 'workEmail', 'company', 'role'],
  }
  const pathSummary = [
    intentPreset.optionLabel,
    preset.optionLabel,
    !isExploreIntent && isCloudFitTopic ? offerPreset.optionLabel : '',
  ]
    .filter(Boolean)
    .join(' / ')

  const finalReviewCards = [
    {
      label: 'Direction',
      value: pathSummary,
    },
    {
      label: 'Pressure',
      value: summarizeField(formState.problem, 'Add the bottleneck, risk, or proof gap you want the reply to address.'),
    },
    {
      label: 'Outcome',
      value: summarizeField(
        formState.desiredOutcome,
        isExploreIntent
          ? 'Say what would make the proof useful enough to keep going.'
          : 'Say what the first phase should improve or make safer.',
      ),
    },
    {
      label: 'Reply to',
      value: summarizeField(formState.workEmail, 'Add the best work email for the reply.'),
    },
  ]

  const setErrorsForFields = (fields, nextErrors) => {
    setFieldErrors((current) => {
      const remainingErrors = { ...current }

      fields.forEach((field) => {
        delete remainingErrors[field]
      })

      return {
        ...remainingErrors,
        ...nextErrors,
      }
    })
  }

  const validateFields = (fields) => {
    const errors = {}

    if (fields.includes('problem') && requiredFields.has('problem') && !hasContent(formState.problem)) {
      errors.problem = 'Problem / pressure point is required.'
    }

    if (
      fields.includes('currentEnvironment') &&
      requiredFields.has('currentEnvironment') &&
      !hasContent(formState.currentEnvironment)
    ) {
      errors.currentEnvironment = 'Current stack or environment is required.'
    }

    if (
      fields.includes('desiredOutcome') &&
      requiredFields.has('desiredOutcome') &&
      !hasContent(formState.desiredOutcome)
    ) {
      errors.desiredOutcome = 'Desired outcome is required.'
    }

    if (fields.includes('timeline') && requiredFields.has('timeline') && !hasContent(formState.timeline)) {
      errors.timeline = 'Timeline is required.'
    }

    if (
      fields.includes('budgetRange') &&
      requiredFields.has('budgetRange') &&
      !hasContent(formState.budgetRange)
    ) {
      errors.budgetRange = 'Budget range is required.'
    }

    if (fields.includes('name') && requiredFields.has('name') && !hasContent(formState.name)) {
      errors.name = 'Name is required.'
    }

    if (fields.includes('workEmail')) {
      const workEmail = trimText(formState.workEmail).toLowerCase()

      if (requiredFields.has('workEmail') && !workEmail) {
        errors.workEmail = 'Work email is required.'
      } else if (workEmail && !emailPattern.test(workEmail)) {
        errors.workEmail = 'Enter a valid email address.'
      }
    }

    if (fields.includes('company') && requiredFields.has('company') && !hasContent(formState.company)) {
      errors.company = 'Company is required.'
    }

    if (fields.includes('role') && requiredFields.has('role') && !hasContent(formState.role)) {
      errors.role = 'Role is required.'
    }

    return errors
  }

  const getFirstErrorStep = (errors) => {
    const firstFieldWithError = funnelFieldOrder.find((field) => errors[field])
    return firstFieldWithError ? fieldStepMap[firstFieldWithError] : 'contact'
  }

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
    setActiveStep('path')
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
    setActiveStep('path')
  }

  const handleOfferChange = (nextOffer) => {
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('offer', normalizeDiscussOffer(nextOffer))
    setSearchParams(nextSearchParams)
    setFieldErrors({})
    setSubmitState(defaultSubmitState)
    setActiveStep('path')
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

    if (submitState.type !== 'idle') {
      setSubmitState(defaultSubmitState)
    }
  }

  const moveToNextStep = (stepId) => {
    const currentStepIndex = funnelSteps.findIndex((step) => step.id === stepId)
    const fields = stepValidationFields[stepId] || []
    const nextErrors = validateFields(fields)

    setErrorsForFields(fields, nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setActiveStep(getFirstErrorStep(nextErrors))
      return
    }

    const nextStep = funnelSteps[currentStepIndex + 1]

    if (nextStep) {
      setActiveStep(nextStep.id)
    }
  }

  const moveToPreviousStep = () => {
    if (activeStepIndex <= 0) {
      return
    }

    setActiveStep(funnelSteps[activeStepIndex - 1].id)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateFields(funnelFieldOrder)
    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setActiveStep(getFirstErrorStep(nextErrors))
      return
    }

    setIsSubmitting(true)
    setSubmitState(defaultSubmitState)

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
        const apiErrors = data.fieldErrors || {}

        setFieldErrors(apiErrors)
        if (Object.keys(apiErrors).length > 0) {
          setActiveStep(getFirstErrorStep(apiErrors))
        }

        setSubmitState({
          type: 'error',
          message: data.error || 'The guided path could not be delivered right now.',
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

      setSubmitState({
        type: 'success',
        message: data.message || responsePromise,
        fallbackUrl: '',
      })
      setFieldErrors({})
      setActiveStep('contact')
    } catch {
      setSubmitState({
        type: 'error',
        message: 'The guided path could not be delivered right now.',
        fallbackUrl: buildFallbackUrl(),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="w-full">
          <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] xl:items-start">
              <div className="relative z-10">
                <span className="section-chip">{intentPreset.eyebrow}</span>
                <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
                  {pageTitle}
                </h1>
                <p className="section-copy max-w-3xl text-base sm:text-lg">{pageIntro}</p>

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-primary-100">
                  <span>
                    Focus: <span className="font-semibold text-white">{preset.optionLabel}</span>
                  </span>
                  {!isExploreIntent && isCloudFitTopic ? (
                    <span>
                      Handoff: <span className="font-semibold text-white">{offerPreset.optionLabel}</span>
                    </span>
                  ) : null}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href="#contact-flow" className="primary-button gap-2">
                    Start the intake
                    <FaArrowRight className="text-xs" />
                  </a>
                  <Link to={secondaryAction.to} className="secondary-button gap-2">
                    {secondaryAction.label}
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-300">
                  <a href={directEmailHref} className="soft-link inline-flex items-center gap-2">
                    <FaEnvelope className="text-xs" />
                    Prefer direct email
                  </a>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="soft-link inline-flex items-center gap-2"
                  >
                    <FaLinkedin className="text-xs" />
                    Connect on LinkedIn
                  </a>
                </div>
              </div>

              <div className="relative z-10 metric-card p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">4-step intake</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Four short steps to a useful reply.</h2>
                <p className="mt-4 text-sm leading-8 text-gray-400">
                  Choose the lane, name the pressure, define the outcome, then leave a clear reply path.
                </p>

                <div className="mt-6 space-y-4">
                  {funnelSteps.map((step) => (
                    <div key={step.id} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">{step.label}</p>
                        <p className="mt-1 text-sm leading-7 text-gray-300">{step.teaser}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">Response promise</p>
                  <p className="mt-2 text-sm leading-7 text-gray-300">{responsePromise}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="page-shell">
        <section id="contact-flow" className="terminal-window scroll-mt-28">
          <div className="terminal-header">
            <div className="text-sm text-gray-400">guided intake</div>
          </div>

          <div className="terminal-content">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-200">{activeStepMeta.eyebrow}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{activeStepMeta.title}</h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-gray-400">{activeStepMeta.description}</p>
            </div>

            <div className="parallax-step-rail">
              {funnelSteps.map((step, index) => {
                const isActive = step.id === activeStep

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className={`parallax-step-button ${isActive ? 'parallax-step-button-active' : ''}`}
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">{step.label}</span>
                      <span className="mt-2 block text-sm font-semibold text-white">{step.shortLabel}</span>
                      <span className="mt-2 block text-sm leading-7 text-gray-400">
                        {index < activeStepIndex ? 'Done' : isActive ? 'Current' : 'Up next'}
                      </span>
                    </button>
                  )
                })}
              </div>

            <div className="parallax-progress-track">
              <div
                className="parallax-progress-bar"
                style={{ width: `${((activeStepIndex + 1) / funnelSteps.length) * 100}%` }}
              />
            </div>

            <div className="parallax-flow-shell" style={{ '--parallax-index': activeStepIndex }}>
              <div className="parallax-flow-layer" />
              <div className="parallax-flow-layer parallax-flow-layer-secondary" />

              <div className="parallax-flow-track">
                <section className="p-1" hidden={activeStep !== 'path'}>
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
                    <div className="space-y-5">
                      <div>
                        <p className="form-label">Conversation motion</p>
                        <div className="grid gap-4 sm:grid-cols-2">
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
                      </div>

                      <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
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

                      {!isExploreIntent && isCloudFitTopic ? (
                        <div>
                          <p className="form-label">Scoped handoff</p>
                          <div className="grid gap-4 sm:grid-cols-2">
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <button type="button" onClick={() => moveToNextStep('path')} className="primary-button gap-2">
                          Continue to the pressure point
                          <FaArrowRight className="text-xs" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="metric-card p-6 sm:p-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Current path</p>
                        <h3 className="mt-4 text-2xl font-semibold text-white">{pathSummary}</h3>
                        <p className="mt-4 text-sm leading-8 text-gray-400">{bestUseText}</p>
                      </div>

                      <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Why this first step matters</p>
                        <p className="mt-4 text-sm leading-7 text-gray-300">
                          Once the lane and topic are right, every later question gets narrower and cleaner. This is the
                          step that keeps the whole flow from feeling noisy.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="p-1" hidden={activeStep !== 'problem'}>
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-start">
                    <div className="space-y-5">
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
                        {fieldErrors.currentEnvironment ? (
                          <p className="mt-2 text-sm text-red-300">{fieldErrors.currentEnvironment}</p>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <button type="button" onClick={moveToPreviousStep} className="secondary-button gap-2">
                          Back to path
                        </button>
                        <button type="button" onClick={() => moveToNextStep('problem')} className="primary-button gap-2">
                          Continue to the outcome
                          <FaArrowRight className="text-xs" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="metric-card p-6 sm:p-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">What to bring into this step</p>
                        <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                          {fitSignals.map((item) => (
                            <li key={item} className="flex gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-[1.6rem] border border-violet-500/20 bg-violet-500/10 p-5 sm:p-6 text-sm leading-7 text-violet-100">
                        {isExploreIntent
                          ? 'Keep it light if you want. The only job of this step is to make the proof gap legible.'
                          : 'This is the part that keeps the reply from drifting into abstraction. Name the actual bottleneck and the environment it lives inside.'}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="p-1" hidden={activeStep !== 'shape'}>
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-start">
                    <div className="space-y-5">
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
                        {fieldErrors.desiredOutcome ? (
                          <p className="mt-2 text-sm text-red-300">{fieldErrors.desiredOutcome}</p>
                        ) : null}
                      </div>

                      {!isExploreIntent ? (
                        <div className="grid gap-4 sm:grid-cols-2">
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
                            {fieldErrors.budgetRange ? (
                              <p className="mt-2 text-sm text-red-300">{fieldErrors.budgetRange}</p>
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-gray-300">
                          The explore path stays lighter here. If the urgency is real, use the time-sensitive note below.
                        </div>
                      )}

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

                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <button type="button" onClick={moveToPreviousStep} className="secondary-button gap-2">
                          Back to pressure
                        </button>
                        <button type="button" onClick={() => moveToNextStep('shape')} className="primary-button gap-2">
                          Continue to reply
                          <FaArrowRight className="text-xs" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="metric-card p-6 sm:p-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">What you should get back</p>
                        <ol className="mt-4 space-y-3">
                          {nextStepSignals.map((item, index) => (
                            <li key={item} className="flex gap-4 rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-sm font-semibold text-white">
                                {index + 1}
                              </span>
                              <span className="text-sm leading-7 text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="rounded-[1.6rem] border border-primary-500/20 bg-primary-500/10 p-5 sm:p-6 text-sm leading-7 text-primary-100">
                        {isExploreIntent
                          ? 'This step is about making the proof useful enough to continue, not forcing full scoping too early.'
                          : 'This step is about turning the problem into a believable first move with real timing and commercial context.'}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="p-1" hidden={activeStep !== 'contact'}>
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] xl:items-start">
                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                          {fieldErrors.workEmail ? (
                            <p className="mt-2 text-sm text-red-300">{fieldErrors.workEmail}</p>
                          ) : null}
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

                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <button type="button" onClick={moveToPreviousStep} className="secondary-button gap-2">
                          Back to outcome
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="primary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isSubmitting ? 'Sending request...' : successButtonLabel}
                          <FaArrowRight className="text-xs" />
                        </button>
                        <a href={buildFallbackUrl()} className="secondary-button gap-2">
                          Use email fallback
                        </a>
                      </div>
                    </form>

                    <div className="space-y-4">
                      <div className="metric-card p-6 sm:p-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Final review</p>
                        <h3 className="mt-4 text-2xl font-semibold text-white">{formTitle}</h3>

                        <div className="mt-5 space-y-3">
                          {finalReviewCards.map((item) => (
                            <div key={item.label} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">{item.label}</p>
                              <p className="mt-3 text-sm leading-7 text-gray-300">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.6rem] border border-primary-500/20 bg-primary-500/10 p-5 sm:p-6 text-sm leading-7 text-primary-100">
                        <p className="font-semibold text-white">Response promise</p>
                        <p className="mt-3">{responsePromise}</p>
                      </div>

                      <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Need a different exit?</p>
                        <div className="mt-4 flex flex-col gap-3">
                          <Link to={secondaryAction.to} className="secondary-button gap-2">
                            {secondaryAction.label}
                          </Link>
                          <a href={directEmailHref} className="secondary-button gap-2">
                            <FaEnvelope className="text-xs" />
                            Prefer direct email
                          </a>
                          <a
                            href={LINKEDIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="secondary-button gap-2"
                          >
                            <FaLinkedin className="text-xs" />
                            Connect on LinkedIn
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default DiscussProjectPage
