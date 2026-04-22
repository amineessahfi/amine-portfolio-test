import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowRight,
  FaClock,
  FaCloudUploadAlt,
  FaShieldAlt,
  FaSyncAlt,
  FaTimes,
  FaTrashAlt,
} from 'react-icons/fa'
import { createDiscussUrl } from '../constants/routes'
import { SANDBOX_API_BASE } from '../constants/sandbox'

const demoLaunchSteps = [
  'Open the launch modal and arm one fixed AWS demo stack.',
  'Provision S3, SQS, Lambda, EventBridge, Glue, and Athena in eu-west-3.',
  'Inspect the live stack, then let it self-destruct or destroy it early.',
]

const demoProofPoints = [
  {
    title: 'Real provisioning',
    detail: 'This is not a mock. The backend creates actual AWS resources and validates the stack with a Lambda invoke and Athena query.',
  },
  {
    title: 'Hard limits',
    detail: 'One fixed template, one live public stack, one browser-owned destroy path, and no arbitrary YAML or region input from the page.',
  },
  {
    title: 'Forced teardown',
    detail: 'The stack self-destructs after 10 minutes, and the page keeps polling the live status so the countdown is visible.',
  },
]

function formatCountdown(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function formatTimestamp(value) {
  if (!value) {
    return '—'
  }

  try {
    return new Date(Number(value) * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function LaunchModal({
  isOpen,
  onClose,
  onLaunch,
  launching,
  ttlMinutes,
  guardrails,
}) {
  useEffect(() => {
    if (!isOpen) {
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

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto" onClick={onClose}>
      <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" />
      <div className="relative z-10 flex min-h-full items-start justify-center p-3 sm:items-center sm:p-6">
        <div
          className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#030817] p-5 shadow-[0_30px_80px_rgba(2,6,23,0.65)] sm:p-7"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="section-chip">Actual short-lived deployment</span>
              <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Launch the real AWS demo stack.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
                This provisions one fixed demo shape in AWS, validates it, and then tears it down automatically after {ttlMinutes} minutes.
              </p>
            </div>
            <button type="button" onClick={onClose} className="secondary-button px-4 py-3">
              <FaTimes />
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">What gets created</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                {[
                  'S3 landing bucket',
                  'SQS queue plus dead-letter queue',
                  'Lambda ingest function',
                  'EventBridge schedule',
                  'Glue catalog table',
                  'Athena validation query',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-primary-500/20 bg-primary-500/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Guard rails</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-primary-50">
                {guardrails.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-400">Use this when you want proof that the infrastructure can really appear, validate, and disappear on demand.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onClose} className="secondary-button">
                Not now
              </button>
              <button
                type="button"
                onClick={() => void onLaunch()}
                disabled={launching}
                className="primary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaCloudUploadAlt className="text-sm" />
                {launching ? 'Launching real AWS stack…' : `Launch ${ttlMinutes}-minute demo`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AwsDataPipelineStudio() {
  const [statusState, setStatusState] = useState({
    loading: true,
    available: false,
    enabled: false,
    reason: '',
    launchTtlMinutes: 10,
    guardrails: [],
    activeRun: null,
  })
  const [launching, setLaunching] = useState(false)
  const [destroying, setDestroying] = useState(false)
  const [showLaunchModal, setShowLaunchModal] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadStatus = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) {
      setStatusState((current) => ({ ...current, loading: true }))
    }

    try {
      const response = await fetch(`${SANDBOX_API_BASE}/aws-demo/live/status`, {
        credentials: 'include',
      })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload?.error || 'The live AWS demo status could not be loaded.')
      }

      setStatusState({
        loading: false,
        available: Boolean(payload.available),
        enabled: Boolean(payload.enabled),
        reason: payload.reason || '',
        launchTtlMinutes: payload.launchTtlMinutes || 10,
        guardrails: payload.guardrails || [],
        activeRun: payload.activeRun || null,
      })
      return payload
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'The live AWS demo status could not be loaded.'
      setStatusState((current) => ({
        ...current,
        loading: false,
        available: false,
        reason: current.reason || message,
      }))
      if (!quiet) {
        setError(message)
      }
      return null
    }
  }, [])

  useEffect(() => {
    void loadStatus()
  }, [loadStatus])

  useEffect(() => {
    if (!statusState.activeRun || !['creating', 'ready'].includes(statusState.activeRun.status)) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      void loadStatus({ quiet: true })
    }, 10000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [loadStatus, statusState.activeRun])

  const activeRun = statusState.activeRun
  const countdownLabel = useMemo(
    () => formatCountdown(activeRun?.countdownSeconds || statusState.launchTtlMinutes * 60),
    [activeRun?.countdownSeconds, statusState.launchTtlMinutes],
  )

  const handleLaunch = useCallback(async () => {
    setLaunching(true)
    setError('')
    setNotice('')

    try {
      const response = await fetch(`${SANDBOX_API_BASE}/aws-demo/live/launch`, {
        method: 'POST',
        credentials: 'include',
      })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload?.error || payload?.message || 'The live AWS demo could not be launched right now.')
      }

      setShowLaunchModal(false)
      setNotice(`Live AWS demo armed. Stack ${payload?.activeRun?.id || 'created'} will self-destruct in ${statusState.launchTtlMinutes} minutes.`)
      setStatusState((current) => ({
        ...current,
        activeRun: payload.activeRun || null,
        guardrails: payload.guardrails || current.guardrails,
        available: true,
      }))
      await loadStatus({ quiet: true })
    } catch (launchError) {
      setError(launchError instanceof Error ? launchError.message : 'The live AWS demo could not be launched right now.')
    } finally {
      setLaunching(false)
    }
  }, [loadStatus, statusState.launchTtlMinutes])

  const handleDestroy = useCallback(async () => {
    setDestroying(true)
    setError('')
    setNotice('')

    try {
      const response = await fetch(`${SANDBOX_API_BASE}/aws-demo/live/destroy`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload?.error || 'The live AWS demo could not be destroyed right now.')
      }

      setNotice('The live AWS demo stack is being torn down now.')
      setStatusState((current) => ({
        ...current,
        activeRun: payload.activeRun || null,
      }))
      await loadStatus({ quiet: true })
    } catch (destroyError) {
      setError(destroyError instanceof Error ? destroyError.message : 'The live AWS demo could not be destroyed right now.')
    } finally {
      setDestroying(false)
    }
  }, [loadStatus])

  const runSummaryEntries = activeRun?.summary
    ? [
        ['Region', activeRun.summary.region],
        ['Bucket', activeRun.summary.bucketName],
        ['Lambda', activeRun.summary.lambdaName],
        ['Schedule', activeRun.summary.eventRuleName],
        ['Glue catalog', activeRun.summary.glueDatabase && activeRun.summary.glueTable ? `${activeRun.summary.glueDatabase}.${activeRun.summary.glueTable}` : '—'],
        ['Validation rows', activeRun.summary.athenaRowCount ?? '—'],
      ]
    : []

  return (
    <>
      <section id="aws-data-demos" className="scroll-mt-28">
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="text-sm text-gray-400">data-platforms — live aws demo</div>
          </div>

          <div className="terminal-content">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="section-chip">Actual deployment, not architecture theater</span>
                <h2 className="section-title text-3xl sm:text-4xl">Launch a real AWS stack with a hard self-destruct timer.</h2>
              </div>
              <p className="max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
                This page now exists to prove one thing clearly: I can stand up a real short-lived AWS data demo, validate it, and kill it again under tight guard rails.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {demoProofPoints.map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">{item.title}</p>
                  <p className="mt-4 text-sm leading-7 text-gray-300">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
              <div className="metric-card p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Launch panel</p>
                    <h3 className="mt-4 text-2xl font-semibold text-white">One click. One fixed stack. One countdown.</h3>
                    <p className="mt-4 max-w-2xl text-sm leading-8 text-gray-400">
                      The live launcher is intentionally narrow: one approved stack shape, one region, and one browser-owned teardown flow.
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-primary-500/20 bg-primary-500/10 px-4 py-4 text-sm text-primary-50">
                    <div className="flex items-center gap-2 font-semibold">
                      <FaClock className="text-xs" />
                      {activeRun ? `Self-destruct in ${countdownLabel}` : `${statusState.launchTtlMinutes}-minute TTL`}
                    </div>
                    <p className="mt-2 text-xs leading-6 text-primary-100/90">
                      {activeRun ? `Created ${formatTimestamp(activeRun.createdAt)} · expires ${formatTimestamp(activeRun.expiresAt)}` : 'The timer is enforced by the backend even if the browser closes.'}
                    </p>
                  </div>
                </div>

                {notice ? (
                  <div className="mt-5 rounded-[1.2rem] border border-cyan-400/30 bg-cyan-400/10 px-4 py-4 text-sm leading-7 text-cyan-100">
                    {notice}
                  </div>
                ) : null}

                {error ? (
                  <div className="mt-5 rounded-[1.2rem] border border-red-400/30 bg-red-500/10 px-4 py-4 text-sm leading-7 text-red-100">
                    {error}
                  </div>
                ) : null}

                {!statusState.available ? (
                  <div className="mt-6 rounded-[1.35rem] border border-amber-400/30 bg-amber-400/10 px-4 py-4 text-sm leading-7 text-amber-100">
                    {statusState.loading
                      ? 'Checking whether the live AWS runtime is armed…'
                      : statusState.reason || 'The live AWS runtime is not armed yet.'}
                  </div>
                ) : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowLaunchModal(true)}
                    disabled={!statusState.available || launching || Boolean(activeRun)}
                    className="primary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <FaCloudUploadAlt className="text-sm" />
                    {launching ? 'Launching real AWS stack…' : activeRun ? 'Live stack already active' : 'Launch real AWS demo'}
                  </button>

                  <button
                    type="button"
                    onClick={() => void loadStatus()}
                    disabled={statusState.loading}
                    className="secondary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <FaSyncAlt className="text-xs" />
                    Refresh status
                  </button>

                  {activeRun ? (
                    <button
                      type="button"
                      onClick={() => void handleDestroy()}
                      disabled={destroying}
                      className="secondary-button gap-2 border-red-400/30 text-red-100 hover:border-red-300/60"
                    >
                      <FaTrashAlt className="text-xs" />
                      {destroying ? 'Destroying stack…' : 'Destroy now'}
                    </button>
                  ) : null}

                  <Link to={createDiscussUrl('data-platforms')} className="secondary-button gap-2">
                    Turn this into a scoped AWS engagement
                    <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </div>

              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="text-sm text-gray-400">live-demo — status</div>
                </div>

                <div className="terminal-content">
                  <div>
                    <span className="section-chip">Guarded launch path</span>
                    <h3 className="section-title text-3xl sm:text-4xl">
                      {activeRun ? 'A live stack is up right now.' : 'No live stack is running.'}
                    </h3>
                  </div>

                  {activeRun ? (
                    <div className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="metric-card p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Run status</p>
                          <p className="mt-3 text-lg font-semibold text-white">{activeRun.status}</p>
                        </div>
                        <div className="metric-card p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Countdown</p>
                          <p className="mt-3 text-lg font-semibold text-white">{countdownLabel}</p>
                        </div>
                      </div>

                      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Live resource summary</p>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          {runSummaryEntries.map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</p>
                              <p className="mt-2 break-all text-sm leading-7 text-gray-200">{value || '—'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <p className="text-sm leading-7 text-gray-300">
                        Open the launch modal when you want the real stack. The backend will create, validate, and later destroy the demo without needing custom inputs from the browser.
                      </p>

                      <ol className="space-y-3 text-sm leading-7 text-gray-300">
                        {demoLaunchSteps.map((step, index) => (
                          <li key={step} className="flex gap-4 rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-sm font-semibold text-white">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-dark-700/70 bg-dark-900/40 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Why this is safe enough to show</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Big guard rails, very little room for chaos.</h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-100">
                  <FaShieldAlt className="text-[11px]" />
                  {statusState.launchTtlMinutes}-minute forced TTL
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {statusState.guardrails.map((item) => (
                  <div key={item} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-gray-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <LaunchModal
        isOpen={showLaunchModal}
        onClose={() => setShowLaunchModal(false)}
        onLaunch={handleLaunch}
        launching={launching}
        ttlMinutes={statusState.launchTtlMinutes}
        guardrails={statusState.guardrails}
      />
    </>
  )
}

export default AwsDataPipelineStudio
