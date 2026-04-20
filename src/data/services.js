export const services = [
  {
    slug: 'platform-engineering',
    eyebrow: 'Service 01',
    category: 'platform-data',
    categoryLabel: 'Platform & data',
    homepageFeatured: true,
    title: 'Platform Engineering & Internal Developer Platforms',
    summary:
      'Design the paved roads, deployment workflows, and operational guardrails that help product teams ship faster without increasing platform chaos.',
    highlights: [
      'Golden paths for service onboarding and deployment',
      'Kubernetes, CI/CD, and infrastructure standardization',
      'Observability, documentation, and operational guardrails',
    ],
    outcomes: [
      'Reduce delivery friction across engineering teams',
      'Create reusable platform patterns instead of one-off scripts',
      'Improve release confidence with clearer tooling and guardrails',
    ],
    deliverables: [
      'Platform assessment and architecture roadmap',
      'Reference templates for services, environments, and CI/CD',
      'Operational dashboards, documentation, and enablement handoff',
    ],
    bestFor: [
      'Organizations scaling across multiple services or squads',
      'Teams moving from ad-hoc ops into repeatable platform workflows',
      'Engineering leaders who need a cleaner internal developer experience',
    ],
    snapshot: [
      { label: 'Primary focus', value: 'Developer velocity' },
      { label: 'Delivery style', value: 'Assess + implement' },
      { label: 'Typical outcome', value: 'Faster, safer releases' },
    ],
  },
  {
    slug: 'cloud-fit-deployment',
    eyebrow: 'Service 02',
    category: 'cloud-environments',
    categoryLabel: 'Cloud & environments',
    homepageFeatured: false,
    title: 'Cloud Fit, IaC & Deployment Packs',
    summary:
      'Choose the right provider stack for the workload, make the services listing explicit, and leave with a deploy-ready IaC pack or a one-time rollout.',
    highlights: [
      'Provider recommendation tied to cost, ops burden, and resilience tradeoffs',
      'Services listing that makes compute, data, edge, and backup choices explicit',
      'OpenTofu or Terraform delivery pack with review or one-time deployment handoff',
    ],
    outcomes: [
      'Move from vague provider debate into a directionally right stack decision',
      'Make the infrastructure bill of materials legible before any rollout starts',
      'Get a deployable pack or one-time deployment path instead of a generic cloud audit',
    ],
    deliverables: [
      'Workload questionnaire and shortlist recommendation with tradeoff summary',
      'Services listing covering compute, data, networking, observability, and recovery',
      'Generated IaC pack plus review or one-time deployment handoff',
    ],
    bestFor: [
      'Teams outgrowing simple PaaS setups and needing a clearer production landing zone',
      'Founders or platform leads comparing providers without wanting a six-week infra study',
      'Organizations that want a deployable stack choice, not just cost commentary',
    ],
    snapshot: [
      { label: 'Primary focus', value: 'Cloud fit + deployability' },
      { label: 'Delivery style', value: 'Recommendation + IaC + rollout' },
      { label: 'Typical outcome', value: 'Right-fit stack with deploy-ready code' },
    ],
  },
  {
    slug: 'data-platforms',
    eyebrow: 'Service 03',
    category: 'platform-data',
    categoryLabel: 'Platform & data',
    homepageFeatured: true,
    title: 'Data Platform & Pipeline Engineering',
    summary:
      'Build reliable AWS-native data pipelines with low-cost landing shapes that still use proper raw and curated zones, orchestration, monitoring, and clean upgrade paths as volume grows.',
    highlights: [
      'Pipeline design for batch and near-real-time workloads',
      'Airflow and workflow orchestration patterns',
      'Storage, modeling, and downstream analytics readiness',
    ],
    outcomes: [
      'More reliable data movement and processing workflows',
      'Clearer operating model for ingestion, transformation, and access',
      'Data platforms that support both ops use cases and analytics',
    ],
    deliverables: [
      'Pipeline and orchestration architecture design',
      'Implementation support for ingestion, transformation, and scheduling',
      'Operational visibility, runbooks, and handover guidance',
    ],
    bestFor: [
      'Teams scaling beyond scripts and fragmented data jobs',
      'Organizations needing stronger orchestration and observability',
      'Products that depend on data flowing reliably between systems',
    ],
    snapshot: [
      { label: 'Primary focus', value: 'Reliable pipelines' },
      { label: 'Delivery style', value: 'Architecture + buildout' },
      { label: 'Typical outcome', value: 'More dependable data flows' },
    ],
  },
  {
    slug: 'telco-tooling',
    eyebrow: 'Service 04',
    category: 'automation-ops',
    categoryLabel: 'Automation & operations',
    homepageFeatured: true,
    title: 'Telco Infrastructure & Device Operations Tooling',
    summary:
      'Design and improve telecom-facing operational systems around SIM lifecycle, OTA workflows, device management, and field-ready tooling.',
    highlights: [
      'SIM provisioning and lifecycle tooling',
      'OTA and device operations workflows',
      'Operational platforms for telecom-grade processes',
    ],
    outcomes: [
      'Better operational control across telecom-facing systems',
      'Reduced manual overhead for device and SIM workflows',
      'Tooling shaped for regulated and high-volume operating environments',
    ],
    deliverables: [
      'Process and platform assessment for telco tooling stacks',
      'Workflow design for SIM, OTA, and related operational systems',
      'Implementation support for service reliability and operator efficiency',
    ],
    bestFor: [
      'Teams running SIM, OTA, or telecom operations at scale',
      'Organizations replacing manual telecom workflows with platforms',
      'Products that need stronger tooling around device lifecycle operations',
    ],
    snapshot: [
      { label: 'Primary focus', value: 'Operational tooling' },
      { label: 'Delivery style', value: 'Workflow + platform design' },
      { label: 'Typical outcome', value: 'Less manual telecom ops' },
    ],
  },
  {
    slug: 'live-terminal-sandbox',
    eyebrow: 'Service 05',
    category: 'cloud-environments',
    categoryLabel: 'Cloud & environments',
    homepageFeatured: false,
    title: 'Live Linux Sandbox & Ephemeral Demo Environments',
    summary:
      'Offer visitors a real Linux shell in the browser for five minutes using isolated, time-limited containers that are safe enough for public demos and service-led discovery.',
    highlights: [
      'Browser-accessed Linux shell with hard session expiry',
      'Docker isolation, no outbound network, and non-root execution',
      'Useful for demos, onboarding flows, and service qualification',
    ],
    outcomes: [
      'Let prospects try a real terminal-backed experience without permanent access',
      'Turn service pages into hands-on proof instead of static copy only',
      'Keep risk bounded with strict time, resource, and isolation controls',
    ],
    deliverables: [
      'Session broker API with tokenized launch flow',
      'Containerized Linux sandbox with hard 5-minute expiry',
      'Frontend launch flow, terminal UI, and safe-usage messaging',
    ],
    bestFor: [
      'Service-led websites that need a live proof-of-capability moment',
      'Teams showcasing platforms, automation, or CLI-driven workflows',
      'Use cases where a public terminal experience must stay tightly constrained',
    ],
    snapshot: [
      { label: 'Primary focus', value: 'Safe live demo access' },
      { label: 'Delivery style', value: 'Browser + backend sandbox' },
      { label: 'Typical outcome', value: 'Hands-on visitor engagement' },
    ],
  },
  {
    slug: 'workflow-composer',
    eyebrow: 'Service 06',
    category: 'automation-ops',
    categoryLabel: 'Automation & operations',
    homepageFeatured: false,
    title: 'Workflow Composer & Automation Orchestration',
    summary:
      'Design automation flows, operator approvals, and cross-system handoffs that turn messy internal sequences into reliable operating paths.',
    highlights: [
      'Visual workflow composition for triggers, branches, and handoffs',
      'Guardrails around retries, approvals, and fallback behavior',
      'Useful for ops automation, internal tools, and service qualification',
    ],
    outcomes: [
      'Reduce manual coordination across teams and systems',
      'Make automation logic reviewable before implementation starts',
      'Turn ad-hoc sequences into clearer internal operating products',
    ],
    deliverables: [
      'Workflow architecture and orchestration design',
      'Automation step mapping across triggers, integrations, and approvals',
      'Implementation support for runtime controls, observability, and handoff',
    ],
    bestFor: [
      'Teams replacing spreadsheet-driven or chat-driven internal workflows',
      'Operators who need automation with clear approval and fallback points',
      'Organizations turning repetitive service work into productized flows',
    ],
    snapshot: [
      { label: 'Primary focus', value: 'Automation clarity' },
      { label: 'Delivery style', value: 'Workflow design + buildout' },
      { label: 'Typical outcome', value: 'Cleaner internal operations' },
    ],
  },
]

export const serviceBrowseOptions = [
  { value: 'all', label: 'All services' },
  { value: 'platform-data', label: 'Platform & data' },
  { value: 'cloud-environments', label: 'Cloud & environments' },
  { value: 'automation-ops', label: 'Automation & operations' },
]

export const serviceSlugAliases = {
  'aws-cost-optimization': 'cloud-fit-deployment',
  'cloud-cost-optimization': 'cloud-fit-deployment',
}

export function normalizeServiceSlug(serviceSlug = '') {
  return serviceSlugAliases[serviceSlug] || serviceSlug
}

export function getServiceBySlug(serviceSlug) {
  const normalizedSlug = normalizeServiceSlug(serviceSlug)
  return services.find((service) => service.slug === normalizedSlug)
}
