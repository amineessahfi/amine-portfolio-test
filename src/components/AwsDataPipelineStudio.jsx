import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import { createDiscussUrl } from '../constants/routes'

const dataDemoModes = [
  { value: 'aws-data-engineer', label: 'Low-cost AWS pipeline' },
  { value: 'pipeline-rescue', label: 'Data pipelines' },
]

const awsSourceOptions = [
  { value: 'incremental-db', label: 'Incremental DB extract' },
  { value: 'api-batch', label: 'API batch pulls' },
  { value: 'file-drops', label: 'SaaS / file drops' },
]

const awsFreshnessOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'near-real-time', label: '15-minute windows' },
]

const awsConsumerOptions = [
  { value: 'bi', label: 'BI + reporting' },
  { value: 'ops', label: 'Ops + alerts' },
  { value: 'mixed', label: 'Shared internal platform' },
]

const rescueHotspotOptions = [
  { value: 'ingestion', label: 'Ingestion breaks first' },
  { value: 'transform', label: 'Transforms are brittle' },
  { value: 'serving', label: 'Warehouse loads drift' },
]

const rescueSlaOptions = [
  { value: '4-hours', label: '4-hour recovery target' },
  { value: '1-hour', label: '1-hour recovery target' },
  { value: '15-minutes', label: '15-minute recovery target' },
]

function buildAwsBlueprint({ sourcePattern, freshness, dailyVolume, consumers, governance }) {
  const extractionLayer =
    sourcePattern === 'api-batch'
      ? 'EventBridge schedule -> Lambda API collector -> S3 raw'
      : sourcePattern === 'file-drops'
        ? 'S3 landing bucket -> validation Lambda -> raw prefix'
        : 'Incremental extractor using watermark / updated_at windows -> S3 raw'

  const transformLayer =
    freshness === 'near-real-time'
      ? 'Short-window Lambda transforms -> Parquet curated zone'
      : dailyVolume >= 1400
        ? 'Batch extractor -> S3 raw -> ECS/Fargate transform escape hatch when Lambda stops fitting'
        : 'Lambda Python transforms -> Parquet curated zone'

  const orchestration =
    freshness === 'near-real-time'
      ? 'EventBridge every 15 minutes + SQS buffering + DLQ'
      : freshness === 'hourly'
        ? 'EventBridge hourly + SQS retry queue'
        : 'Daily EventBridge schedule + replayable reruns'

  const servingLayer =
    consumers === 'ops'
      ? 'Athena operational views + CloudWatch alarm thresholds'
      : consumers === 'bi'
        ? 'Athena views + lightweight exported marts'
        : 'Athena views over curated marts with shared access patterns'

  const datasetContract =
    sourcePattern === 'incremental-db'
      ? 'Primary key + watermark-based incremental extraction'
      : sourcePattern === 'api-batch'
        ? 'Cursor / since-token pagination with replay manifests'
        : 'File manifest + checksum validation before transform'

  const billRange =
    dailyVolume >= 1400 || freshness === 'near-real-time'
      ? '$60-$140/mo before scale-up'
      : freshness === 'hourly'
        ? '$25-$70/mo'
        : '$15-$40/mo'

  const reliabilityScore = Math.min(
    94,
    74 +
      (freshness === 'near-real-time' ? 8 : freshness === 'hourly' ? 6 : 4) +
      (dailyVolume >= 1400 ? 2 : 5) +
      (governance ? 8 : 2),
  )

  const sprintPlan = [
    `Land ${sourcePattern === 'incremental-db' ? 'incremental database extracts' : sourcePattern === 'api-batch' ? 'API batches' : 'file drops'} into a replayable S3 raw zone.`,
    `Convert raw payloads into partitioned Parquet through ${transformLayer.toLowerCase()}.`,
    `Expose the first curated dataset through ${servingLayer.toLowerCase()} while keeping the stack below a typical always-on data-platform bill.`,
  ]

  const guardrails = governance
    ? ['IAM least privilege + bucket prefix isolation', 'Glue Catalog contracts + schema checks', 'CloudWatch alarms + SNS paging']
    : ['S3 replay manifests', 'CloudWatch failure alarms', 'SQS dead-letter queue']

  const accessChecklist = [
    'One dedicated S3 bucket or restricted bucket prefix',
    'Lambda create/update plus CloudWatch Logs access',
    'EventBridge scheduler plus SQS queue and DLQ access',
    'Athena workgroup and results bucket access',
    'Optional Glue Catalog access for managed table metadata',
  ]

  const manifest = {
    profile: 'lean-technical',
    extraction: extractionLayer,
    transforms: transformLayer,
    orchestration,
    serving: servingLayer,
    dataset_contract: datasetContract,
    daily_volume_gb: dailyVolume,
    target_freshness: freshness,
    governance,
    fixed_cost_bias: 'low idle cost',
  }

  return {
    spendProfile:
      dailyVolume >= 1400 || freshness === 'near-real-time'
        ? 'Lean now, with an ECS/Fargate escape hatch if Lambda stops fitting'
        : 'Lean technical pipeline with low fixed cost and clean upgrade paths',
    billRange,
    extractionLayer,
    transformLayer,
    orchestration,
    servingLayer,
    datasetContract,
    reliabilityScore,
    sprintPlan,
    guardrails,
    accessChecklist,
    manifest,
  }
}

