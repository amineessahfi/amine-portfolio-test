import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaArrowRight, FaCheckCircle, FaEnvelope, FaTimes } from 'react-icons/fa'
import { createDiscussEmailUrl, createLeadSubmissionEmailUrl } from '../constants/links'
import {
  discussOfferPresets,
  discussIntentPresets,
  getDiscussTopicPreset,
  normalizeDiscussIntent,
  normalizeDiscussOffer,
  normalizeDiscussTopic,
  responsePromise,
} from '../data/discussTopics'

const defaultFormState = {
  problem: '',
  desiredOutcome: '',
  workEmail: '',
  website: '',
}

const defaultSubmitState = {
  type: 'idle',
  message: '',
  fallbackUrl: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const intakeSuggestions = {
  general: {
    scope: ['delivery is blocked', 'a risky handoff keeps failing', 'the next step is unclear'],
    explore: ['the proof looks close', 'I need a technical second opinion', 'I want to inspect one surface first'],
  },
  'platform-engineering': {
    scope: ['release friction', 'platform inconsistency', 'weak developer experience'],
    explore: ['paved-road gaps', 'service template drift', 'team handoff pain'],
  },
  'cloud-fit-deployment': {
    scope: ['provider choice', 'architecture review', 'deploy pack'],
    explore: ['shortlist pressure-test', 'service bill review', 'IaC direction check'],
  },
  'data-platforms': {
    scope: ['pipeline fragility', 'slow recovery', 'orchestration sprawl'],
    explore: ['data visibility gap', 'proof the stack fits', 'one flow to inspect'],
  },
  'telco-tooling': {
    scope: ['operator bottleneck', 'manual SIM workflow', 'risky internal tooling'],
    explore: ['one telecom flow to inspect', 'tooling fit question', 'proof before scoping'],
  },
  'live-terminal-sandbox': {
    scope: ['sandbox guardrails', 'launch flow', 'gated runtime access'],
    explore: ['product proof', 'risk boundary check', 'browser-to-runtime trust'],
  },
  'workflow-composer': {
    scope: ['approval flow', 'manual handoff', 'workflow implementation'],
    explore: ['one orchestration pattern', 'live editor fit', 'automation proof'],
  },
}

function trimText(value = '') {
  return typeof value === 'string' ? value.trim() : ''
}

function getEmailContext(topic, intent, offer) {
  const preset = getDiscussTopicPreset(topic)
  const offerPreset = discussOfferPresets[offer]

  if (intent === 'explore') {
    return {
      subject: `${preset.emailSubject} exploratory note`,
      intro: `I would like to pressure-test whether the ${preset.optionLabel.toLowerCase()} proof path is the right starting point.`,
    }
  }

  if (topic === 'cloud-fit-deployment' && offer !== 'general') {
    return {
      subject: `${preset.emailSubject} — ${offerPreset.optionLabel}`,
      intro: offerPreset.emailIntro,
    }
  }

  return {
    subject: preset.emailSubject,
    intro: preset.emailIntro,
  }
}

function QuickIntakePanel({
  initialTopic = '',
  initialIntent = 'scope',
  initialOffer = '',
  variant = 'page',
  onClose,
}) {
  const normalizedTopic = normalizeDiscussTopic(initialTopic || 'general')
  const [activeIntent, setActiveIntent] = useState(() => normalizeDiscussIntent(initialIntent || 'scope'))
  const [formState, setFormState] = useState(defaultFormState)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitState, setSubmitState] = useState(defaultSubmitState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const problemInputRef = useRef(null)
  const isModal = variant === 'modal'

  useEffect(() => {
    setActiveIntent(normalizeDiscussIntent(initialIntent || 'scope'))
  }, [initialIntent])

  useEffect(() => {
    if (!isModal) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    window.requestAnimationFrame(() => {
      problemInputRef.current?.focus()
    })

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModal, onClose])

  const isExploreIntent = activeIntent === 'explore'
  const activeOffer =
    activeIntent === 'scope' && normalizedTopic === 'cloud-fit-deployment'
      ? normalizeDiscussOffer(initialOffer || 'review')
      : 'general'
  const topicPreset = getDiscussTopicPreset(normalizedTopic)
  const offerPreset = discussOfferPresets[activeOffer]
  const suggestions = intakeSuggestions[normalizedTopic]?.[activeIntent] || intakeSuggestions.general[activeIntent]
  const visibleSuggestions = isModal ? suggestions.slice(0, 2) : suggestions
  const panelEyebrow = isExploreIntent ? 'Proof-first note' : 'Quick intake'
  const panelTitle = isExploreIntent ? 'Start with a short proof note.' : 'Send a quick intake.'
  const panelIntro = isExploreIntent
    ? isModal
      ? 'Share what you want to inspect and the best reply email.'
      : 'Pick proof first, add what you want to inspect, and share the best reply email.'
    : isModal
      ? 'Share the bottleneck, the next useful outcome, and the best reply email.'
      : 'Pick the live-problem path, add the bottleneck and the next useful outcome, and I can ask for anything deeper after I review it.'
  const problemLabel = isExploreIntent ? 'What do you want to inspect?' : 'What needs attention?'
  const problemPlaceholder = isExploreIntent
    ? 'Name the proof surface, failure, or technical question you want pressure-tested.'
    : 'Describe the bottleneck in a few lines. Include the system and what is getting stuck.'
  const outcomeLabel = isExploreIntent ? 'What would make the proof useful? (optional)' : 'What would a useful next step look like? (optional)'
  const outcomePlaceholder = isExploreIntent
    ? 'What should be clearer once you have the right proof?'
    : 'Say what you need from the first reply, review, or delivery step.'
  const emailContext = getEmailContext(normalizedTopic, activeIntent, activeOffer)
  const showContextBadge = normalizedTopic !== 'general' || activeOffer !== 'general'
  const responseCopy = isModal ? 'Reply within 2 business days.' : responsePromise

  const directEmailHref = useMemo(
    () =>
      createDiscussEmailUrl({
        subject: emailContext.subject,
        intro: emailContext.intro,
        prompts: [
          `${problemLabel}:`,
          `${outcomeLabel.replace(' (optional)', '')}:`,
          'Best reply email:',
        ],
      }),
    [emailContext.intro, emailContext.subject, outcomeLabel, problemLabel],
  )

  const buildFallbackUrl = () =>
    createLeadSubmissionEmailUrl({
      subject: emailContext.subject,
      intro: emailContext.intro,
      intentLabel: discussIntentPresets[activeIntent].optionLabel,
      topicLabel: topicPreset.optionLabel,
      offerLabel: activeOffer !== 'general' ? offerPreset.optionLabel : '',
      workEmail: formState.workEmail,
      problem: formState.problem,
      desiredOutcome: formState.desiredOutcome,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    })

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

  const handleIntentChange = (nextIntent) => {
    setActiveIntent(normalizeDiscussIntent(nextIntent))
    setFieldErrors({})
    setSubmitState(defaultSubmitState)
  }

  const validateForm = () => {
    const errors = {}
    const workEmail = trimText(formState.workEmail).toLowerCase()

    if (!trimText(formState.problem)) {
      errors.problem = isExploreIntent ? 'Share the proof question you want reviewed.' : 'Share the bottleneck you want reviewed.'
    }

    if (!workEmail) {
      errors.workEmail = 'Work email is required.'
    } else if (!emailPattern.test(workEmail)) {
      errors.workEmail = 'Enter a valid email address.'
    }

    return errors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateForm()
    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setSubmitState(defaultSubmitState)

    const payload = {
      problem: trimText(formState.problem),
      desiredOutcome: trimText(formState.desiredOutcome),
      workEmail: trimText(formState.workEmail).toLowerCase(),
      website: formState.website,
      intent: activeIntent,
      topic: normalizedTopic,
      offer: activeOffer,
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
          message: data.error || 'The intake could not be delivered right now.',
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
    } catch {
      setSubmitState({
        type: 'error',
        message: 'The intake could not be delivered right now.',
        fallbackUrl: buildFallbackUrl(),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const panelContent = (
    <section
      id={isModal ? 'quick-intake-dialog' : undefined}
      role={isModal ? 'dialog' : undefined}
      aria-modal={isModal ? 'true' : undefined}
      aria-labelledby={isModal ? 'quick-intake-title' : undefined}
      className={`relative overflow-hidden rounded-[1.85rem] border border-white/10 bg-[#060b1b]/92 shadow-[0_34px_120px_rgba(2,6,23,0.56)] backdrop-blur-2xl ${
        isModal ? 'max-h-[calc(100vh-1.5rem)] overflow-y-auto overscroll-contain sm:max-h-[calc(100vh-3rem)]' : ''
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_26%)]" />

      <div className={`relative z-10 ${isModal ? 'p-4 sm:p-6' : 'p-5 sm:p-7'}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">{panelEyebrow}</p>
            <h2 id="quick-intake-title" className="mt-3 text-2xl font-semibold text-white sm:text-[2rem]">
              {panelTitle}
            </h2>
            <p className={`max-w-2xl text-sm text-gray-400 ${isModal ? 'mt-2.5 leading-6' : 'mt-3 leading-7'}`}>{panelIntro}</p>
          </div>

          {isModal ? (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-gray-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              aria-label="Close intake"
            >
              <FaTimes className="text-sm" />
            </button>
          ) : null}
        </div>

        {showContextBadge ? (
          <div className={`flex flex-wrap gap-2 ${isModal ? 'mt-4' : 'mt-5'}`}>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-gray-200">
              Context: {topicPreset.optionLabel}
            </span>
            {activeOffer !== 'general' ? (
              <span className="rounded-full border border-primary-500/20 bg-primary-500/10 px-3 py-1.5 text-xs font-medium text-primary-100">
                {offerPreset.optionLabel}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className={isModal ? 'mt-4' : 'mt-6'}>
          <div className="segmented-control">
            {['scope', 'explore'].map((intent) => {
              const isActive = activeIntent === intent

              return (
                <button
                  key={intent}
                  type="button"
                  onClick={() => handleIntentChange(intent)}
                  className={isActive ? 'segmented-button segmented-button-active' : 'segmented-button'}
                >
                  {discussIntentPresets[intent].optionLabel}
                </button>
              )
            })}
          </div>
          {!isModal ? <p className="mt-3 text-sm leading-7 text-gray-400">{discussIntentPresets[activeIntent].summaryText}</p> : null}
        </div>

        <div className={isModal ? 'mt-5' : 'mt-6'}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">{isModal ? 'Suggestions' : 'Helpful prompts'}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {visibleSuggestions.map((suggestion) => (
              <span
                key={suggestion}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-gray-300"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>

        <form className={isModal ? 'mt-5 space-y-3.5' : 'mt-6 space-y-4'} onSubmit={handleSubmit}>
          <input
            type="text"
            name="website"
            value={formState.website}
            onChange={handleInputChange}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div>
            <label className="form-label" htmlFor={`quick-intake-problem-${variant}`}>
              {problemLabel}
            </label>
            <textarea
              ref={problemInputRef}
              id={`quick-intake-problem-${variant}`}
              name="problem"
              rows={isModal ? 3 : 4}
              value={formState.problem}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder={problemPlaceholder}
            />
            {fieldErrors.problem ? <p className="mt-2 text-sm text-red-300">{fieldErrors.problem}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div>
              <label className="form-label" htmlFor={`quick-intake-outcome-${variant}`}>
                {outcomeLabel}
              </label>
              <input
                id={`quick-intake-outcome-${variant}`}
                name="desiredOutcome"
                type="text"
                value={formState.desiredOutcome}
                onChange={handleInputChange}
                className="form-input"
                placeholder={outcomePlaceholder}
              />
            </div>

            <div>
              <label className="form-label" htmlFor={`quick-intake-email-${variant}`}>
                Work email
              </label>
              <input
                id={`quick-intake-email-${variant}`}
                name="workEmail"
                type="email"
                value={formState.workEmail}
                onChange={handleInputChange}
                className="form-input"
                placeholder="you@company.com"
                autoComplete="email"
              />
              {fieldErrors.workEmail ? <p className="mt-2 text-sm text-red-300">{fieldErrors.workEmail}</p> : null}
            </div>
          </div>

          {submitState.type !== 'idle' ? (
            <div
              className={`rounded-[1.2rem] border px-4 py-4 text-sm leading-7 ${
                submitState.type === 'success'
                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
                  : submitState.type === 'fallback'
                    ? 'border-primary-400/30 bg-primary-500/10 text-primary-100'
                    : 'border-red-400/30 bg-red-500/10 text-red-100'
              }`}
            >
              <div className="flex gap-3">
                {submitState.type === 'success' ? (
                  <FaCheckCircle className="mt-1 shrink-0 text-xs" />
                ) : (
                  <FaEnvelope className="mt-1 shrink-0 text-xs" />
                )}
                <div>
                  <p>{submitState.message}</p>
                  {submitState.fallbackUrl ? (
                    <a href={submitState.fallbackUrl} className="soft-link mt-2 inline-flex items-center gap-2 text-current">
                      Open email fallback
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          <div className={`flex flex-col gap-3 border-t border-white/10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${isModal ? 'pt-4' : 'pt-5'}`}>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">{responseCopy}</p>
              <a href={directEmailHref} className="soft-link inline-flex items-center gap-2">
                <FaEnvelope className="text-xs" />
                Email instead
              </a>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {isModal ? (
                <button type="button" onClick={onClose} className="secondary-button gap-2">
                  Maybe later
                </button>
              ) : null}
              <button type="submit" disabled={isSubmitting} className="primary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? 'Sending...' : isExploreIntent ? 'Send proof note' : 'Send quick intake'}
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )

  if (!isModal) {
    return panelContent
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto" onClick={onClose}>
      <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" />
      <div className="relative z-10 flex min-h-full items-start justify-center p-3 sm:items-center sm:p-6">
        <div className="w-full max-w-2xl py-1 sm:py-0" onClick={(event) => event.stopPropagation()}>
          {panelContent}
        </div>
      </div>
    </div>
  )
}

export default QuickIntakePanel
