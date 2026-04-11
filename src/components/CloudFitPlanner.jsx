import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaCheckCircle, FaCode, FaLayerGroup } from 'react-icons/fa'
import { createDiscussUrl } from '../constants/routes'
import {
  buildCloudFitPlan,
  cloudFitPriorityOptions,
  cloudFitRegionOptions,
  cloudFitRequestTierOptions,
  cloudFitTeamShapeOptions,
  cloudFitTrafficPatternOptions,
  cloudFitUptimeTierOptions,
  cloudFitWorkloadOptions,
  defaultCloudFitScenario,
  getCloudFitWorkloadDefaults,
} from '../data/cloudFitPlanner'
import { discussOfferPresets } from '../data/discussTopics'

const serviceToggleLabels = {
  postgres: 'Postgres',
  redis: 'Cache',
  queue: 'Queue / workers',
  objectStorage: 'Object storage',
}

const previewModes = [
  { value: 'manifest', label: 'Manifest preview' },
  { value: 'opentofu', label: 'OpenTofu preview' },
  { value: 'files', label: 'Pack contents' },
]

function CloudFitPlanner() {
  const [scenario, setScenario] = useState(defaultCloudFitScenario)
  const [previewMode, setPreviewMode] = useState('manifest')
  const plan = useMemo(() => buildCloudFitPlan(scenario), [scenario])
  const recommended = plan.recommended
  const reviewOffer = discussOfferPresets.review
  const deployPackOffer = discussOfferPresets['deploy-pack']

  const updateScenario = (field, value) => {
    setScenario((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleWorkloadChange = (event) => {
    const nextWorkloadType = event.target.value

    setScenario((current) => ({
      ...current,
      workloadType: nextWorkloadType,
      services: getCloudFitWorkloadDefaults(nextWorkloadType),
    }))
  }

  const handleServiceToggle = (event) => {
    const { name, checked } = event.target

    setScenario((current) => ({
      ...current,
      services: {
        ...current.services,
        [name]: checked,
      },
    }))
  }

  const selectedPreview =
    previewMode === 'manifest'
      ? recommended.manifestPreview
      : previewMode === 'opentofu'
        ? recommended.openTofuPreview
        : ''

  return (
    <section id="cloud-fit-model" className="scroll-mt-28">
      <div className="terminal-window card-hover">
        <div className="terminal-header">
          <div className="text-sm text-gray-400">cloud-fit-planner — interactive</div>
        </div>

        <div className="terminal-content">
          <div className="space-y-3">
            <span className="section-chip">Questionnaire / recommendation / services listing / IaC preview</span>
            <h3 className="text-2xl font-semibold text-white sm:text-3xl">
              Compare the shortlist, inspect the services bill, then choose the handoff.
            </h3>
            <p className="max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
              This is the fastest GTM slice: capture the workload, rank the strongest provider fit, show the full
              services listing, preview the generated OpenTofu pack, then move into either the review or the one-time
              deployment ask.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
            <div className="panel-scroll-y space-y-5 rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-200">1. Capture the workload</p>
                <h4 className="mt-3 text-xl font-semibold text-white">Shape the scenario first.</h4>
                <p className="mt-3 text-sm leading-7 text-gray-400">
                  Keep the inputs directional. The point is to make provider fit, ops burden, and deployment shape legible
                  fast, not to pretend this is a billing export.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="form-label" htmlFor="cloud-fit-workload">
                    Workload profile
                  </label>
                  <select
                    id="cloud-fit-workload"
                    value={scenario.workloadType}
                    onChange={handleWorkloadChange}
                    className="form-select"
                  >
                    {cloudFitWorkloadOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs leading-6 text-gray-500">
                    {cloudFitWorkloadOptions.find((option) => option.value === scenario.workloadType)?.detail}
                  </p>
                </div>

                <div>
                  <label className="form-label" htmlFor="cloud-fit-traffic">
                    Traffic tier
                  </label>
                  <select
                    id="cloud-fit-traffic"
                    value={scenario.requestTier}
                    onChange={(event) => updateScenario('requestTier', event.target.value)}
                    className="form-select"
                  >
                    {cloudFitRequestTierOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="cloud-fit-traffic-pattern">
                    Traffic pattern
                  </label>
                  <select
                    id="cloud-fit-traffic-pattern"
                    value={scenario.trafficPattern}
                    onChange={(event) => updateScenario('trafficPattern', event.target.value)}
                    className="form-select"
                  >
                    {cloudFitTrafficPatternOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="cloud-fit-team">
                    Team shape
                  </label>
                  <select
                    id="cloud-fit-team"
                    value={scenario.teamShape}
                    onChange={(event) => updateScenario('teamShape', event.target.value)}
                    className="form-select"
                  >
                    {cloudFitTeamShapeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="cloud-fit-uptime">
                    Uptime target
                  </label>
                  <select
                    id="cloud-fit-uptime"
                    value={scenario.uptimeTier}
                    onChange={(event) => updateScenario('uptimeTier', event.target.value)}
                    className="form-select"
                  >
                    {cloudFitUptimeTierOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" htmlFor="cloud-fit-regions">
                    Regional shape
                  </label>
                  <select
                    id="cloud-fit-regions"
                    value={scenario.regionCount}
                    onChange={(event) => updateScenario('regionCount', event.target.value)}
                    className="form-select"
                  >
                    {cloudFitRegionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="form-label" htmlFor="cloud-fit-priority">
                    What matters most
                  </label>
                  <select
                    id="cloud-fit-priority"
                    value={scenario.priority}
                    onChange={(event) => updateScenario('priority', event.target.value)}
                    className="form-select"
                  >
                    {cloudFitPriorityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-[1.35rem] border border-white/10 bg-dark-900/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Services to include</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {Object.entries(serviceToggleLabels).map(([serviceKey, label]) => (
                    <label
                      key={serviceKey}
                      className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300"
                    >
                      <input
                        type="checkbox"
                        name={serviceKey}
                        checked={scenario.services[serviceKey]}
                        onChange={handleServiceToggle}
                        className="h-4 w-4 rounded border-white/20 bg-transparent text-primary-400 focus:ring-primary-400"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel-scroll-y space-y-4">
              <div className="metric-card p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">2. Recommended stack</p>
                <h4 className="mt-4 text-2xl font-semibold text-white">{recommended.provider}</h4>
                <p className="mt-3 text-sm leading-7 text-gray-400">{recommended.summary}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">Estimated monthly</p>
                    <p className="mt-3 text-2xl font-semibold text-white">${recommended.monthlyEstimate.toLocaleString()}</p>
                    <p className="mt-2 text-xs leading-6 text-gray-500">Directional only, sized for the chosen scenario.</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">Fit score</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{recommended.fitScore}/100</p>
                    <p className="mt-2 text-xs leading-6 text-gray-500">{recommended.verdict}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">Ops burden</p>
                    <p className="mt-3 text-lg font-semibold text-white">{recommended.opsLabel}</p>
                    <p className="mt-2 text-xs leading-6 text-gray-500">{recommended.modelLabel}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">Best handoff</p>
                    <p className="mt-3 text-lg font-semibold text-white">
                      {discussOfferPresets[recommended.recommendedOffer].optionLabel}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-gray-500">{recommended.portabilityLabel}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {recommended.reasons.map((reason) => (
                    <div
                      key={reason}
                      className="flex gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-gray-300"
                    >
                      <FaCheckCircle className="mt-1 text-xs text-cyan-300" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">What this pack is doing</p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                  <p>It turns the recommendation into a human-readable services listing plus a machine-readable manifest.</p>
                  <p>The cloud account stays yours. The leverage comes from the workload model, module choices, and rollout path.</p>
                  <p>That makes it sellable immediately as a review or as a one-time deployment pack without pretending a full control plane already exists.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-200">3. Compare the shortlist</p>
                <h4 className="mt-3 text-2xl font-semibold text-white">The recommendation should be explainable.</h4>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-gray-400">
                This is not a single “cheapest provider” gimmick. It is a tradeoff view across monthly run cost, ops load,
                resilience posture, and portability.
              </p>
            </div>

            <div className="content-scroller">
              {plan.recommendations.map((recommendation) => (
                <div key={recommendation.id} className="content-scroller-card">
                  <article
                    className={`h-full rounded-[1.4rem] border p-5 ${
                      recommendation.verdict === 'Recommended'
                        ? 'border-primary-500/30 bg-primary-500/10'
                        : 'border-white/10 bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">
                          {recommendation.verdict}
                        </p>
                        <h5 className="mt-3 text-lg font-semibold text-white">{recommendation.provider}</h5>
                      </div>
                      <span className="skill-badge !px-3 !py-1.5 !text-xs">{recommendation.fitScore}/100</span>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-gray-400">{recommendation.stackTitle}</p>

                    <div className="mt-4 grid gap-3">
                      <div className="rounded-[1rem] border border-white/10 bg-dark-900/40 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Monthly estimate</p>
                        <p className="mt-2 text-lg font-semibold text-white">${recommendation.monthlyEstimate.toLocaleString()}</p>
                      </div>
                      <div className="rounded-[1rem] border border-white/10 bg-dark-900/40 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Ops and resilience</p>
                        <p className="mt-2 text-sm font-medium text-white">{recommendation.opsLabel}</p>
                        <p className="mt-1 text-xs text-gray-500">{recommendation.resilienceLabel}</p>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] xl:items-start">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-200">4. Services listing</p>
                  <h4 className="mt-3 text-2xl font-semibold text-white">Bill of materials for the recommended stack</h4>
                </div>
                <p className="max-w-xl text-sm leading-7 text-gray-400">
                  This is the approval surface after the generator: what will exist, why it exists, who owns it, and
                  where the monthly bill likely lands.
                </p>
              </div>

              <div className="mt-6 overflow-hidden rounded-[1.35rem] border border-white/10">
                <div className="hidden bg-white/[0.03] px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500 md:grid md:grid-cols-[0.9fr_1.35fr_1.1fr_0.7fr_0.65fr]">
                  <span>Service</span>
                  <span>Selection</span>
                  <span>Control</span>
                  <span>Portability</span>
                  <span>Monthly</span>
                </div>

                <div className="panel-scroll-soft">
                  {recommended.serviceRows.map((row) => (
                    <div
                      key={row.category}
                      className="grid gap-2 border-t border-white/10 px-4 py-4 md:grid-cols-[0.9fr_1.35fr_1.1fr_0.7fr_0.65fr] md:items-start"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200 md:hidden">Service</p>
                        <p className="text-sm font-semibold text-white">{row.category}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200 md:hidden">Selection</p>
                        <p className="text-sm leading-7 text-gray-300">{row.selection}</p>
                        <p className="mt-2 text-xs leading-6 text-gray-500">{row.reason}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200 md:hidden">Control</p>
                        <p className="text-sm leading-7 text-gray-300">{row.control}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200 md:hidden">Portability</p>
                        <p className="text-sm leading-7 text-gray-300">{row.portability}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-200 md:hidden">Monthly</p>
                        <p className="text-sm font-semibold text-white">${row.monthly.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="metric-card p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Generated pack includes</p>
              <h4 className="mt-4 text-2xl font-semibold text-white">Artifacts that make the handoff real.</h4>
              <div className="panel-scroll-soft mt-6 space-y-3">
                {recommended.generatedFiles.map((file) => (
                  <div
                    key={file.path}
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-gray-300"
                  >
                    <p className="font-semibold text-white">{file.path}</p>
                    <p className="mt-2 text-gray-400">{file.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-200">5. IaC preview</p>
                <h4 className="mt-3 text-2xl font-semibold text-white">Preview the generated output before you ask for delivery.</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {previewModes.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setPreviewMode(mode.value)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      previewMode === mode.value
                        ? 'border-primary-500/40 bg-primary-500/10 text-white'
                        : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-primary-500/20 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {previewMode === 'files' ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {recommended.generatedFiles.map((file) => (
                  <div key={file.path} className="rounded-[1.2rem] border border-white/10 bg-dark-900/50 p-4">
                    <div className="flex items-center gap-3">
                      <FaLayerGroup className="text-primary-300" />
                      <p className="text-sm font-semibold text-white">{file.path}</p>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-gray-400">{file.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="panel-code-block mt-6 rounded-[1.35rem] border border-white/10 bg-[#040916]/90 p-5 text-xs leading-6 text-gray-200">
                <code>{selectedPreview}</code>
              </pre>
            )}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div
              className={`metric-card p-6 sm:p-7 ${
                recommended.recommendedOffer === 'review' ? 'ring-1 ring-primary-400/40' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Scoped handoff</p>
                  <h4 className="mt-4 text-2xl font-semibold text-white">{reviewOffer.optionLabel}</h4>
                </div>
                {recommended.recommendedOffer === 'review' ? <span className="skill-badge">Recommended</span> : null}
              </div>
              <p className="mt-4 text-sm leading-8 text-gray-400">{reviewOffer.summaryText}</p>
              <Link
                to={createDiscussUrl('cloud-fit-deployment', { intent: 'scope', offer: 'review' })}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                Book the architecture review
                <FaArrowRight className="text-xs" />
              </Link>
            </div>

            <div
              className={`metric-card p-6 sm:p-7 ${
                recommended.recommendedOffer === 'deploy-pack' ? 'ring-1 ring-cyan-400/40' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">One-time delivery</p>
                  <h4 className="mt-4 text-2xl font-semibold text-white">{deployPackOffer.optionLabel}</h4>
                </div>
                {recommended.recommendedOffer === 'deploy-pack' ? <span className="skill-badge">Recommended</span> : null}
              </div>
              <p className="mt-4 text-sm leading-8 text-gray-400">{deployPackOffer.summaryText}</p>
              <Link
                to={createDiscussUrl('cloud-fit-deployment', { intent: 'scope', offer: 'deploy-pack' })}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white transition-colors hover:border-primary-500/30 hover:bg-white/[0.05]"
              >
                Request the one-time deploy pack
                <FaCode className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CloudFitPlanner
