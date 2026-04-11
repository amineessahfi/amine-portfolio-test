const workloadPresets = {
  'web-app': {
    label: 'Web app + API',
    description: 'Customer-facing app with auth, API traffic, Postgres, and object storage.',
    defaults: {
      postgres: true,
      redis: true,
      queue: false,
      objectStorage: true,
    },
    weights: {
      compute: 1,
      data: 0.9,
      queue: 0.4,
      storage: 0.9,
    },
  },
  'api-worker': {
    label: 'API + worker',
    description: 'Public or partner API with background jobs, queueing, cache, and persistence.',
    defaults: {
      postgres: true,
      redis: true,
      queue: true,
      objectStorage: true,
    },
    weights: {
      compute: 1.2,
      data: 1,
      queue: 1.15,
      storage: 0.8,
    },
  },
  'internal-tool': {
    label: 'Internal tool',
    description: 'Smaller internal product with admin workflows, auth, and lighter runtime pressure.',
    defaults: {
      postgres: true,
      redis: false,
      queue: false,
      objectStorage: false,
    },
    weights: {
      compute: 0.75,
      data: 0.7,
      queue: 0.35,
      storage: 0.3,
    },
  },
  'data-pipeline': {
    label: 'Data pipeline',
    description: 'Ingestion, transformation, and scheduled or event-driven delivery workloads.',
    defaults: {
      postgres: true,
      redis: false,
      queue: true,
      objectStorage: true,
    },
    weights: {
      compute: 1.25,
      data: 1.2,
      queue: 1,
      storage: 1.35,
    },
  },
}

const requestTierPresets = {
  starter: {
    label: 'Starter',
    detail: 'Prototype, pilot, or early launch volume.',
    units: 0.6,
  },
  growth: {
    label: 'Growth',
    detail: 'Steady production use with moderate traffic.',
    units: 1,
  },
  scale: {
    label: 'Scale',
    detail: 'High-usage product with clear production pressure.',
    units: 1.7,
  },
  heavy: {
    label: 'Heavy',
    detail: 'Large footprint, heavy runtime, or high event volume.',
    units: 2.55,
  },
}

const teamShapePresets = {
  lean: {
    label: 'Lean team',
    detail: 'Small team that wants managed defaults and less ops ownership.',
    opsWeight: 1.2,
  },
  balanced: {
    label: 'Balanced team',
    detail: 'Some appetite for ops work when the commercial upside is clear.',
    opsWeight: 1,
  },
  platform: {
    label: 'Platform team',
    detail: 'Comfortable owning more of the runtime for cost or control reasons.',
    opsWeight: 0.82,
  },
}

const uptimeTierPresets = {
  pilot: {
    label: 'Pilot / non-critical',
    detail: 'Some interruption is acceptable while the product proves itself.',
    resilienceWeight: 0.72,
    costMultiplier: 0.88,
  },
  production: {
    label: 'Production',
    detail: 'The service must stay stable with clear backups and recovery.',
    resilienceWeight: 1,
    costMultiplier: 1,
  },
  critical: {
    label: 'Business-critical',
    detail: 'Higher continuity expectations and stricter recovery posture.',
    resilienceWeight: 1.32,
    costMultiplier: 1.18,
  },
}

const regionPresets = {
  single: {
    label: '1 region',
    detail: 'Single-region starting point with room to harden later.',
    multiplier: 1,
    resilienceWeight: 0.75,
  },
  dual: {
    label: '2 regions',
    detail: 'Primary + failover or active/passive regional posture.',
    multiplier: 1.32,
    resilienceWeight: 1.08,
  },
  multi: {
    label: '3+ regions',
    detail: 'Multiple regional edges and stronger continuity expectations.',
    multiplier: 1.58,
    resilienceWeight: 1.28,
  },
}

const trafficPatternPresets = {
  steady: {
    label: 'Steady traffic',
    detail: 'Predictable load that rewards simpler reserved capacity.',
    burstWeight: 0.9,
  },
  bursty: {
    label: 'Bursty traffic',
    detail: 'Spiky demand where managed autoscaling matters more.',
    burstWeight: 1.18,
  },
}

