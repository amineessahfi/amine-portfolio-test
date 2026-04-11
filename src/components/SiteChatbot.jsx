import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaArrowRight, FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa'
import {
  ARCHITECTURE_STACK_ROUTE,
  CLOUD_FIT_ROUTE,
  LIVE_SANDBOX_ROUTE,
  SERVICES_DIRECTORY_ROUTE,
  WORKFLOW_COMPOSER_ROUTE,
  createDiscussUrl,
  createServiceRoute,
} from '../constants/routes'

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term))
}

function buildRouteContext(pathname) {
  if (pathname.includes('/services/cloud-fit-deployment')) {
    return {
      welcome:
        'You are in the cloud fit lane. Ask about provider choice, the services listing, the architecture review, or the one-time deploy pack.',
      prompts: ['Compare providers', 'What does the deploy pack include?', 'Should I book the review?'],
      actions: [
        { label: 'Open the cloud fit demo', to: CLOUD_FIT_ROUTE },
        { label: 'Book architecture review', to: createDiscussUrl('cloud-fit-deployment', { intent: 'scope', offer: 'review' }) },
      ],
    }
  }

  if (pathname.includes('/services/workflow-composer')) {
    return {
      welcome:
        'You are in the workflow lane. Ask about orchestration fit, restricted live studio access, or how to turn the proof into an implementation plan.',
      prompts: ['Open workflow demo', 'What can the workflow prove?', 'I need automation help'],
      actions: [
        { label: 'Open workflow demo', to: WORKFLOW_COMPOSER_ROUTE },
        { label: 'Discuss workflow build', to: createDiscussUrl('workflow-composer', { intent: 'scope' }) },
      ],
    }
  }

  if (pathname.includes('/services/live-terminal-sandbox')) {
    return {
      welcome:
        'You are in the sandbox lane. Ask about runtime guardrails, the five-minute session flow, or how this pattern could become a real product surface.',
      prompts: ['Open live sandbox', 'Show sandbox architecture', 'I need a safe demo environment'],
      actions: [
        { label: 'Open live sandbox', to: LIVE_SANDBOX_ROUTE },
        { label: 'View architecture', to: ARCHITECTURE_STACK_ROUTE },
      ],
    }
  }

  if (pathname === '/services') {
    return {
      welcome:
        'You are in the services directory. Tell me the bottleneck and I will point you to the strongest service or proof surface.',
      prompts: ['Help me choose a service', 'Compare cloud stack', 'Scope a project'],
      actions: [
        { label: 'Browse all services', to: SERVICES_DIRECTORY_ROUTE },
        { label: 'Start scoped brief', to: createDiscussUrl('', { intent: 'scope' }) },
      ],
    }
  }

  if (pathname === '/discuss') {
    return {
      welcome:
        'You are already on the handoff page. I can help you decide whether to keep it proof-led or move into a scoped engagement.',
      prompts: ['Start from proof', 'Scope a real engagement', 'Help me choose the right topic'],
      actions: [
        { label: 'Proof-led note', to: createDiscussUrl('', { intent: 'explore' }) },
        { label: 'Scoped brief', to: createDiscussUrl('', { intent: 'scope' }) },
      ],
    }
  }

  return {
    welcome:
      'Tell me what you need help with — cloud fit, workflow automation, live demos, platform engineering, data pipelines, or telco tooling — and I will route you to the strongest proof or scoped next step.',
    prompts: ['Compare cloud stack', 'Open workflow demo', 'Open live sandbox', 'Help me choose a service'],
    actions: [
      { label: 'Browse services', to: SERVICES_DIRECTORY_ROUTE },
      { label: 'Scope a project', to: createDiscussUrl('', { intent: 'scope' }) },
    ],
  }
}

function getChatbotReply(message, pathname) {
  const lower = message.toLowerCase()

  if (
    includesAny(lower, ['review or deploy', 'review vs deploy', 'which handoff', 'book the review', 'architecture review']) &&
    includesAny(lower, ['cloud', 'provider', 'deploy', 'iac', 'stack', 'review'])
  ) {
    return {
      text:
        'Use the architecture review when the shortlist, regional posture, or risk controls still need pressure-testing. Use the one-time deploy pack when the provider choice already feels right and you want generated IaC plus a rollout handoff.',
      actions: [
        { label: 'Book architecture review', to: createDiscussUrl('cloud-fit-deployment', { intent: 'scope', offer: 'review' }) },
        { label: 'Request deploy pack', to: createDiscussUrl('cloud-fit-deployment', { intent: 'scope', offer: 'deploy-pack' }) },
        { label: 'Open the cloud fit demo', to: CLOUD_FIT_ROUTE },
      ],
    }
  }

  if (includesAny(lower, ['deploy pack', 'terraform', 'opentofu', 'iac', 'manifest', 'infrastructure as code'])) {
    return {
      text:
        'The deploy pack is the generated workload manifest, provider modules, main stack files, variables, outputs, and deployment notes. It is meant to turn the recommendation into something you can actually review or apply.',
      actions: [
        { label: 'Open the cloud fit demo', to: CLOUD_FIT_ROUTE },
        { label: 'Request deploy pack', to: createDiscussUrl('cloud-fit-deployment', { intent: 'scope', offer: 'deploy-pack' }) },
      ],
    }
  }

  if (includesAny(lower, ['cloud', 'aws', 'gcp', 'provider', 'hosting', 'infra', 'deploy', 'cost', 'stack'])) {
    return {
      text:
        'The strongest fit here is the cloud fit lane. It compares providers by recurring cost, ops load, resilience posture, and portability, then turns that into a services listing and IaC preview.',
      actions: [
        { label: 'Open cloud fit demo', to: CLOUD_FIT_ROUTE },
        { label: 'Book architecture review', to: createDiscussUrl('cloud-fit-deployment', { intent: 'scope', offer: 'review' }) },
        { label: 'Request deploy pack', to: createDiscussUrl('cloud-fit-deployment', { intent: 'scope', offer: 'deploy-pack' }) },
      ],
    }
  }

  if (includesAny(lower, ['workflow', 'automation', 'orchestration', 'approval', 'n8n', 'handoff'])) {
    return {
      text:
        'That maps to the workflow automation lane. Start with the proof when you want to pressure-test triggers, branches, approvals, and operator checkpoints before you commit to the build.',
      actions: [
        { label: 'Open workflow demo', to: WORKFLOW_COMPOSER_ROUTE },
        { label: 'Discuss workflow build', to: createDiscussUrl('workflow-composer', { intent: 'scope' }) },
      ],
    }
  }

  if (includesAny(lower, ['sandbox', 'terminal', 'shell', 'demo environment', 'ephemeral', 'browser terminal'])) {
    return {
      text:
        'That maps to the live sandbox lane. It is the strongest proof surface when runtime guardrails, access flow, and a real in-browser shell need to be judged together.',
      actions: [
        { label: 'Open live sandbox', to: LIVE_SANDBOX_ROUTE },
        { label: 'View architecture', to: ARCHITECTURE_STACK_ROUTE },
        { label: 'Discuss sandbox build', to: createDiscussUrl('live-terminal-sandbox', { intent: 'scope' }) },
      ],
    }
  }

  if (includesAny(lower, ['platform', 'developer platform', 'idp', 'ci/cd', 'kubernetes', 'release flow', 'devex'])) {
    return {
      text:
        'That sounds like platform engineering work: paved roads, service onboarding, deployment workflows, and cleaner operating guardrails for engineering teams.',
      actions: [
        { label: 'View platform service', to: createServiceRoute('platform-engineering') },
        { label: 'Scope platform work', to: createDiscussUrl('platform-engineering', { intent: 'scope' }) },
      ],
    }
  }

  if (includesAny(lower, ['data', 'pipeline', 'airflow', 'etl', 'freshness', 'analytics', 'ingestion'])) {
    return {
      text:
        'That maps to the data platform lane. Use it when the problem is pipeline reliability, orchestration drag, data freshness, or operational visibility across data movement.',
      actions: [
        { label: 'View data service', to: createServiceRoute('data-platforms') },
        { label: 'Scope data work', to: createDiscussUrl('data-platforms', { intent: 'scope' }) },
      ],
    }
  }

  if (includesAny(lower, ['telco', 'sim', 'ota', 'provisioning', 'device ops', 'telecom'])) {
    return {
      text:
        'That maps to the telco tooling lane: SIM lifecycle, OTA workflows, device operations, and the operator tooling around those systems.',
      actions: [
        { label: 'View telco service', to: createServiceRoute('telco-tooling') },
        { label: 'Scope telco tooling', to: createDiscussUrl('telco-tooling', { intent: 'scope' }) },
      ],
    }
  }

  if (includesAny(lower, ['book', 'hire', 'project', 'scope', 'quote', 'budget', 'timeline'])) {
    return {
      text:
        'If the problem is already real, go straight into the scoped brief. If you still need technical trust first, use the proof-led note and I will keep the next step lighter.',
      actions: [
        { label: 'Start scoped brief', to: createDiscussUrl('', { intent: 'scope' }) },
        { label: 'Start from proof', to: createDiscussUrl('', { intent: 'explore' }) },
      ],
    }
  }

  if (includesAny(lower, ['service', 'help', 'what do you do', 'offer', 'choose'])) {
    return {
      text:
        'The site is split into proof-led demos and scoped service paths. If you tell me the bottleneck, I can point you at the strongest demo or service lane quickly.',
      actions: [
        { label: 'Browse services', to: SERVICES_DIRECTORY_ROUTE },
        { label: 'Compare cloud stack', to: CLOUD_FIT_ROUTE },
        { label: 'Open workflow demo', to: WORKFLOW_COMPOSER_ROUTE },
      ],
    }
  }

  if (pathname.includes('/services/cloud-fit-deployment')) {
    return {
      text:
        'From this page, the fastest next step is usually either opening the cloud fit demo or choosing between the architecture review and the one-time deploy pack.',
      actions: [
        { label: 'Open cloud fit demo', to: CLOUD_FIT_ROUTE },
        { label: 'Book architecture review', to: createDiscussUrl('cloud-fit-deployment', { intent: 'scope', offer: 'review' }) },
      ],
    }
  }

  return {
    text:
      'I can route you to the strongest proof surface or the right scoped brief. Try asking about cloud fit, workflow automation, sandbox demos, platform engineering, data pipelines, or telco tooling.',
    actions: [
      { label: 'Browse services', to: SERVICES_DIRECTORY_ROUTE },
      { label: 'Open workflow demo', to: WORKFLOW_COMPOSER_ROUTE },
      { label: 'Scope a project', to: createDiscussUrl('', { intent: 'scope' }) },
    ],
  }
}

function SiteChatbot() {
  const location = useLocation()
  const routeContext = useMemo(() => buildRouteContext(location.pathname), [location.pathname])
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [hasInteracted, setHasInteracted] = useState(false)
  const messageIdRef = useRef(0)
  const messageViewportRef = useRef(null)

  const createMessage = (role, text, actions = []) => ({
    id: `chat-${messageIdRef.current++}`,
    role,
    text,
    actions,
  })

  const [messages, setMessages] = useState(() => [
    createMessage('assistant', routeContext.welcome, routeContext.actions),
  ])

  useEffect(() => {
    if (!hasInteracted) {
      setMessages([createMessage('assistant', routeContext.welcome, routeContext.actions)])
    }
  }, [routeContext, hasInteracted])

  useEffect(() => {
    if (messageViewportRef.current) {
      messageViewportRef.current.scrollTop = messageViewportRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const sendMessage = (rawMessage) => {
    const trimmed = rawMessage.trim()
    if (!trimmed) {
      return
    }

    const reply = getChatbotReply(trimmed, location.pathname)
    setHasInteracted(true)
    setMessages((current) => [
      ...current,
      createMessage('user', trimmed),
      createMessage('assistant', reply.text, reply.actions),
    ])
    setDraft('')
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] w-[calc(100vw-2rem)] max-w-[25rem] sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#050816]/92 shadow-[0_30px_80px_rgba(2,6,23,0.58)] backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Site concierge</p>
              <p className="mt-1 text-sm text-gray-300">Routes visitors into proof or scope.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-300 transition hover:border-primary-500/20 hover:text-white"
              aria-label="Close chatbot"
            >
              <FaTimes />
            </button>
          </div>

          <div ref={messageViewportRef} className="max-h-[26rem] space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-[1.25rem] px-4 py-3 text-sm leading-7 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'border border-white/10 bg-white/[0.04] text-gray-300'
                  }`}
                >
                  <p>{message.text}</p>
                  {message.actions?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.actions.map((action) => (
                        <Link
                          key={`${message.id}-${action.label}`}
                          to={action.to}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white transition hover:border-primary-500/30 hover:bg-white/[0.08]"
                        >
                          {action.label}
                          <FaArrowRight className="text-[10px]" />
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 px-5 py-4">
            <div className="mb-4 flex flex-wrap gap-2">
              {routeContext.prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-gray-200 transition hover:border-primary-500/20 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                sendMessage(draft)
              }}
              className="flex items-end gap-3"
            >
              <input
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="form-input min-w-0 flex-1 !rounded-full !py-3"
                placeholder="Ask about cloud fit, demos, or service scope..."
              />
              <button
                type="submit"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700"
                aria-label="Send message"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </form>

            <p className="mt-3 text-xs leading-6 text-gray-500">
              This concierge routes you through the site locally. Nothing is sent until you open the proof or brief path.
            </p>
          </div>
        </div>
      ) : null}

      {!isOpen ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-3 rounded-full border border-primary-500/20 bg-[#071022]/90 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(2,6,23,0.45)] backdrop-blur-xl transition hover:border-primary-500/35 hover:bg-[#091329]"
            aria-expanded={isOpen}
            aria-label="Open chatbot"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-600/90">
              <FaComments />
            </span>
            <span className="text-left">
              <span className="block">Ask the site</span>
              <span className="block text-xs font-medium text-gray-400">Proof, service fit, or next step</span>
            </span>
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default SiteChatbot
