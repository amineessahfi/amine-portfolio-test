import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBolt, FaCheckCircle, FaCodeBranch, FaExclamationTriangle, FaExternalLinkAlt, FaRobot } from 'react-icons/fa'
import { createDiscussUrl } from '../constants/routes'
import { useSiteAuth } from '../context/SiteAuthContext'

const templates = [
  {
    id: 'incident-routing',
    eyebrow: 'Ops recovery',
    title: 'Incident routing flow',
    summary: 'Normalize a fresh alert, enrich it with service context, and move the right humans into the loop fast.',
    systems: ['Monitoring', 'Service map', 'Incident channel', 'Ticket queue'],
    baseMinutesSaved: 32,
    baseLatencySeconds: 18,
    steps: [
      {
        title: 'Alert trigger',
        detail: 'Receive the incident payload and classify severity before any routing happens.',
        tone: 'text-primary-200 border-primary-500/20 bg-primary-500/10',
      },
      {
        title: 'Service enrichment',
        detail: 'Attach owner, environment, and the last deployment context to the run.',
        tone: 'text-cyan-200 border-cyan-500/20 bg-cyan-500/10',
      },
      {
        title: 'Route response',
        detail: 'Open the right response channel and hand the incident to the current on-call path.',
        tone: 'text-violet-200 border-violet-500/20 bg-violet-500/10',
      },
      {
        title: 'Persist timeline',
        detail: 'Store the enriched event for later reporting and post-incident review.',
        tone: 'text-emerald-200 border-emerald-500/20 bg-emerald-500/10',
      },
    ],
    branchNote: 'If enrichment fails, rerun against the last valid service map and flag the incident lead immediately.',
  },
  {
    id: 'client-onboarding',
    eyebrow: 'Ops enablement',
    title: 'Client onboarding flow',
    summary: 'Take a new account intake, validate the brief, and create the right workspace, kickoff tasks, and notifications.',
    systems: ['Intake form', 'CRM', 'Workspace', 'Task queue'],
    baseMinutesSaved: 24,
    baseLatencySeconds: 26,
    steps: [
      {
        title: 'Intake trigger',
        detail: 'Accept the submitted brief and check that the required project inputs are present.',
        tone: 'text-primary-200 border-primary-500/20 bg-primary-500/10',
      },
      {
        title: 'Profile validation',
        detail: 'Confirm owner details, engagement type, and the right intake path for the request.',
        tone: 'text-cyan-200 border-cyan-500/20 bg-cyan-500/10',
      },
      {
        title: 'Workspace setup',
        detail: 'Create the delivery workspace, folder structure, and the first set of operating tasks.',
        tone: 'text-violet-200 border-violet-500/20 bg-violet-500/10',
      },
      {
        title: 'Kickoff handoff',
        detail: 'Push a short summary into the team channel and hand off the work package.',
        tone: 'text-emerald-200 border-emerald-500/20 bg-emerald-500/10',
      },
    ],
    branchNote: 'If intake data is incomplete, branch into a clarification queue instead of creating a half-ready workspace.',
  },
  {
    id: 'field-activation',
    eyebrow: 'Device operations',
    title: 'Field activation flow',
    summary: 'Take a provisioning request, validate inventory, and move through the right device-ops checkpoints with explicit fallbacks.',
    systems: ['Provisioning API', 'Inventory', 'OTA queue', 'Operations log'],
    baseMinutesSaved: 41,
    baseLatencySeconds: 34,
    steps: [
      {
        title: 'Provisioning trigger',
        detail: 'Receive the activation request and validate the device profile against the expected inventory state.',
        tone: 'text-primary-200 border-primary-500/20 bg-primary-500/10',
      },
      {
        title: 'Inventory check',
        detail: 'Confirm stock, credentials, and the service profile before any irreversible change is made.',
        tone: 'text-cyan-200 border-cyan-500/20 bg-cyan-500/10',
      },
      {
        title: 'Dispatch action',
        detail: 'Queue the activation job with the right operating policy and hand it to the execution service.',
        tone: 'text-violet-200 border-violet-500/20 bg-violet-500/10',
      },
      {
        title: 'Writeback status',
        detail: 'Record the final state for auditability and downstream support workflows.',
        tone: 'text-emerald-200 border-emerald-500/20 bg-emerald-500/10',
      },
    ],
    branchNote: 'If inventory or policy validation fails, the run detours into an operator review queue instead of forcing the request through.',
  },
]