const priorityPresets = {
  'lowest-cost': {
    label: 'Lowest recurring cost',
    costWeight: 1.48,
    opsWeight: 0.78,
    resilienceWeight: 0.72,
    portabilityWeight: 0.72,
  },
  balanced: {
    label: 'Balanced fit',
    costWeight: 1,
    opsWeight: 1,
    resilienceWeight: 1,
    portabilityWeight: 1,
  },
  'lowest-ops': {
    label: 'Lowest ops load',
    costWeight: 0.8,
    opsWeight: 1.42,
    resilienceWeight: 1,
    portabilityWeight: 0.72,
  },
  portability: {
    label: 'Portability first',
    costWeight: 0.78,
    opsWeight: 0.84,
    resilienceWeight: 0.92,
    portabilityWeight: 1.45,
  },
}

const stackCatalog = [
  {
    id: 'hetzner-kamal',
    provider: 'Hetzner Cloud',
    stackTitle: 'Lean VM deployment',
    summary: 'Cheapest recurring bill when you are willing to own more runtime and patching detail.',
    modelLabel: 'VMs + load balancer + OpenTofu modules',
    moduleSource: './stacks/hetzner-kamal',
    pricing: {
      compute: 32,
      database: 16,
      cache: 10,
      queue: 8,
      objectStorage: 6,
      networking: 12,
      observability: 9,
      security: 8,
    },
    scores: {
      ops: 2.3,
      resilience: 2.7,
      portability: 4.8,
      burst: 2.1,
    },
    workloadAffinity: {
      'web-app': 4.1,
      'api-worker': 3.4,
      'internal-tool': 4.9,
      'data-pipeline': 3.2,
    },
    queueFit: 2.6,
    serviceText: {
      compute: ({ appReplicas, workerReplicas }) =>
        `${appReplicas} app VM${appReplicas > 1 ? 's' : ''}${workerReplicas ? ` + ${workerReplicas} worker VM${workerReplicas > 1 ? 's' : ''}` : ''}`,
      database: ({ dataSize }) => `PostgreSQL on customer-owned VM (${dataSize})`,
      cache: () => 'Redis on customer-owned VM',
      queue: () => 'Queue worker backed by Redis or Postgres',
      objectStorage: () => 'S3-compatible object storage bucket',
      networking: ({ regionLabel }) => `Public load balancer and TLS in ${regionLabel.toLowerCase()}`,
      observability: () => 'Prometheus-compatible metrics + log drain',
      security: () => 'Firewall defaults, backups, SSH hardening, and secrets layout',
    },
  },
  {
    id: 'digitalocean-app-platform',
    provider: 'DigitalOcean',
    stackTitle: 'Managed app stack',
    summary: 'Good middle ground when you want managed primitives without a hyperscaler bill.',
    modelLabel: 'App Platform + managed data services',
    moduleSource: './stacks/digitalocean-app-platform',
    pricing: {
      compute: 44,
      database: 30,
      cache: 14,
      queue: 9,
      objectStorage: 7,
      networking: 14,
      observability: 11,
      security: 9,
    },
    scores: {
      ops: 3.9,
      resilience: 3.6,
      portability: 4.1,
      burst: 3.2,
    },
    workloadAffinity: {
      'web-app': 4.7,
      'api-worker': 4,
      'internal-tool': 4.4,
      'data-pipeline': 3.5,
    },
    queueFit: 3.2,
    serviceText: {
      compute: ({ appReplicas, workerReplicas }) =>
        `${appReplicas} managed app service${appReplicas > 1 ? ' replicas' : ''}${workerReplicas ? ` + ${workerReplicas} worker process${workerReplicas > 1 ? 'es' : ''}` : ''}`,
      database: ({ dataSize }) => `Managed PostgreSQL (${dataSize})`,
      cache: () => 'Managed Redis cache',
      queue: () => 'Managed queue worker pattern',
      objectStorage: () => 'Spaces object storage + CDN origin',
      networking: ({ regionLabel }) => `Managed load balancing and TLS in ${regionLabel.toLowerCase()}`,
      observability: () => 'Managed metrics, logs, and alert hooks',
      security: () => 'Secrets manager wiring, backups, and baseline ingress rules',
    },
  },
  {
    id: 'aws-ecs',
    provider: 'AWS',
    stackTitle: 'Managed production stack',
    summary: 'Best fit when production controls, failover posture, and service depth matter more than the raw bill.',
    modelLabel: 'ECS/Fargate + managed AWS data services',
    moduleSource: './stacks/aws-ecs',
    pricing: {
      compute: 58,
      database: 54,
      cache: 25,
      queue: 14,
      objectStorage: 11,
      networking: 22,
      observability: 18,
      security: 14,
    },
    scores: {
      ops: 4.6,
      resilience: 4.9,
      portability: 3.8,
      burst: 4.2,
    },
    workloadAffinity: {
      'web-app': 4.4,
      'api-worker': 4.8,
      'internal-tool': 3.6,
      'data-pipeline': 4.1,
    },
    queueFit: 4.8,
    serviceText: {
      compute: ({ appReplicas, workerReplicas }) =>
        `${appReplicas} ECS/Fargate service task${appReplicas > 1 ? 's' : ''}${workerReplicas ? ` + ${workerReplicas} worker task${workerReplicas > 1 ? 's' : ''}` : ''}`,
      database: ({ dataSize }) => `RDS PostgreSQL (${dataSize})`,
      cache: () => 'ElastiCache Redis',
      queue: () => 'SQS-backed worker queue',
      objectStorage: () => 'S3 object storage',
      networking: ({ regionLabel }) => `ALB, VPC wiring, and CDN edges for ${regionLabel.toLowerCase()}`,
      observability: () => 'CloudWatch logs, metrics, alarms, and budget guardrails',
      security: () => 'IAM boundaries, secrets, backups, and disaster-recovery basics',
    },
  },
  {
    id: 'gcp-cloud-run',
    provider: 'Google Cloud',
    stackTitle: 'Autoscaling managed stack',
    summary: 'Great fit for bursty traffic, smaller ops teams, and cleaner autoscaling without Kubernetes overhead.',
    modelLabel: 'Cloud Run + Cloud SQL + managed Google services',
    moduleSource: './stacks/gcp-cloud-run',
    pricing: {
      compute: 52,
      database: 50,
      cache: 23,
      queue: 12,
      objectStorage: 10,
      networking: 18,
      observability: 16,
      security: 12,
    },
    scores: {
      ops: 4.5,
      resilience: 4.7,
      portability: 4,
      burst: 4.9,
    },
    workloadAffinity: {
      'web-app': 4.5,
      'api-worker': 4.3,
      'internal-tool': 4.2,
      'data-pipeline': 4.4,
    },
    queueFit: 4.1,
    serviceText: {
      compute: ({ appReplicas, workerReplicas }) =>
        `${appReplicas} Cloud Run service minimum instance${appReplicas > 1 ? 's' : ''}${workerReplicas ? ` + ${workerReplicas} worker service${workerReplicas > 1 ? 's' : ''}` : ''}`,
      database: ({ dataSize }) => `Cloud SQL for PostgreSQL (${dataSize})`,
      cache: () => 'Memorystore Redis',
      queue: () => 'Cloud Tasks / Pub/Sub worker queue',
      objectStorage: () => 'Cloud Storage bucket',
      networking: ({ regionLabel }) => `Serverless ingress, TLS, and regional load balancing for ${regionLabel.toLowerCase()}`,
      observability: () => 'Cloud Logging, Monitoring, alerts, and budget controls',
      security: () => 'Secret Manager, IAM, backups, and baseline policy controls',
    },
  },
]

