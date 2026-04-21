import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import { createDiscussUrl } from '../constants/routes'

const dataDemoModes = [
  { value: 'aws-data-architect', label: 'AWS data architecture' },
  { value: 'pipeline-rescue', label: 'Pipeline rescue' },
]

const awsSourceOptions = [
  { value: 'cdc-db', label: 'CDC / database change capture' },
  { value: 'api-batch', label: 'API batch collection' },
  { value: 'event-stream', label: 'Event stream landing' },
  { value: 'file-landings', label: 'Partner files / S3 landings' },
]

const awsFreshnessOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'hourly', label: 'Hourly' },
  { value: '15-minute', label: '15-minute windows' },
]

const awsConsumerOptions = [
  { value: 'bi-marts', label: 'BI marts' },
  { value: 'operational', label: 'Operational views' },
  { value: 'shared-product', label: 'Shared data product' },
]

const awsServingOptions = [
  { value: 'athena-lakehouse', label: 'Athena lakehouse' },
  { value: 'redshift-serving', label: 'Redshift serving layer' },
  { value: 'hybrid-serving', label: 'Hybrid lakehouse + warehouse' },
]

const awsGovernanceOptions = [
  { value: 'lean', label: 'Lean controls' },
  { value: 'controlled', label: 'Controlled platform' },
  { value: 'regulated', label: 'Regulated / audit-heavy' },
]

const rescueHotspotOptions = [
  { value: 'ingestion', label: 'Ingestion breaks first' },
  { value: 'transform', label: 'Transforms are brittle' },
  { value: 'serving', label: 'Serving layer drifts' },
]

const rescueSlaOptions = [
  { value: '4-hours', label: '4-hour recovery target' },
  { value: '1-hour', label: '1-hour recovery target' },
  { value: '15-minutes', label: '15-minute recovery target' },
]

function buildArchitectureBlueprint({ sourcePattern, freshness, dailyVolume, consumers, servingModel, governanceTier }) {
  const ingestionLayer =
    sourcePattern === 'api-batch'
      ? 'EventBridge or Step Functions schedules -> Lambda or container collectors -> replayable S3 raw zone'
      : sourcePattern === 'event-stream'
        ? 'Kinesis or queue-fed micro-batches -> S3 raw append log -> dead-letter recovery path'
        : sourcePattern === 'file-landings'
          ? 'S3 landing zone -> validation and manifesting -> raw promotion'
          : dailyVolume >= 1800
            ? 'Database CDC or DMS-style change capture -> S3 raw change log -> replay manifests'
            : 'Watermark-based incremental extraction -> S3 raw change log -> replay manifests'

  const lakehouseLayer =
    servingModel === 'redshift-serving'
      ? 'S3 raw and curated zones with Parquet datasets feeding a warehouse-oriented serving layer'
      : servingModel === 'hybrid-serving'
        ? 'S3 raw / validated / curated zones with Parquet and Iceberg-ready curated domains'
        : 'S3 raw / validated / curated lakehouse with Parquet today and Iceberg-ready curated domains'

  const processingLayer =
    freshness === '15-minute'
      ? 'Step Functions control plane with short-window Glue or ECS transforms when Lambda stops fitting'
      : dailyVolume >= 1800
        ? 'Batch orchestration into Glue or ECS transforms for heavier joins and stateful windows'
        : 'Lambda Python or lightweight Glue transforms into curated domain tables'

  const orchestrationLayer =
    freshness === '15-minute'
      ? 'EventBridge 15-minute cadence + SQS buffering + DLQ + CloudWatch alarm routing'
      : freshness === 'hourly'
        ? 'Hourly EventBridge schedules + Step Functions retries + replay-safe backfills'
        : 'Daily batch orchestration with explicit reruns, manifests, and backfill controls'

  const servingLayer =
    servingModel === 'redshift-serving'
      ? 'Curated S3 datasets loaded into Redshift Serverless marts for stronger BI concurrency and semantic serving'
      : servingModel === 'hybrid-serving'
        ? 'Athena for exploration and shared access, Redshift Serverless only for hot marts and concurrency pressure'
        : consumers === 'operational'
          ? 'Athena operational views plus extract surfaces for lightweight downstream consumers'
          : consumers === 'bi-marts'
            ? 'Athena views over curated domains with marts exported only where needed'
            : 'Athena-backed shared domain data products with curated access patterns'

  const governanceLayer =
    governanceTier === 'regulated'
      ? 'Lake Formation permissions, PII-aware domain boundaries, retention controls, audit trails, and contract testing'
      : governanceTier === 'controlled'
        ? 'Glue Catalog, Lake Formation permissions, schema contracts, and freshness / quality checks on curated domains'
        : 'Glue Catalog contracts, CloudWatch freshness alarms, and lightweight data quality gates'

  const recoveryLayer =
    freshness === '15-minute'
      ? 'Replay manifests, DLQ reprocessing, partition-level backfills, and documented incident routing'
      : 'Replayable raw storage, idempotent transforms, and rerun-safe downstream publication'

  const architectureStance =
    servingModel === 'athena-lakehouse'
      ? 'Lakehouse-first with low idle cost and explicit warehouse escape hatches'
      : servingModel === 'redshift-serving'
        ? 'Warehouse-serving architecture for heavier BI concurrency and semantic pressure'
        : 'Lakehouse core with selective warehouse serving where concurrency or latency justify it'

  const scalePath =
    servingModel === 'athena-lakehouse'
      ? 'Stay on S3 + Athena until concurrency, semantic modeling, or SLA pressure justify Redshift'
      : servingModel === 'redshift-serving'
        ? 'Keep raw and curated zones on S3 while Redshift absorbs heavier marts and downstream BI load'
        : 'Hold the lakehouse as the source of truth and add Redshift only for the small serving surfaces that need it'

  const billRange =
    servingModel === 'redshift-serving' || servingModel === 'hybrid-serving'
      ? freshness === '15-minute' || dailyVolume >= 1800
        ? '$180-$420/mo'
        : '$90-$240/mo'
      : freshness === '15-minute' || dailyVolume >= 1800
        ? '$60-$160/mo'
        : freshness === 'hourly'
          ? '$25-$85/mo'
          : '$20-$55/mo'

  const resilienceScore = Math.min(
    96,
    73 +
      (freshness === '15-minute' ? 8 : freshness === 'hourly' ? 6 : 4) +
      (servingModel === 'hybrid-serving' ? 6 : servingModel === 'redshift-serving' ? 4 : 3) +
      (governanceTier === 'regulated' ? 10 : governanceTier === 'controlled' ? 7 : 4),
  )

  const phasePlan = [
    'Land ingestion into replayable raw storage with manifests, contracts, and explicit ownership by source.',
    'Promote validated and curated domain datasets, then expose the first serving layer without collapsing raw and curated concerns.',
    'Harden governance, recovery, and observability so the platform survives scale and incident pressure without heroics.',
  ]

  const guardrails =
    governanceTier === 'regulated'
      ? [
          'Domain-level access boundaries with audited permissions',
          'Schema-contract and freshness checks before publication',
          'Partition-level replay plus retention controls for regulated data',
        ]
      : governanceTier === 'controlled'
        ? [
            'Curated domain ownership and Lake Formation permissions',
            'Data quality checks before serving publication',
            'CloudWatch and SNS routing for freshness and failure breaches',
          ]
        : [
            'Replay manifests and idempotent publication paths',
            'CloudWatch failure and freshness alarms',
            'SQS dead-letter handling for asynchronous failure cases',
          ]

  const architectureDecisions = [
    architectureStance,
    scalePath,
    recoveryLayer,
  ]

  const accessChecklist = [
    'S3 access for raw, validated, and curated prefixes or dedicated buckets',
    'Glue Catalog and optional Lake Formation permissions',
    'Lambda, Glue, or ECS deployment rights for transforms',
    'EventBridge, Step Functions, SQS, and CloudWatch access for the control plane',
    servingModel === 'athena-lakehouse' ? 'Athena workgroup and results bucket access' : 'Athena plus optional Redshift Serverless namespace access',
  ]

  const manifest = {
    profile: 'aws-data-architect',
    source_pattern: sourcePattern,
    target_freshness: freshness,
    daily_volume_gb: dailyVolume,
    consumers,
    serving_model: servingModel,
    governance_tier: governanceTier,
    ingestion: ingestionLayer,
    lakehouse: lakehouseLayer,
    processing: processingLayer,
    orchestration: orchestrationLayer,
    serving: servingLayer,
    recovery: recoveryLayer,
  }

  return {
    architectureStance,
    billRange,
    resilienceScore,
    scalePath,
    ingestionLayer,
    lakehouseLayer,
    processingLayer,
    orchestrationLayer,
    servingLayer,
    governanceLayer,
    recoveryLayer,
    phasePlan,
    guardrails,
    architectureDecisions,
    accessChecklist,
    manifest,
  }
}

