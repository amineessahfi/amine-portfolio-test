import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowRight,
  FaClock,
  FaCloudUploadAlt,
  FaDatabase,
  FaPlay,
  FaShieldAlt,
  FaSyncAlt,
  FaTable,
  FaTimes,
  FaTrashAlt,
} from 'react-icons/fa'
import { createDiscussUrl } from '../constants/routes'
import { SANDBOX_API_BASE } from '../constants/sandbox'

const demoLaunchSteps = [
  'Open the launch modal and arm one fixed AWS demo stack.',
  'Provision S3, SQS, Lambda, EventBridge, Glue, and Athena in eu-west-3.',
  'Use the live resource actions, then let the stack self-destruct or destroy it early.',
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
    const numericValue = Number(value)
    const parsed = Number.isFinite(numericValue) && numericValue > 0 ? new Date(numericValue * 1000) : new Date(value)
    return parsed.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function formatBytes(value) {
  const bytes = Number(value) || 0
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
  const [resourceState, setResourceState] = useState({
    loading: false,
    loaded: false,
    resources: null,
  })
  const [actionState, setActionState] = useState({
    loading: false,
    action: '',
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

  const loadResources = useCallback(async ({ quiet = false } = {}) => {
    if (!quiet) {
      setResourceState((current) => ({ ...current, loading: true }))
    }

    try {
      const response = await fetch(`${SANDBOX_API_BASE}/aws-demo/live/resources`, {
        credentials: 'include',
      })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload?.error || 'The live AWS resource state could not be loaded.')
      }

      setResourceState({
        loading: false,
        loaded: true,
        resources: payload.resources || null,
      })
      return payload
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'The live AWS resource state could not be loaded.'
      setResourceState({
        loading: false,
        loaded: true,
        resources: null,
      })
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
      setResourceState({
        loading: false,
        loaded: false,
        resources: null,
      })
      return undefined
    }

    const intervalId = window.setInterval(() => {
      void loadStatus({ quiet: true })
    }, 10000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [loadStatus, statusState.activeRun])

  useEffect(() => {
    if (!statusState.activeRun || statusState.activeRun.status !== 'ready') {
      return
    }
    void loadResources({ quiet: true })
  }, [loadResources, statusState.activeRun?.id, statusState.activeRun?.status])

  const activeRun = statusState.activeRun
  const resources = resourceState.resources
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
      setResourceState({
        loading: false,
        loaded: false,
        resources: payload.resources || null,
      })
      await loadStatus({ quiet: true })
      await loadResources({ quiet: true })
    } catch (launchError) {
      setError(launchError instanceof Error ? launchError.message : 'The live AWS demo could not be launched right now.')
    } finally {
      setLaunching(false)
    }
  }, [loadResources, loadStatus, statusState.launchTtlMinutes])

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
      setResourceState({
        loading: false,
        loaded: false,
        resources: null,
      })
      await loadStatus({ quiet: true })
    } catch (destroyError) {
      setError(destroyError instanceof Error ? destroyError.message : 'The live AWS demo could not be destroyed right now.')
    } finally {
      setDestroying(false)
    }
  }, [loadStatus])

  const handleResourceAction = useCallback(async (action) => {
    setActionState({ loading: true, action })
    setError('')
    setNotice('')

    try {
      const response =
        action === 'refresh-resources'
          ? await fetch(`${SANDBOX_API_BASE}/aws-demo/live/resources`, {
              credentials: 'include',
            })
          : await fetch(`${SANDBOX_API_BASE}/aws-demo/live/actions/${action}`, {
              method: 'POST',
              credentials: 'include',
            })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload?.error || `The ${action} action could not be completed.`)
      }

      if (payload.resources) {
        setResourceState({
          loading: false,
          loaded: true,
          resources: payload.resources,
        })
      }

      if (action === 'lambda-invoke') {
        const key = payload?.result?.payload?.key
        setNotice(key ? `Lambda invoked successfully and wrote ${key}.` : 'Lambda invoked successfully.')
      } else if (action === 'bucket-seed') {
        setNotice(payload?.result?.key ? `Sample object inserted into S3: ${payload.result.key}` : 'Sample object inserted into S3.')
      } else {
        setNotice('Live AWS resource state refreshed.')
      }

      await loadStatus({ quiet: true })
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'The live AWS resource action could not be completed.')
    } finally {
      setActionState({ loading: false, action: '' })
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

            {activeRun ? (
              <div className="rounded-[1.6rem] border border-dark-700/70 bg-dark-900/40 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Live resource actions</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">Use the resources you just provisioned.</h3>
                    <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-300">
                      Every card below maps to a real AWS resource in the current short-lived stack. Invoke Lambda, insert data into S3, inspect queue depth, verify the EventBridge rule, and preview the Glue/Athena table from this browser session.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => void handleResourceAction('refresh-resources')}
                    disabled={resourceState.loading || actionState.loading}
                    className="secondary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <FaSyncAlt className="text-xs" />
                    {resourceState.loading || actionState.action === 'refresh-resources' ? 'Refreshing resources…' : 'Refresh resource state'}
                  </button>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Lambda function</p>
                        <h4 className="mt-3 text-xl font-semibold text-white">{resources?.lambda?.name || activeRun.summary.lambdaName}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleResourceAction('lambda-invoke')}
                        disabled={actionState.loading}
                        className="primary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <FaPlay className="text-xs" />
                        {actionState.loading && actionState.action === 'lambda-invoke' ? 'Invoking Lambda…' : 'Invoke Lambda'}
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Runtime</p>
                        <p className="mt-2 text-sm text-gray-200">{resources?.lambda?.runtime || '—'}</p>
                      </div>
                      <div className="rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Timeout</p>
                        <p className="mt-2 text-sm text-gray-200">{resources?.lambda?.timeout ? `${resources.lambda.timeout}s` : '—'}</p>
                      </div>
                      <div className="rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Memory</p>
                        <p className="mt-2 text-sm text-gray-200">{resources?.lambda?.memorySize ? `${resources.lambda.memorySize} MB` : '—'}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-gray-300">
                      Action: run the ingest function on demand. It writes a new CSV object and pushes a message into the queue.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">S3 bucket</p>
                        <h4 className="mt-3 break-all text-xl font-semibold text-white">{resources?.bucket?.name || activeRun.summary.bucketName}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleResourceAction('bucket-seed')}
                        disabled={actionState.loading}
                        className="primary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <FaCloudUploadAlt className="text-xs" />
                        {actionState.loading && actionState.action === 'bucket-seed' ? 'Writing object…' : 'Insert sample object'}
                      </button>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-gray-300">
                      Action: drop a sample CSV into the curated prefix so the Athena table can see fresh rows immediately.
                    </p>
                    <div className="mt-4 space-y-3">
                      {(resources?.bucket?.objects || []).slice(0, 5).map((item) => (
                        <div key={item.key} className="rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4">
                          <p className="break-all text-sm text-gray-200">{item.key}</p>
                          <p className="mt-2 text-xs text-gray-500">{formatBytes(item.size)} · {formatTimestamp(item.lastModified)}</p>
                        </div>
                      ))}
                    </div>
                    {resources?.bucket?.latestObject?.preview ? (
                      <pre className="mt-4 overflow-x-auto rounded-2xl border border-dark-700/70 bg-black/30 px-4 py-4 text-xs leading-6 text-cyan-100">
                        {resources.bucket.latestObject.preview}
                      </pre>
                    ) : null}
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Queues</p>
                        <h4 className="mt-3 text-xl font-semibold text-white">{resources?.queue?.name || 'Primary queue'}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleResourceAction('refresh-resources')}
                        disabled={actionState.loading || resourceState.loading}
                        className="secondary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <FaSyncAlt className="text-xs" />
                        Refresh depth
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Primary queue</p>
                        <p className="mt-2 text-sm text-gray-200">{resources?.queue?.approximateMessages ?? 0} waiting · {resources?.queue?.approximateInFlight ?? 0} in flight</p>
                      </div>
                      <div className="rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Dead-letter queue</p>
                        <p className="mt-2 text-sm text-gray-200">{resources?.deadLetterQueue?.approximateMessages ?? 0} waiting · {resources?.deadLetterQueue?.approximateInFlight ?? 0} in flight</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-gray-300">
                      Action: refresh queue depth after Lambda or S3 actions to see how the runtime moved messages.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">EventBridge schedule</p>
                        <h4 className="mt-3 text-xl font-semibold text-white">{resources?.eventBridge?.name || activeRun.summary.eventRuleName}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleResourceAction('refresh-resources')}
                        disabled={actionState.loading || resourceState.loading}
                        className="secondary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <FaSyncAlt className="text-xs" />
                        Refresh rule
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">State</p>
                        <p className="mt-2 text-sm text-gray-200">{resources?.eventBridge?.state || '—'}</p>
                      </div>
                      <div className="rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">Schedule</p>
                        <p className="mt-2 text-sm text-gray-200">{resources?.eventBridge?.scheduleExpression || '—'}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-gray-300">
                      Action: inspect the rule state and cadence that would re-trigger the demo function automatically.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Glue catalog</p>
                        <h4 className="mt-3 text-xl font-semibold text-white">{resources?.glue?.database || activeRun.summary.glueDatabase}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleResourceAction('refresh-resources')}
                        disabled={actionState.loading || resourceState.loading}
                        className="secondary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <FaDatabase className="text-xs" />
                        Refresh tables
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {(resources?.glue?.tables || []).map((tableName) => (
                        <span key={tableName} className="rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary-100">
                          {tableName}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-7 text-gray-300">
                      Action: inspect the live catalog entries that Athena can query in the current demo stack.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 xl:col-span-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Athena table preview</p>
                        <h4 className="mt-3 text-xl font-semibold text-white">
                          {resources?.athena?.database && resources?.athena?.table ? `${resources.athena.database}.${resources.athena.table}` : 'Athena preview'}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleResourceAction('refresh-resources')}
                        disabled={actionState.loading || resourceState.loading}
                        className="primary-button gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <FaTable className="text-xs" />
                        {resourceState.loading || actionState.action === 'refresh-resources' ? 'Refreshing preview…' : 'Refresh Athena preview'}
                      </button>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-gray-300">
                      Action: rerun the Athena preview after Lambda or S3 writes and confirm the live table contents from the current stack.
                    </p>
                    {resources?.athena?.previewColumns?.length ? (
                      <div className="mt-4 overflow-x-auto rounded-2xl border border-dark-700/70 bg-black/20">
                        <table className="min-w-full text-left text-sm text-gray-200">
                          <thead className="border-b border-dark-700/70 text-xs uppercase tracking-[0.18em] text-gray-500">
                            <tr>
                              {resources.athena.previewColumns.map((column) => (
                                <th key={column} className="px-4 py-3">{column}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {resources.athena.previewRows.map((row, index) => (
                              <tr key={`${row.join('-')}-${index}`} className="border-b border-dark-700/40 last:border-b-0">
                                {row.map((value, cellIndex) => (
                                  <td key={`${index}-${cellIndex}`} className="px-4 py-3 align-top text-xs leading-6 text-gray-300">
                                    {value || '—'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4 text-sm text-gray-300">
                        {resourceState.loading ? 'Loading Athena preview…' : 'No Athena preview rows are available yet.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

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