function currency(value) {
  return Math.round(value)
}

function labelForScore(score) {
  if (score >= 4.45) {
    return 'Low ongoing ops'
  }

  if (score >= 3.45) {
    return 'Moderate ops'
  }

  return 'Hands-on ops'
}

function resilienceLabel(score) {
  if (score >= 4.45) {
    return 'Production-heavy'
  }

  if (score >= 3.45) {
    return 'Solid production fit'
  }

  return 'Needs more ownership'
}

function portabilityLabel(score) {
  if (score >= 4.45) {
    return 'High portability'
  }

  if (score >= 3.85) {
    return 'Good portability'
  }

  return 'Provider-shaped'
}

function storageLabel(requestUnits) {
  if (requestUnits >= 2.3) {
    return '80-120 GB class'
  }

  if (requestUnits >= 1.4) {
    return '40-80 GB class'
  }

  return '20-40 GB class'
}

function regionText(regionId) {
  return regionPresets[regionId]?.label || regionPresets.single.label
}

function scenarioDefaults(workloadType) {
  return workloadPresets[workloadType]?.defaults || workloadPresets['api-worker'].defaults
}

function normalizeScenario(inputScenario = {}) {
  const workloadType = workloadPresets[inputScenario.workloadType] ? inputScenario.workloadType : 'api-worker'
  const defaults = scenarioDefaults(workloadType)

  return {
    workloadType,
    requestTier: requestTierPresets[inputScenario.requestTier] ? inputScenario.requestTier : 'growth',
    teamShape: teamShapePresets[inputScenario.teamShape] ? inputScenario.teamShape : 'lean',
    uptimeTier: uptimeTierPresets[inputScenario.uptimeTier] ? inputScenario.uptimeTier : 'production',
    regionCount: regionPresets[inputScenario.regionCount] ? inputScenario.regionCount : 'single',
    trafficPattern: trafficPatternPresets[inputScenario.trafficPattern] ? inputScenario.trafficPattern : 'steady',
    priority: priorityPresets[inputScenario.priority] ? inputScenario.priority : 'balanced',
    services: {
      postgres: inputScenario.services?.postgres ?? defaults.postgres,
      redis: inputScenario.services?.redis ?? defaults.redis,
      queue: inputScenario.services?.queue ?? defaults.queue,
      objectStorage: inputScenario.services?.objectStorage ?? defaults.objectStorage,
    },
  }
}