const notificationModes = [
  { id: 'slack', label: 'Slack only', systems: ['Slack'] },
  { id: 'slack-email', label: 'Slack + email', systems: ['Slack', 'Email'] },
  { id: 'ticket-log', label: 'Ticket log', systems: ['Backlog', 'Ops log'] },
]

const liveNodeLibrary = ['Manual Trigger', 'Set', 'If', 'Switch', 'Merge', 'Wait']
const liveStudioGuardrails = [
  'Authenticated launch only through the site-wide Google session.',
  'Dedicated demo instance, separate from the personal n8n workspace.',
  'Limited node library with no community nodes, credentials, or code execution.',
  'Manual-trigger only so the demo does not expose public webhooks or schedules.',
]

function WorkflowComposerDemo() {
  const {
    authReady,
    authState,
    consumeOauthResult,
    startSignIn,
    syncAuthState,
  } = useSiteAuth()
  const [selectedTemplateId, setSelectedTemplateId] = useState('incident-routing')
  const [approvalEnabled, setApprovalEnabled] = useState(true)
  const [failureBranchEnabled, setFailureBranchEnabled] = useState(true)
  const [notificationMode, setNotificationMode] = useState('slack-email')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId) || templates[0]
  const selectedNotification = notificationModes.find((mode) => mode.id === notificationMode) || notificationModes[1]
  const workflowStudioUrl = authState.workflowStudioUrl || ''
  const workflowStudioEnabled = authState.workflowStudioEnabled

  useEffect(() => {
    const oauthState = consumeOauthResult()

    if (oauthState === 'success') {
      setNotice('Sign-in complete. The live studio is ready.')
      setError('')
      void syncAuthState()
    } else if (oauthState === 'error') {
      setNotice('')
      setError('Sign-in did not complete. Please try again.')
    }
  }, [consumeOauthResult, syncAuthState])

  const composerState = useMemo(() => {
    const mainNodes = [...selectedTemplate.steps]

    if (approvalEnabled) {
      mainNodes.splice(mainNodes.length - 1, 0, {
        title: 'Approval gate',
        detail: 'Pause the run for an operator check before the final action commits.',
        tone: 'text-amber-200 border-amber-500/20 bg-amber-500/10',
      })
    }

    mainNodes.push({
      title: 'Notify stakeholders',
      detail:
        notificationMode === 'ticket-log'
          ? 'Write the result into the backlog and the operator log instead of pushing to a live endpoint.'
          : notificationMode === 'slack'
            ? 'Post the run result into the operating channel for immediate visibility.'
            : 'Notify the operating channel and send a short email summary to the owner.',
      tone: 'text-sky-200 border-sky-500/20 bg-sky-500/10',
    })

    const branchNodes = failureBranchEnabled
      ? [
          {
            title: 'Retry policy',
            detail: 'Retry transient failures with bounded backoff before escalating.',
          },
          {
            title: 'Fallback queue',
            detail: selectedTemplate.branchNote,
          },
        ]
      : [
          {
            title: 'Manual review',
            detail: 'Send unexpected failures straight to an operator queue with the run context attached.',
          },
        ]

    const systems = new Set([...selectedTemplate.systems, ...selectedNotification.systems])
    const guardrails = (approvalEnabled ? 1 : 0) + (failureBranchEnabled ? 1 : 0) + 1
    const estimatedSeconds =
      selectedTemplate.baseLatencySeconds +
      (approvalEnabled ? 12 : 0) +
      (failureBranchEnabled ? 8 : 0) +
      (notificationMode === 'slack-email' ? 5 : notificationMode === 'slack' ? 3 : 4)

    return {
      mainNodes,
      branchNodes,
      systems: systems.size,
      guardrails,
      stepCount: mainNodes.length + branchNodes.length,
      estimatedSeconds,
      minutesSaved:
        selectedTemplate.baseMinutesSaved +
        (failureBranchEnabled ? 7 : 3) +
        (approvalEnabled ? 4 : 0),
    }
  }, [approvalEnabled, failureBranchEnabled, notificationMode, selectedNotification.systems, selectedTemplate])

  const handleSignIn = () => {
    const signInError = startSignIn(window.location.href)
    if (signInError) {
      setNotice('')
      setError(signInError)
    }
  }

  const handleLaunchStudio = () => {
    if (!workflowStudioUrl) {
      setNotice('')
      setError('The live workflow studio is not configured right now.')
      return
    }

    window.open(workflowStudioUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="workflow-composer" className="scroll-mt-28">
      <div className="terminal-window card-hover">
        <div className="terminal-header">
          <div className="text-sm text-gray-400">workflow-composer — interactive</div>
        </div>

        <div className="terminal-content">
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-white">Workflow composer demo</h3>
            <p className="max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
              Shape an automation flow here, then open the restricted live studio when you want the real n8n editor instead of a mock surface.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
            <div className="metric-card p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Live studio</p>
              <h4 className="mt-4 text-2xl font-semibold text-white">Actual n8n editor, limited on purpose.</h4>
              <p className="mt-4 text-sm leading-8 text-gray-400">
                The live studio opens on a dedicated demo instance with a constrained node library and no saved credentials. It launches in a separate tab because the full editor works better outside an embedded frame.
              </p>

              {notice ? <p className="mt-4 text-sm text-cyan-200">{notice}</p> : null}
              {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {!authReady ? (
                  <button type="button" disabled className="secondary-button opacity-70">
                    Checking access
                  </button>
                ) : !workflowStudioEnabled ? (
                  <button type="button" disabled className="secondary-button opacity-70">
                    Live studio unavailable
                  </button>
                ) : authState.authenticated ? (
                  <button type="button" onClick={handleLaunchStudio} className="primary-button gap-2">
                    Open live n8n studio
                    <FaExternalLinkAlt className="text-xs" />
                  </button>
                ) : authState.authConfigured ? (
                  <button type="button" onClick={handleSignIn} className="primary-button">
                    Sign in to unlock the live studio
                  </button>
                ) : (
                  <button type="button" disabled className="secondary-button opacity-70">
                    Sign-in unavailable
                  </button>
                )}

                <Link to={createDiscussUrl('workflow-composer')} className="secondary-button">
                  Discuss the workflow build
                </Link>
              </div>
            </div>

            <div className="terminal-window">
              <div className="terminal-header">
                <div className="text-sm text-gray-400">studio — guardrails</div>
              </div>

              <div className="terminal-content">
                <div>
                  <span className="section-chip">Why this is safe enough to show</span>
                  <h4 className="section-title text-3xl sm:text-4xl">Restricted live access, not your personal editor.</h4>
                </div>

                <ul className="space-y-3 text-sm leading-7 text-gray-300">
                  {liveStudioGuardrails.map((item) => (
                    <li key={item} className="flex gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-[1.35rem] border border-violet-500/20 bg-violet-500/10 px-4 py-4 text-sm leading-7 text-violet-100">
                  The live node palette is intentionally small: {liveNodeLibrary.join(', ')}.
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(16rem,0.88fr)_minmax(0,1.12fr)]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <FaRobot className="text-primary-300" />
                  Workflow templates
                </div>
                <div className="mt-4 space-y-3">
                  {templates.map((template) => {
                    const isSelected = template.id === selectedTemplateId

                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => setSelectedTemplateId(template.id)}
                        className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                          isSelected
                            ? 'border-primary-500/40 bg-primary-500/10'
                            : 'border-white/10 bg-white/[0.03] hover:border-primary-500/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">{template.eyebrow}</p>
                        <p className="mt-3 text-sm font-semibold text-white">{template.title}</p>
                        <p className="mt-2 text-sm leading-7 text-gray-400">{template.summary}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <FaCodeBranch className="text-cyan-300" />
                  Guardrails
                </div>
                <div className="mt-4 space-y-3">
                  <button
                    type="button"
                    onClick={() => setApprovalEnabled((value) => !value)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      approvalEnabled
                        ? 'border-amber-500/30 bg-amber-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-amber-500/20'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">Approval gate</p>
                      <p className="mt-1 text-sm leading-7 text-gray-400">Hold sensitive runs until an operator confirms the next step.</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                      {approvalEnabled ? 'On' : 'Off'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFailureBranchEnabled((value) => !value)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                      failureBranchEnabled
                        ? 'border-rose-500/30 bg-rose-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-rose-500/20'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">Failure branch</p>
                      <p className="mt-1 text-sm leading-7 text-gray-400">Add a bounded retry path before handing unexpected cases to humans.</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-200">
                      {failureBranchEnabled ? 'On' : 'Off'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <FaBolt className="text-violet-300" />
                  Output mode
                </div>
                <div className="mt-4 grid gap-3">
                  {notificationModes.map((mode) => {
                    const isSelected = mode.id === notificationMode

                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setNotificationMode(mode.id)}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${
                          isSelected
                            ? 'border-violet-500/30 bg-violet-500/10'
                            : 'border-white/10 bg-white/[0.03] hover:border-violet-500/20'
                        }`}
                      >
                        <p className="text-sm font-semibold text-white">{mode.label}</p>
                        <p className="mt-2 text-sm leading-7 text-gray-400">{mode.systems.join(' + ')}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
                <p className="text-sm font-semibold text-white">Node library</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {liveNodeLibrary.map((node) => (
                    <span key={node} className="skill-badge">
                      {node}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="metric-card p-4">
                  <div className="text-2xl font-semibold text-white">{composerState.stepCount}</div>
                  <div className="mt-2 text-sm text-gray-400">Active steps</div>
                </div>
                <div className="metric-card p-4">
                  <div className="text-2xl font-semibold text-cyan-300">{composerState.systems}</div>
                  <div className="mt-2 text-sm text-gray-400">Systems in loop</div>
                </div>
                <div className="metric-card p-4">
                  <div className="text-2xl font-semibold text-violet-300">{composerState.guardrails}</div>
                  <div className="mt-2 text-sm text-gray-400">Guardrails applied</div>
                </div>
                <div className="metric-card p-4">
                  <div className="text-2xl font-semibold text-emerald-300">{composerState.minutesSaved}m</div>
                  <div className="mt-2 text-sm text-gray-400">Estimated manual time saved</div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-dark-700/70 bg-dark-900/40 p-5 sm:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Composer canvas</p>
                    <h4 className="mt-3 text-xl font-semibold text-white">{selectedTemplate.title}</h4>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300">
                    Estimated run: <span className="font-semibold text-white">{composerState.estimatedSeconds}s</span>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-[#050816]/80 p-4 sm:p-5">
                    <div className="space-y-4">
                      {composerState.mainNodes.map((node, index) => (
                        <div key={`${node.title}-${index}`} className="relative flex gap-4 pl-2">
                          {index < composerState.mainNodes.length - 1 ? (
                            <span className="absolute left-[1.05rem] top-9 h-[calc(100%+0.85rem)] w-px bg-white/10" />
                          ) : null}
                          <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-sm font-semibold text-white">
                            {index + 1}
                          </span>
                          <div className={`flex-1 rounded-[1.25rem] border px-4 py-4 ${node.tone}`}>
                            <p className="text-sm font-semibold text-white">{node.title}</p>
                            <p className="mt-2 text-sm leading-7 text-gray-300">{node.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-[1.5rem] border border-rose-500/20 bg-rose-500/10 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-rose-100">
                        <FaExclamationTriangle className="text-xs" />
                        Failure path
                      </div>
                      <div className="mt-4 space-y-3">
                        {composerState.branchNodes.map((node) => (
                          <div key={node.title} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
                            <p className="text-sm font-semibold text-white">{node.title}</p>
                            <p className="mt-2 text-sm leading-7 text-gray-300">{node.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/10 p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
                        <FaCheckCircle className="text-xs" />
                        Delivery signal
                      </div>
                      <p className="mt-3 text-sm leading-7 text-gray-200">
                        The value here is not the mock canvas alone. It is the ability to review the orchestration path, controls, and handoffs before implementation starts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-primary-500/20 bg-primary-500/10 p-5">
                <p className="text-sm leading-7 text-gray-300">
                  <span className="font-semibold">If the preview feels close to the real problem,</span> open the restricted live studio for the real n8n editor, then send the workflow brief and I&apos;ll turn it into a sharper implementation path with the right approval, retry, and operating-model decisions.
                </p>
                <Link
                  to={createDiscussUrl('workflow-composer')}
                  className="mt-4 inline-flex justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-700"
                >
                  Turn this into a workflow build
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorkflowComposerDemo
