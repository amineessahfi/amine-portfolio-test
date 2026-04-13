export const responsePromise =
  'I reply within 2 business days with either a fit verdict, a few clarifying questions, or a proposed first step.'

export const timelineOptions = [
  'As soon as possible',
  'Within 2-4 weeks',
  'Within 1-3 months',
  '3+ months out',
  'Still exploring',
]

export const budgetRangeOptions = [
  'Under $10k',
  '$10k-$25k',
  '$25k-$50k',
  '$50k-$100k',
  '$100k+',
  'Need guidance',
]

export const discussIntentPresets = {
  scope: {
    optionLabel: 'Scope a real engagement',
    eyebrow: 'Scoped engagement',
    formEyebrow: 'Guided funnel',
    formTitle: 'Walk the project context step by step.',
    formIntro: 'This guided funnel captures the commercial and operating context needed for a scoped reply without dropping you into one long form.',
    submitLabel: 'Send scoped request',
    summaryText:
      'Use this when the problem is real enough that you want a fit verdict, a first delivery plan, and the right next step.',
    responseSteps: [
      'I review the problem, the constraints, and whether the work is a strong fit.',
      'You get a recommendation on the best starting shape: diagnostic sprint, redesign blueprint, or implementation track.',
      'If the fit is real, we move straight into a concrete next step instead of a vague discovery loop.',
    ],
    requiredFields: ['name', 'workEmail', 'company', 'role', 'timeline', 'budgetRange', 'problem', 'currentEnvironment', 'desiredOutcome'],
  },
  explore: {
    optionLabel: 'Start from proof',
    eyebrow: 'Explore from proof',
    formEyebrow: 'Guided funnel',
    formTitle: 'Walk the proof question step by step.',
    formIntro: 'Keep it light. Share the system, the part you want to inspect, and what would make the proof useful, one step at a time.',
    submitLabel: 'Send exploration request',
    summaryText:
      'Use this when you want a lighter technical reply focused on proof, fit, and whether the problem deserves formal scoping.',
    responseSteps: [
      'I reply with the strongest proof path, a fit read, or a few clarifying questions.',
      'You get a recommendation on whether to inspect a live proof surface, review a system map, or move into a scoped conversation.',
      'If the problem is real enough, we can turn the exploration into a formal diagnostic brief.',
    ],
    requiredFields: ['name', 'workEmail', 'problem'],
  },
}

export const discussOfferPresets = {
  general: {
    optionLabel: 'Scoped engagement',
    formTitle: 'Walk the project context step by step.',
    formIntro: 'This guided funnel captures the commercial and operating context needed for a scoped reply without dropping you into one long form.',
    submitLabel: 'Send scoped request',
    summaryText:
      'Use this when the problem is real enough that you want a fit verdict, a first delivery plan, and the right next step.',
    emailIntro: '',
  },
  review: {
    optionLabel: 'Architecture review',
    formTitle: 'Walk the review context step by step.',
    formIntro:
      'Use this when you want the stack recommendation pressure-tested before you commit to generation or rollout, but still want the intake to stay guided.',
    submitLabel: 'Request architecture review',
    summaryText:
      'Best when the provider choice, regional posture, or risk controls still need expert validation before the stack lands.',
    emailIntro: 'I would like to discuss the cloud fit recommendation and an architecture review.',
  },
  'deploy-pack': {
    optionLabel: 'One-time deploy pack',
    formTitle: 'Walk the deployment context step by step.',
    formIntro:
      'Use this when you already want the generated IaC pack and a single deployment motion into your cloud account, and want the intake to stay guided.',
    submitLabel: 'Request deploy pack',
    summaryText:
      'Best when you want the chosen provider, services listing, and IaC turned into a one-time delivery package.',
    emailIntro: 'I would like to discuss the cloud fit recommendation and a one-time deploy pack.',
  },
}

const generalBriefFields = [
  'Problem / pressure point:',
  'Current stack or environment:',
  'What good looks like in the first phase:',
  'Anything time-sensitive:',
]