function getReplicaPlan(scenario) {
  const requestUnits = requestTierPresets[scenario.requestTier].units
  const uptimeTier = uptimeTierPresets[scenario.uptimeTier]
  const regionTier = regionPresets[scenario.regionCount]
  const workload = workloadPresets[scenario.workloadType]

  const replicaSeed = requestUnits * workload.weights.compute * uptimeTier.costMultiplier * regionTier.multiplier
  const appReplicas = Math.max(1, Math.round(replicaSeed))
  const workerReplicas = scenario.services.queue ? Math.max(1, Math.round((requestUnits * workload.weights.queue) / 1.05)) : 0

  return {
    appReplicas,
    workerReplicas,
    dataSize: storageLabel(requestUnits * workload.weights.data),
  }
}

function buildCostBreakdown(stack, scenario) {
  const requestTier = requestTierPresets[scenario.requestTier]
  const uptimeTier = uptimeTierPresets[scenario.uptimeTier]
  const regionTier = regionPresets[scenario.regionCount]
  const trafficPattern = trafficPatternPresets[scenario.trafficPattern]
  const workload = workloadPresets[scenario.workloadType]

  const demandMultiplier = requestTier.units * uptimeTier.costMultiplier * regionTier.multiplier
  const burstModifier = trafficPattern.burstWeight

  const compute = currency(stack.pricing.compute * demandMultiplier * workload.weights.compute * burstModifier)
  const database = scenario.services.postgres
    ? currency(stack.pricing.database * demandMultiplier * workload.weights.data)
    : 0
  const cache = scenario.services.redis
    ? currency(stack.pricing.cache * demandMultiplier * workload.weights.data * 0.72)
    : 0
  const queue = scenario.services.queue
    ? currency(stack.pricing.queue * demandMultiplier * workload.weights.queue * 0.82)
    : 0
  const objectStorage = scenario.services.objectStorage
    ? currency(stack.pricing.objectStorage * demandMultiplier * workload.weights.storage)
    : 0
  const networking = currency(stack.pricing.networking * demandMultiplier * (scenario.regionCount === 'single' ? 1 : 1.12))
  const observability = currency(stack.pricing.observability * uptimeTier.costMultiplier)
  const security = currency(stack.pricing.security * Math.max(regionTier.multiplier, 1))

  return {
    compute,
    database,
    cache,
    queue,
    objectStorage,
    networking,
    observability,
    security,
    total: currency(compute + database + cache + queue + objectStorage + networking + observability + security),
  }
}