function buildRescuePlan({ hotspot, incidentsPerWeek, replayWindow, recoveryTarget }) {
  const stabilizationTrack =
    hotspot === 'ingestion'
      ? 'Add source lag checks, idempotent raw loads, and manifest-backed replay before touching downstream marts.'
      : hotspot === 'transform'
        ? 'Split brittle transforms into replayable stages with domain contracts and quality gates.'
        : 'Move serving publication behind staging tables, merge windows, and freshness drift detection.'

  const first48Hours = [
    'Pin the failing stage and freeze downstream workaround churn.',
    stabilizationTrack,
    `Define a replay path that can recover ${replayWindow} hours of missed data without manual warehouse surgery.`,
  ]

  const firstTwoWeeks = [
    hotspot === 'ingestion' ? 'Add source freshness, schema, and lag dashboards.' : 'Add row-count, null, duplication, and publication checks to the critical path.',
    recoveryTarget === '15-minutes'
      ? 'Instrument fast-path alerts with owner routing, runbook links, and failure bucketing.'
      : 'Build operator dashboards that make retries, backfills, and blast radius explicit.',
    'Document ownership by layer so the next incident does not become a cross-team guessing exercise.',
  ]

  const monthOne = [
    'Remove manual restore steps and make replay / republish automation explicit.',
    'Add business-facing freshness SLIs alongside job-status metrics.',
    'Decide whether the platform needs cleanup, staged re-architecture, or selective re-platforming.',
  ]

  const riskLevel =
    incidentsPerWeek >= 10 ? 'Critical' : incidentsPerWeek >= 6 ? 'High' : incidentsPerWeek >= 3 ? 'Elevated' : 'Contained'

  return {
    riskLevel,
    first48Hours,
    firstTwoWeeks,
    monthOne,
  }
}