const platformBriefFields = [
  'Main platform bottleneck or delivery friction:',
  'Current platform stack and team shape:',
  'Where onboarding, release flow, or runtime consistency is breaking down:',
  'What a better first phase should improve:',
  'Anything time-sensitive:',
]

const cloudFitBriefFields = [
  'What the workload needs to run (app, API, worker, internal tool, pipeline, etc.):',
  'Services that must exist (database, queue, cache, object storage, observability, etc.):',
  'Traffic, uptime, or regional expectations that change the stack choice:',
  'Whether you want a review or a one-time deployment pack:',
  'Anything time-sensitive:',
]

const dataPlatformBriefFields = [
  'Main data reliability or orchestration problem:',
  'Current pipeline stack and data volume:',
  'Where failures, lag, or visibility gaps show up:',
  'What the first phase should improve:',
  'Anything time-sensitive:',
]

const telcoToolingBriefFields = [
  'Main telecom workflow or operations bottleneck:',
  'Systems involved (SIM, OTA, provisioning, device operations, etc.):',
  'Where manual work or operational risk is highest:',
  'What the first phase should improve:',
  'Anything time-sensitive:',
]

const sandboxBriefFields = [
  'What visitors should be able to try:',
  'What must stay protected or off-limits:',
  'Where the experience should live:',
  'What the sandbox needs to prove or convert into:',
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

export const discussTopicPresets = {
  general: {
    optionLabel: 'General project fit',
    eyebrow: 'Project fit',
    title: 'Send the version of the problem that actually matters.',
    intro:
      'You do not need a polished brief. A short note with the bottleneck, the current environment, and the outcome you need is enough to make the next step useful.',
    emailSubject: 'Project conversation',
    emailIntro: 'I would like to discuss a delivery problem.',
    emailPrompts: generalBriefFields,
    responseSteps: generalNextSteps,
  },
  'platform-engineering': {
    optionLabel: 'Platform engineering',
    eyebrow: 'Platform fit',
    title: 'Turn platform friction into a cleaner delivery system.',
    intro:
      'If the problem is release drag, inconsistent service foundations, or a weak internal developer experience, send the current constraints and what a better operating model needs to improve first.',
    emailSubject: 'Platform engineering discussion',
    emailIntro: 'I would like to discuss platform engineering or internal developer platform work.',
    emailPrompts: platformBriefFields,
    responseSteps: [
      'We identify where platform friction is slowing teams down or creating operational inconsistency.',
      'I recommend the highest-leverage starting shape: assessment, paved-road design, or hands-on implementation sprint.',
      'You get a practical first phase tied to delivery speed, release safety, and team adoption.',
    ],
  },
  'cloud-fit-deployment': {
    optionLabel: 'Cloud fit and deployment',
    eyebrow: 'Cloud fit',
    title: 'Turn the recommendation into a deployable environment.',
    intro:
      'If the shortlist feels directionally right, send the workload shape, the services you need, and whether the next step should be the review or the one-time deploy pack.',
    emailSubject: 'Cloud fit and deployment discussion',
    emailIntro: 'I would like to discuss a cloud fit recommendation and deployment path.',
    emailPrompts: cloudFitBriefFields,
    responseSteps: [
      'We pressure-test the shortlist, the services listing, and the strongest production landing shape.',
      'I recommend whether the right next step is an architecture review or a one-time deployment pack.',
      'You get a concrete path from provider choice into generated infrastructure and rollout.',
    ],
  },
  'data-platforms': {
    optionLabel: 'Data platforms and pipelines',
    eyebrow: 'Data platform fit',
    title: 'Turn fragmented data work into reliable operating pipelines.',
    intro:
      'If the problem is brittle orchestration, slow recovery, or too many one-off data jobs, send the stack, the data movement pattern, and what reliability needs to improve first.',
    emailSubject: 'Data platform discussion',
    emailIntro: 'I would like to discuss data platform or pipeline engineering work.',
    emailPrompts: dataPlatformBriefFields,
    responseSteps: [
      'We identify where orchestration, visibility, or runtime reliability is breaking down.',
      'I recommend the right starting shape: architecture pass, pipeline stabilization sprint, or staged platform buildout.',
      'You get a first phase that improves reliability, operating clarity, and handoff quality.',
    ],
  },
  'telco-tooling': {
    optionLabel: 'Telco tooling',
    eyebrow: 'Telco tooling fit',
    title: 'Turn telecom operations into tooling that can scale cleanly.',
    intro:
      'If the problem sits around SIM lifecycle, OTA workflows, device operations, or operator tooling, send the stack, the manual bottlenecks, and where reliability matters most.',
    emailSubject: 'Telco tooling discussion',
    emailIntro: 'I would like to discuss telecom tooling or operator workflow work.',
    emailPrompts: telcoToolingBriefFields,
    responseSteps: [
      'We identify where telecom workflows are too manual, fragile, or hard to scale.',
      'I recommend the best first phase for process cleanup, tooling redesign, or implementation support.',
      'You get a concrete operating path that improves reliability and reduces manual overhead.',
    ],
  },
  'live-terminal-sandbox': {
    optionLabel: 'Live sandbox',
    eyebrow: 'Sandbox fit',
    title: 'Turn the live sandbox pattern into a real product surface.',
    intro:
      'If the live shell is the proof point you want, send the visitor action, the guardrails that must hold, and what the experience needs to convert into.',
    emailSubject: 'Sandbox-led platform discussion',
    emailIntro: 'I would like to discuss a live sandbox or ephemeral demo environment.',
    emailPrompts: sandboxBriefFields,
    responseSteps: [
      'We clarify the allowed user actions, risk boundaries, and runtime controls.',
      'I recommend the right launch flow and implementation shape for the sandbox experience.',
      'You get a concrete next step for prototype, hardening, or production rollout.',
    ],
  },
  'workflow-composer': {
    optionLabel: 'Workflow automation',
    eyebrow: 'Workflow fit',
    title: 'Turn the workflow pattern into an implementation plan.',
    intro:
      'If the workflow demo looks close to the operating problem, send the trigger, the systems involved, and where human approvals or fallback steps must stay in the loop.',
    emailSubject: 'Workflow automation discussion',
    emailIntro: 'I would like to discuss a workflow automation or orchestration build.',
    emailPrompts: workflowBriefFields,
    responseSteps: [
      'We map the operating sequence, risk points, and where human intervention still matters.',
      'I recommend the right starting shape: workflow design, prototype, or constrained production build.',
      'You get a clear delivery path for orchestration, guardrails, and rollout.',
    ],
  },
}

export const discussTopicOptions = [
  { value: 'general', label: discussTopicPresets.general.optionLabel },
  { value: 'platform-engineering', label: discussTopicPresets['platform-engineering'].optionLabel },
  { value: 'cloud-fit-deployment', label: discussTopicPresets['cloud-fit-deployment'].optionLabel },
  { value: 'data-platforms', label: discussTopicPresets['data-platforms'].optionLabel },
  { value: 'telco-tooling', label: discussTopicPresets['telco-tooling'].optionLabel },
  { value: 'live-terminal-sandbox', label: discussTopicPresets['live-terminal-sandbox'].optionLabel },
  { value: 'workflow-composer', label: discussTopicPresets['workflow-composer'].optionLabel },
]

const topicAliases = {
  'aws-cost-optimization': 'cloud-fit-deployment',
  'cloud-cost-optimization': 'cloud-fit-deployment',
}

export function normalizeDiscussIntent(intent = 'scope') {
  return discussIntentPresets[intent] ? intent : 'scope'
}

export function normalizeDiscussTopic(topic = 'general') {
  const normalizedTopic = topicAliases[topic] || topic
  return discussTopicPresets[normalizedTopic] ? normalizedTopic : 'general'
}

export function normalizeDiscussOffer(offer = 'general') {
  return discussOfferPresets[offer] ? offer : 'general'
}

export function getDiscussTopicPreset(topic = 'general') {
  return discussTopicPresets[normalizeDiscussTopic(topic)]
}