function costScore(monthlyEstimate, lowestEstimate, highestEstimate) {
  if (highestEstimate === lowestEstimate) {
    return 4
  }

  const spread = highestEstimate - lowestEstimate
  const normalized = 1 - (monthlyEstimate - lowestEstimate) / spread
  return 2.2 + normalized * 2.8
}

function buildReasons(recommendation, scenario, rankingContext) {
  const reasons = []

  if (recommendation.id === rankingContext.lowestCostId) {
    reasons.push('Lowest estimated monthly run cost in the shortlist.')
  }

  if (recommendation.id === rankingContext.lowestOpsId) {
    reasons.push('Lightest ongoing ops load for a lean delivery team.')
  }

  if (recommendation.id === rankingContext.highestPortabilityId && scenario.priority === 'portability') {
    reasons.push('Strongest portability score when keeping exit options matters.')
  }

  if (
    recommendation.id === rankingContext.highestResilienceId &&
    (scenario.uptimeTier === 'critical' || scenario.regionCount !== 'single')
  ) {
    reasons.push('Best fit when continuity, failover posture, or regional spread matter more.')
  }

  if (scenario.trafficPattern === 'bursty' && recommendation.id === 'gcp-cloud-run') {
    reasons.push('Bursty traffic pushes the shortlist toward autoscaling serverless primitives.')
  }

  if (scenario.workloadType === 'internal-tool' && recommendation.id === 'hetzner-kamal') {
    reasons.push('Internal tools often reward the lower-cost VM path when the runtime can stay simple.')
  }

  if (scenario.workloadType === 'api-worker' && recommendation.id === 'aws-ecs') {
    reasons.push('Queue-heavy API workloads map cleanly to managed worker and messaging primitives here.')
  }

  if (scenario.workloadType === 'web-app' && recommendation.id === 'digitalocean-app-platform') {
    reasons.push('This is a strong middle path for app-shaped workloads without hyperscaler overhead.')
  }

  if (scenario.workloadType === 'data-pipeline' && recommendation.id === 'gcp-cloud-run') {
    reasons.push('The pipeline profile benefits from managed workers and easier spiky scaling.')
  }

  if (scenario.teamShape === 'platform' && recommendation.id === 'hetzner-kamal') {
    reasons.push('A platform-capable team can usually absorb the extra ops work and keep the bill lean.')
  }

  if (!reasons.length) {
    reasons.push('Best balance of commercial fit, runtime shape, and operational burden for this scenario.')
  }

  return reasons.slice(0, 3)
}

function buildServiceRows(stack, scenario, costBreakdown) {
  const replicaPlan = getReplicaPlan(scenario)
  const regionLabel = regionText(scenario.regionCount)

  const rows = [
    {
      category: 'Compute',
      selection: stack.serviceText.compute(replicaPlan),
      monthly: costBreakdown.compute,
      portability: stack.scores.portability >= 4 ? 'High' : 'Medium',
      control: stack.id === 'hetzner-kamal' ? 'Customer-owned VM runtime' : 'Managed runtime in customer account',
      reason: workloadPresets[scenario.workloadType].description,
    },
  ]

  if (scenario.services.postgres) {
    rows.push({
      category: 'Database',
      selection: stack.serviceText.database(replicaPlan),
      monthly: costBreakdown.database,
      portability: stack.id === 'hetzner-kamal' ? 'High' : 'Medium',
      control: stack.id === 'hetzner-kamal' ? 'Self-managed by our module set' : 'Managed database service',
      reason: 'Persistent state and backups stay explicit in the generated services listing.',
    })
  }

  if (scenario.services.redis) {
    rows.push({
      category: 'Cache',
      selection: stack.serviceText.cache(replicaPlan),
      monthly: costBreakdown.cache,
      portability: 'Medium',
      control: stack.id === 'hetzner-kamal' ? 'Customer-owned service' : 'Managed cache',
      reason: 'Used to reduce latency and absorb hot-path reads or session pressure.',
    })
  }

  if (scenario.services.queue) {
    rows.push({
      category: 'Queue',
      selection: stack.serviceText.queue(replicaPlan),
      monthly: costBreakdown.queue,
      portability: stack.id === 'aws-ecs' || stack.id === 'gcp-cloud-run' ? 'Medium' : 'High',
      control: stack.id === 'hetzner-kamal' ? 'Self-hosted worker queue' : 'Managed queue primitive',
      reason: 'Separates background work from customer-facing latency and enables retries.',
    })
  }

  if (scenario.services.objectStorage) {
    rows.push({
      category: 'Object storage',
      selection: stack.serviceText.objectStorage(replicaPlan),
      monthly: costBreakdown.objectStorage,
      portability: 'High',
      control: 'Customer-owned bucket namespace',
      reason: 'Used for uploads, exports, snapshots, and deployment artifacts.',
    })
  }

  rows.push(
    {
      category: 'Networking',
      selection: stack.serviceText.networking({ regionLabel }),
      monthly: costBreakdown.networking,
      portability: 'Medium',
      control: 'Customer-owned ingress and DNS boundaries',
      reason: 'Turns the services list into a real edge and routing plan, not only compute choices.',
    },
    {
      category: 'Observability',
      selection: stack.serviceText.observability(replicaPlan),
      monthly: costBreakdown.observability,
      portability: 'Medium',
      control: 'Managed through our module defaults',
      reason: 'Makes health, spend drift, and change impact visible after the first rollout.',
    },
    {
      category: 'Security and recovery',
      selection: stack.serviceText.security(replicaPlan),
      monthly: costBreakdown.security,
      portability: 'High',
      control: 'Policy pack and backup defaults',
      reason: 'Keeps TLS, secrets, backups, and recovery posture explicit in the pack.',
    },
  )

  return rows
}

function buildManifest(stack, scenario, costBreakdown, serviceRows, fitScore, recommendedOffer) {
  const workload = workloadPresets[scenario.workloadType]
  const requestTier = requestTierPresets[scenario.requestTier]
  const teamShape = teamShapePresets[scenario.teamShape]
  const uptimeTier = uptimeTierPresets[scenario.uptimeTier]
  const region = regionPresets[scenario.regionCount]
  const priority = priorityPresets[scenario.priority]

  return {
    workload: {
      type: workload.label,
      trafficTier: requestTier.label,
      trafficPattern: trafficPatternPresets[scenario.trafficPattern].label,
      uptime: uptimeTier.label,
      regions: region.label,
      teamShape: teamShape.label,
      priority: priority.label,
      services: serviceRows.map((row) => row.category),
    },
    recommendation: {
      provider: stack.provider,
      stack: stack.stackTitle,
      model: stack.modelLabel,
      fitScore,
      monthlyEstimateUsd: costBreakdown.total,
      recommendedHandoff: recommendedOffer,
    },
    services: serviceRows.map((row) => ({
      category: row.category,
      selection: row.selection,
      control: row.control,
      portability: row.portability,
      monthlyEstimateUsd: row.monthly,
      reason: row.reason,
    })),
  }
}