function AwsDataPipelineStudio() {
  const [activeMode, setActiveMode] = useState('aws-data-architect')
  const [sourcePattern, setSourcePattern] = useState('cdc-db')
  const [freshness, setFreshness] = useState('hourly')
  const [dailyVolume, setDailyVolume] = useState(700)
  const [consumers, setConsumers] = useState('shared-product')
  const [servingModel, setServingModel] = useState('hybrid-serving')
  const [governanceTier, setGovernanceTier] = useState('controlled')

  const [hotspot, setHotspot] = useState('transform')
  const [incidentsPerWeek, setIncidentsPerWeek] = useState(5)
  const [replayWindow, setReplayWindow] = useState(24)
  const [recoveryTarget, setRecoveryTarget] = useState('1-hour')

  const awsBlueprint = useMemo(
    () => buildArchitectureBlueprint({ sourcePattern, freshness, dailyVolume, consumers, servingModel, governanceTier }),
    [sourcePattern, freshness, dailyVolume, consumers, servingModel, governanceTier],
  )
  const rescuePlan = useMemo(
    () => buildRescuePlan({ hotspot, incidentsPerWeek, replayWindow, recoveryTarget }),
    [hotspot, incidentsPerWeek, replayWindow, recoveryTarget],
  )

  const architectureLayers = [
    ['Ingestion', awsBlueprint.ingestionLayer],
    ['Lakehouse', awsBlueprint.lakehouseLayer],
    ['Processing', awsBlueprint.processingLayer],
    ['Control plane', awsBlueprint.orchestrationLayer],
    ['Serving', awsBlueprint.servingLayer],
    ['Governance', awsBlueprint.governanceLayer],
  ]

  return (
    <section id="aws-data-demos" className="scroll-mt-28">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="text-sm text-gray-400">data-platforms — aws architecture</div>
        </div>

        <div className="terminal-content">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="section-chip">Architect-level proof</span>
              <h2 className="section-title text-3xl sm:text-4xl">AWS data architecture and pipeline rescue</h2>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
              Use the first mode to shape ingestion, lakehouse, orchestration, governance, and serving decisions for a production-minded AWS data platform. Use the second when the immediate problem is replayability, reliability, and operational recovery.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {dataDemoModes.map((mode) => {
              const isActive = activeMode === mode.value

              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setActiveMode(mode.value)}
                  className={isActive ? 'primary-button' : 'secondary-button'}
                >
                  {mode.label}
                </button>
              )
            })}
          </div>

          {activeMode === 'aws-data-architect' ? (
            <div className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <label className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Source pattern</span>
                  <select value={sourcePattern} onChange={(event) => setSourcePattern(event.target.value)} className="mt-3 w-full rounded-2xl border border-dark-700/70 bg-dark-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-400">
                    {awsSourceOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Freshness target</span>
                  <select value={freshness} onChange={(event) => setFreshness(event.target.value)} className="mt-3 w-full rounded-2xl border border-dark-700/70 bg-dark-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-400">
                    {awsFreshnessOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Serving model</span>
                  <select value={servingModel} onChange={(event) => setServingModel(event.target.value)} className="mt-3 w-full rounded-2xl border border-dark-700/70 bg-dark-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-400">
                    {awsServingOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Consumer shape</span>
                  <select value={consumers} onChange={(event) => setConsumers(event.target.value)} className="mt-3 w-full rounded-2xl border border-dark-700/70 bg-dark-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-400">
                    {awsConsumerOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Governance tier</span>
                  <select value={governanceTier} onChange={(event) => setGovernanceTier(event.target.value)} className="mt-3 w-full rounded-2xl border border-dark-700/70 bg-dark-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-400">
                    {awsGovernanceOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Daily volume</span>
                    <span className="text-sm font-semibold text-white">{dailyVolume} GB</span>
                  </div>
                  <input type="range" min="100" max="3000" step="100" value={dailyVolume} onChange={(event) => setDailyVolume(Number(event.target.value))} className="mt-4 w-full accent-cyan-300" />
                  <p className="mt-3 text-xs leading-6 text-gray-500">Use this to pressure-test where Lambda still fits and where Glue, ECS, or Redshift start becoming justified.</p>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="metric-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Architecture stance</p>
                  <p className="mt-3 text-lg font-semibold text-white">{awsBlueprint.architectureStance}</p>
                </div>
                <div className="metric-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Monthly envelope</p>
                  <p className="mt-3 text-lg font-semibold text-white">{awsBlueprint.billRange}</p>
                </div>
                <div className="metric-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Resilience posture</p>
                  <p className="mt-3 text-lg font-semibold text-white">{awsBlueprint.resilienceScore}/100</p>
                </div>
                <div className="metric-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Scale path</p>
                  <p className="mt-3 text-lg font-semibold text-white">{awsBlueprint.scalePath}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {architectureLayers.map(([label, value]) => (
                  <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">{label}</p>
                    <p className="mt-4 text-sm leading-7 text-gray-300">{value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]">
                <div className="space-y-6">
                  <div className="rounded-[1.6rem] border border-dark-700/70 bg-dark-900/40 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Phased rollout</p>
                    <ol className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                      {awsBlueprint.phasePlan.map((item, index) => (
                        <li key={item} className="flex gap-4 rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-sm font-semibold text-white">{index + 1}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="rounded-[1.6rem] border border-dark-700/70 bg-dark-900/40 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Guardrails and access</p>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <ul className="space-y-3 text-sm leading-7 text-gray-300">
                        {awsBlueprint.guardrails.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-3 text-sm leading-7 text-gray-300">
                        {awsBlueprint.accessChecklist.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[1.6rem] border border-dark-700/70 bg-dark-900/40 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Architecture decisions</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                      {awsBlueprint.architectureDecisions.map((item) => (
                        <li key={item} className="rounded-2xl border border-dark-700/70 bg-black/20 px-4 py-4">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.6rem] border border-dark-700/70 bg-[#040916]/80 p-5 terminal-readout">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Architecture manifest</p>
                    <pre className="mt-4 overflow-x-auto text-[13px] leading-7 text-cyan-100">{JSON.stringify(awsBlueprint.manifest, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <label className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Failure hotspot</span>
                  <select value={hotspot} onChange={(event) => setHotspot(event.target.value)} className="mt-3 w-full rounded-2xl border border-dark-700/70 bg-dark-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-400">
                    {rescueHotspotOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>

                <label className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Incidents per week</span>
                    <span className="text-sm font-semibold text-white">{incidentsPerWeek}</span>
                  </div>
                  <input type="range" min="1" max="12" step="1" value={incidentsPerWeek} onChange={(event) => setIncidentsPerWeek(Number(event.target.value))} className="mt-4 w-full accent-cyan-300" />
                </label>

                <label className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Replay window</span>
                    <span className="text-sm font-semibold text-white">{replayWindow}h</span>
                  </div>
                  <input type="range" min="6" max="72" step="6" value={replayWindow} onChange={(event) => setReplayWindow(Number(event.target.value))} className="mt-4 w-full accent-cyan-300" />
                </label>

                <label className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">Recovery target</span>
                  <select value={recoveryTarget} onChange={(event) => setRecoveryTarget(event.target.value)} className="mt-3 w-full rounded-2xl border border-dark-700/70 bg-dark-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary-400">
                    {rescueSlaOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="metric-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Risk level</p>
                  <p className="mt-3 text-lg font-semibold text-white">{rescuePlan.riskLevel}</p>
                </div>
                <div className="metric-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Immediate goal</p>
                  <p className="mt-3 text-lg font-semibold text-white">Replay before redesign</p>
                </div>
                <div className="metric-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Target outcome</p>
                  <p className="mt-3 text-lg font-semibold text-white">Operator-safe recovery path</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ['First 48 hours', rescuePlan.first48Hours],
                  ['First 2 weeks', rescuePlan.firstTwoWeeks],
                  ['Month 1', rescuePlan.monthOne],
                ].map(([label, steps]) => (
                  <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">{label}</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                      {steps.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.6rem] border border-dark-700/70 bg-dark-900/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">What the rescue should produce</p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {[
                    'A replay-safe ingestion or transformation path with explicit publication control',
                    'Operator dashboards for lag, freshness, replay status, and blast radius',
                    'A runbook and ownership model that survive the next incident without heroics',
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-dark-700/70 bg-black/20 p-4 text-sm leading-7 text-gray-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-[1.6rem] border border-primary-800 bg-primary-900/20 p-5">
            <p className="text-sm leading-7 text-gray-300">
              If this direction is close, I can turn it into an AWS data architecture brief or a pipeline stabilization engagement with concrete delivery scope.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to={createDiscussUrl('data-platforms')} className="primary-button gap-2">
                Turn this into a data platform brief
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AwsDataPipelineStudio
