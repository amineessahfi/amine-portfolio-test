export const services = [
  {
    slug: 'platform-engineering',
    eyebrow: 'Service 01',
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
    slug: 'aws-cost-optimization',
    eyebrow: 'Service 02',
    title: 'AWS Cost Optimization & Cloud Efficiency',
    summary:
      'Find and remove waste across compute, storage, transfer, and platform architecture while preserving reliability and delivery speed.',
    highlights: [
      'Cost visibility tied to architecture decisions',
      'Right-sizing, storage, and network spend review',
      'Savings plans, reservations, and waste reduction backlog',
    ],
    outcomes: [
      'Lower recurring cloud spend with measurable savings',
      'Prioritized cost actions instead of generic recommendations',
      'Better cost ownership across engineering and platform teams',
    ],
    deliverables: [
      'Current-state AWS cost review and optimization map',
      'Estimated savings by initiative and implementation priority',
      'Hands-on support for quick wins and long-term controls',
    ],
    bestFor: [
      'AWS estates that grew quickly without cost discipline',
      'Teams under pressure to cut spend without breaking delivery',
      'Platforms that need clearer financial visibility and control',
    ],
    snapshot: [
      { label: 'Primary focus', value: 'Spend reduction' },
      { label: 'Delivery style', value: 'Audit + execution plan' },
      { label: 'Typical outcome', value: 'Leaner monthly spend' },
    ],
  },
  {
    slug: 'data-platforms',
    eyebrow: 'Service 03',
    title: 'Data Platform & Pipeline Engineering',
    summary:
      'Build reliable data pipelines, orchestration layers, and platform foundations that turn operational data into usable systems for decision-making.',
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
]

export function getServiceBySlug(serviceSlug) {
  return services.find((service) => service.slug === serviceSlug)
}