function buildOpenTofuPreview(stack, scenario, serviceRows, recommendedOffer) {
  const requestTier = requestTierPresets[scenario.requestTier]
  const region = regionPresets[scenario.regionCount]

  const servicesBlock = [
    `    postgres       = ${scenario.services.postgres}`,
    `    redis          = ${scenario.services.redis}`,
    `    queue          = ${scenario.services.queue}`,
    `    object_storage = ${scenario.services.objectStorage}`,
  ].join('\n')

  const comments = serviceRows
    .map((row) => `# ${row.category}: ${row.selection}`)
    .join('\n')

  return `${comments}

module "workload" {
  source = "${stack.moduleSource}"

  name            = "production-app"
  workload_type   = "${scenario.workloadType}"
  traffic_tier    = "${scenario.requestTier}"
  traffic_pattern = "${scenario.trafficPattern}"
  uptime_tier     = "${scenario.uptimeTier}"
  region_shape    = "${scenario.regionCount}"
  team_shape      = "${scenario.teamShape}"
  priority        = "${scenario.priority}"

  services = {
${servicesBlock}
  }

  metadata = {
    provider_recommendation = "${stack.provider}"
    request_profile         = "${requestTier.detail}"
    region_note             = "${region.detail}"
    handoff                 = "${recommendedOffer}"
  }
}`
}

function buildGeneratedFiles(stack) {
  return [
    {
      path: 'stack.manifest.json',
      description: 'Canonical workload spec used for provider fit, services listing, and future control-plane orchestration.',
    },
    {
      path: 'providers.tf',
      description: `Pins the ${stack.provider} provider and the base deployment regions.`,
    },
    {
      path: 'main.tf',
      description: `Composes the ${stack.stackTitle.toLowerCase()} modules for compute, data, and edge services.`,
    },
    {
      path: 'variables.tf',
      description: 'Exposes the knobs that can change without rewriting the stack modules.',
    },
    {
      path: 'outputs.tf',
      description: 'Returns the URLs, service identifiers, and handoff values needed after deployment.',
    },
    {
      path: 'README.md',
      description: 'Deployment checklist, prerequisites, rollback notes, and what stays customer-owned.',
    },
  ]
}

function getRecommendedOfferId(scenario, recommendation) {
  if (scenario.uptimeTier === 'critical' || scenario.regionCount !== 'single') {
    return 'review'
  }

  if (scenario.teamShape === 'lean' && recommendation.monthlyEstimate > 320) {
    return 'review'
  }

  if (scenario.priority === 'portability') {
    return 'review'
  }

  return 'deploy-pack'
}

function evaluateStack(stack, scenario, lowestEstimate, highestEstimate) {
  const costBreakdown = buildCostBreakdown(stack, scenario)
  const scenarioPriority = priorityPresets[scenario.priority]
  const teamShape = teamShapePresets[scenario.teamShape]
  const uptimeTier = uptimeTierPresets[scenario.uptimeTier]
  const region = regionPresets[scenario.regionCount]
  const trafficPattern = trafficPatternPresets[scenario.trafficPattern]
  const workloadFit = stack.workloadAffinity[scenario.workloadType] || 3.8
  const queueBonus = scenario.services.queue ? stack.queueFit * 0.18 : 0
  const costFit = costScore(costBreakdown.total, lowestEstimate, highestEstimate)

  const rawScore =
    costFit * scenarioPriority.costWeight +
    stack.scores.ops * scenarioPriority.opsWeight * teamShape.opsWeight +
    stack.scores.resilience * scenarioPriority.resilienceWeight * uptimeTier.resilienceWeight * region.resilienceWeight +
    stack.scores.portability * scenarioPriority.portabilityWeight +
    workloadFit * 0.95 +
    stack.scores.burst * trafficPattern.burstWeight * 0.35 +
    queueBonus

  return {
    ...stack,
    costBreakdown,
    monthlyEstimate: costBreakdown.total,
    rawScore,
  }
}