function buildRescuePlan({ hotspot, incidentsPerWeek, replayWindow, recoveryTarget }) {
  const stabilizationTrack =
    hotspot === 'ingestion'
      ? 'Add watermark validation, idempotent raw loads, and source freshness checks.'
      : hotspot === 'transform'
        ? 'Break large transforms into replayable stages with data-quality gates.'
        : 'Move warehouse loads behind staging tables, merge windows, and drift detection.'

  const first48Hours = [
    'Pin the failing stage and freeze ad-hoc downstream changes.',
    stabilizationTrack,
    `Define a replay path that can recover ${replayWindow} hours of missed data without manual SQL surgery.`,
  ]

  const firstTwoWeeks = [
    hotspot === 'ingestion' ? 'Add schema-contract alerts and source lag dashboards.' : 'Add row-count, null, and duplication tests to the critical path.',
    recoveryTarget === '15-minutes'
      ? 'Instrument fast-path alerts with owner routing and runbook links.'
      : 'Build operator dashboards that make retries and backfills obvious.',
    'Document the on-call recovery sequence with clear ownership by stage.',
  ]

  const monthOne = [
    'Harden replay automation and remove manual restore steps.',
    'Add business-facing freshness SLIs, not just job-status lights.',
    'Decide whether the stack needs cleanup, re-platforming, or staged replacement.',
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
  const [activeMode, setActiveMode] = useState('aws-data-engineer')
  const [sourcePattern, setSourcePattern] = useState('incremental-db')
  const [freshness, setFreshness] = useState('hourly')
  const [dailyVolume, setDailyVolume] = useState(500)
  const [consumers, setConsumers] = useState('mixed')
  const [governance, setGovernance] = useState(true)

  const [hotspot, setHotspot] = useState('transform')
  const [incidentsPerWeek, setIncidentsPerWeek] = useState(5)
  const [replayWindow, setReplayWindow] = useState(24)
  const [recoveryTarget, setRecoveryTarget] = useState('1-hour')

  const awsBlueprint = useMemo(
    () => buildAwsBlueprint({ sourcePattern, freshness, dailyVolume, consumers, governance }),
    [sourcePattern, freshness, dailyVolume, consumers, governance],
  )
  const rescuePlan = useMemo(
    () => buildRescuePlan({ hotspot, incidentsPerWeek, replayWindow, recoveryTarget }),
    [hotspot, incidentsPerWeek, replayWindow, recoveryTarget],
  )

  return (
    <section id="aws-data-demos" className="scroll-mt-28">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="text-sm text-gray-400">data-platforms — aws demos</div>
        </div>

        <div className="terminal-content">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="section-chip">Lean but technical</span>
              <h2 className="section-title text-3xl sm:text-4xl">Low-cost AWS pipeline and rescue demos</h2>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
              The first demo models a serious low-cost AWS data pipeline: incremental extraction, S3 raw and curated zones, Parquet serving, Athena, and lightweight orchestration. The second turns a failing pipeline estate into a rescue plan.
            </p>
          </div>

          <div className="segmented-control">
            {dataDemoModes.map((mode) => {
              const isActive = activeMode === mode.value

              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setActiveMode(mode.value)}
                  className={isActive ? 'segmented-button segmented-button-active' : 'segmented-button'}
                >
                  {mode.label}
                </button>
              )
            })}
          </div>

          {activeMode === 'aws-data-engineer' ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
                  <label className="form-label" htmlFor="aws-source-pattern">
                    Ingestion pattern
                  </label>
                  <select
                    id="aws-source-pattern"
                    value={sourcePattern}
                    onChange={(event) => setSourcePattern(event.target.value)}
                    className="form-input"
                  >
                    {awsSourceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
                  <label className="form-label" htmlFor="aws-freshness">
                    Freshness target
                  </label>
                  <select
                    id="aws-freshness"
                    value={freshness}
                    onChange={(event) => setFreshness(event.target.value)}
                    className="form-input"
                  >
                    {awsFreshnessOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Daily volume: <span className="text-primary-300">{dailyVolume} GB/day</span>
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="2400"
                    step="50"
                    value={dailyVolume}
                    onChange={(event) => setDailyVolume(parseInt(event.target.value, 10))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-dark-700"
                  />
                </div>

                <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
                  <label className="form-label" htmlFor="aws-consumers">
                    Primary consumers
                  </label>
                  <select
                    id="aws-consumers"
                    value={consumers}
                    onChange={(event) => setConsumers(event.target.value)}
                    className="form-input"
                  >
                    {awsConsumerOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setGovernance((current) => !current)}
                  className={governance ? 'secondary-button justify-center gap-2' : 'soft-link inline-flex justify-center rounded-xl border border-white/10 px-4 py-3 text-sm'}
                >
                  {governance ? 'Schema and access guardrails on' : 'Schema and access guardrails off'}
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="metric-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Expected bill</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{awsBlueprint.billRange}</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">{awsBlueprint.spendProfile}</p>
                  </div>
                  <div className="metric-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Reliability score</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{awsBlueprint.reliabilityScore}%</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">Production-readiness estimate for a low-cost but still technical AWS landing shape.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ['Extraction', awsBlueprint.extractionLayer],
                    ['Transforms', awsBlueprint.transformLayer],
                    ['Orchestration', awsBlueprint.orchestration],
                    ['Serving layer', awsBlueprint.servingLayer],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">{label}</p>
                      <p className="mt-3 text-sm leading-7 text-gray-300">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.6rem] border border-dark-700/70 bg-dark-900/40 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Dataset contract</p>
                  <p className="mt-4 text-sm leading-7 text-gray-300">{awsBlueprint.datasetContract}</p>
                </div>

                <div className="rounded-[1.6rem] border border-dark-700/70 bg-dark-900/40 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">First sprint</p>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                    {awsBlueprint.sprintPlan.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                  <div className="rounded-[1.6rem] border border-dark-700/70 bg-dark-900/40 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Guardrails</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                      {awsBlueprint.guardrails.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[1.6rem] border border-cyan-400/15 bg-[#040916]/80 p-5 font-mono text-xs leading-7 text-cyan-200">
                    <p>{'{'}</p>
                    {Object.entries(awsBlueprint.manifest).map(([key, value]) => (
                      <p key={key} className="pl-4">
                        "{key}": {typeof value === 'string' ? `"${value}"` : String(value)},
                      </p>
                    ))}
                    <p>{'}'}</p>
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-primary-800 bg-primary-900/20 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Minimum AWS access to give me</p>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                    {awsBlueprint.accessChecklist.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm leading-7 text-gray-400">
                    Best handoff is a dedicated IAM user or assumable role scoped to one sandbox account, one region, and one project prefix instead of root or broad admin access. This stack stays credible without forcing DMS, Glue Spark, or Redshift on day one.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
                  <label className="form-label" htmlFor="pipeline-hotspot">
                    Failure hotspot
                  </label>
                  <select
                    id="pipeline-hotspot"
                    value={hotspot}
                    onChange={(event) => setHotspot(event.target.value)}
                    className="form-input"
                  >
                    {rescueHotspotOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Incidents per week: <span className="text-primary-300">{incidentsPerWeek}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={incidentsPerWeek}
                    onChange={(event) => setIncidentsPerWeek(parseInt(event.target.value, 10))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-dark-700"
                  />
                </div>

                <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Replay window: <span className="text-primary-300">{replayWindow} hours</span>
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="72"
                    step="4"
                    value={replayWindow}
                    onChange={(event) => setReplayWindow(parseInt(event.target.value, 10))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-dark-700"
                  />
                </div>

                <div className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-4">
                  <label className="form-label" htmlFor="pipeline-recovery-target">
                    Recovery target
                  </label>
                  <select
                    id="pipeline-recovery-target"
                    value={recoveryTarget}
                    onChange={(event) => setRecoveryTarget(event.target.value)}
                    className="form-input"
                  >
                    {rescueSlaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="metric-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Current risk</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{rescuePlan.riskLevel}</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">How urgent the pipeline cleanup likely is based on incident frequency and recovery expectations.</p>
                  </div>
                  <div className="metric-card p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">Fastest win</p>
                    <p className="mt-3 text-lg font-semibold text-white">Replay before redesign</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">Make recovery explicit first, then decide whether the stack needs staged replacement.</p>
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
                      'A replay-safe ingestion or transform path',
                      'Operator dashboards with freshness and failure SLIs',
                      'A runbook that survives the next incident without heroics',
                    ].map((item) => (
                      <div key={item} className="rounded-2xl border border-dark-700/70 bg-black/20 p-4 text-sm leading-7 text-gray-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-[1.6rem] border border-primary-800 bg-primary-900/20 p-5">
            <p className="text-sm leading-7 text-gray-300">
              If this direction is close, I can turn it into a scoped AWS data engineering or pipeline stabilization engagement.
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