export const cloudFitWorkloadOptions = Object.entries(workloadPresets).map(([value, preset]) => ({
  value,
  label: preset.label,
  detail: preset.description,
}))

export const cloudFitRequestTierOptions = Object.entries(requestTierPresets).map(([value, preset]) => ({
  value,
  label: preset.label,
  detail: preset.detail,
}))

export const cloudFitTeamShapeOptions = Object.entries(teamShapePresets).map(([value, preset]) => ({
  value,
  label: preset.label,
  detail: preset.detail,
}))

export const cloudFitUptimeTierOptions = Object.entries(uptimeTierPresets).map(([value, preset]) => ({
  value,
  label: preset.label,
  detail: preset.detail,
}))

export const cloudFitRegionOptions = Object.entries(regionPresets).map(([value, preset]) => ({
  value,
  label: preset.label,
  detail: preset.detail,
}))

export const cloudFitTrafficPatternOptions = Object.entries(trafficPatternPresets).map(([value, preset]) => ({
  value,
  label: preset.label,
  detail: preset.detail,
}))

export const cloudFitPriorityOptions = Object.entries(priorityPresets).map(([value, preset]) => ({
  value,
  label: preset.label,
}))

export const defaultCloudFitScenario = normalizeScenario()

export function getCloudFitWorkloadDefaults(workloadType) {
  return {
    ...scenarioDefaults(workloadType),
  }
}

export function buildCloudFitPlan(inputScenario) {
  const scenario = normalizeScenario(inputScenario)
  const monthlyEstimates = stackCatalog.map((stack) => buildCostBreakdown(stack, scenario).total)
  const lowestEstimate = Math.min(...monthlyEstimates)
  const highestEstimate = Math.max(...monthlyEstimates)

  const evaluated = stackCatalog.map((stack) => evaluateStack(stack, scenario, lowestEstimate, highestEstimate))
  const sorted = [...evaluated].sort((left, right) => right.rawScore - left.rawScore)

  const rankingContext = {
    lowestCostId: [...evaluated].sort((left, right) => left.monthlyEstimate - right.monthlyEstimate)[0].id,
    lowestOpsId: [...evaluated].sort((left, right) => right.scores.ops - left.scores.ops)[0].id,
    highestPortabilityId: [...evaluated].sort((left, right) => right.scores.portability - left.scores.portability)[0].id,
    highestResilienceId: [...evaluated].sort((left, right) => right.scores.resilience - left.scores.resilience)[0].id,
  }

  const maxRawScore = Math.max(...sorted.map((item) => item.rawScore))

  const recommendations = sorted.map((item, index) => {
    const fitScore = Math.round((item.rawScore / maxRawScore) * 100)
    const serviceRows = buildServiceRows(item, scenario, item.costBreakdown)
    const recommendedOffer = getRecommendedOfferId(scenario, item)
    const manifest = buildManifest(item, scenario, item.costBreakdown, serviceRows, fitScore, recommendedOffer)

    return {
      ...item,
      fitScore,
      serviceRows,
      recommendedOffer,
      reasons: buildReasons(item, scenario, rankingContext),
      opsLabel: labelForScore(item.scores.ops),
      resilienceLabel: resilienceLabel(item.scores.resilience),
      portabilityLabel: portabilityLabel(item.scores.portability),
      manifestPreview: JSON.stringify(manifest, null, 2),
      manifest,
      openTofuPreview: buildOpenTofuPreview(item, scenario, serviceRows, recommendedOffer),
      generatedFiles: buildGeneratedFiles(item),
      verdict:
        index === 0
          ? 'Recommended'
          : item.id === rankingContext.lowestCostId
            ? 'Lowest cost'
            : item.id === rankingContext.lowestOpsId
              ? 'Lowest ops'
              : 'Alternative',
    }
  })

  return {
    scenario,
    recommendations,
    recommended: recommendations[0],
  }
}
