import React from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import AwsDataPipelineStudio from '../components/AwsDataPipelineStudio'
import IntakeTriggerButton from '../components/IntakeTriggerButton'
import {
  ARCHITECTURE_STACK_ROUTE,
  CLOUD_FIT_ROUTE,
  DATA_PIPELINE_DEMO_ROUTE,
  LIVE_SANDBOX_ROUTE,
  SERVICES_DIRECTORY_ROUTE,
  WORKFLOW_COMPOSER_ROUTE,
  createDiscussUrl,
  createServiceRoute,
} from '../constants/routes'
import { getServiceBySlug } from '../data/services'
import NotFoundPage from './NotFoundPage'

function ServiceDetailPage() {
  const { serviceSlug } = useParams()
  const location = useLocation()
  const service = getServiceBySlug(serviceSlug)

  if (!service) {
    return <NotFoundPage />
  }

  if (serviceSlug !== service.slug) {
    return <Navigate to={`${createServiceRoute(service.slug)}${location.search}${location.hash}`} replace />
  }

  const discussUrl = createDiscussUrl(service.slug)
  const isCloudFitService = service.slug === 'cloud-fit-deployment'
  const isDataPlatformService = service.slug === 'data-platforms'
  const isSandboxService = service.slug === 'live-terminal-sandbox'
  const isWorkflowService = service.slug === 'workflow-composer'
  const primaryCta = isSandboxService
    ? { label: 'Open the live sandbox', to: LIVE_SANDBOX_ROUTE }
    : isCloudFitService
      ? { label: 'Open the cloud fit model', to: CLOUD_FIT_ROUTE }
      : isWorkflowService
        ? { label: 'Open the workflow demo', to: WORKFLOW_COMPOSER_ROUTE }
        : isDataPlatformService
          ? { label: 'Open the low-cost AWS demo', to: DATA_PIPELINE_DEMO_ROUTE }
          : { label: 'Open the intake', type: 'intake', topic: service.slug }
  const secondaryCta = isSandboxService || isCloudFitService || isWorkflowService || isDataPlatformService
    ? {
        label: isWorkflowService
          ? 'Discuss the workflow build'
          : isCloudFitService
            ? 'Plan the cloud fit'
            : isDataPlatformService
              ? 'Plan the data build'
              : 'Discuss the sandbox build',
        type: 'intake',
        topic: service.slug,
      }
    : { label: 'Browse all services', to: SERVICES_DIRECTORY_ROUTE }
  const showArchitectureLink = isSandboxService
  const demoPanel = isSandboxService
    ? {
        eyebrow: 'Hands-on proof',
        title: 'Open the live sandbox when you want to judge the product moment itself',
        description:
          'The demo lets you test launch clarity, access, guardrails, and the short-lived runtime in one pass before moving into scope.',
        highlights: [
          'Five-minute Linux session with bounded runtime controls.',
          'Optional sign-in when you want identified repeat access.',
          'Published sandbox architecture for teams that need to understand the system behind the experience.',
        ],
        primaryLabel: 'Open the live demo',
        primaryTo: LIVE_SANDBOX_ROUTE,
        secondaryLabel: 'View sandbox architecture',
        secondaryTo: ARCHITECTURE_STACK_ROUTE,
        supportingEyebrow: 'What the demo proves',
        supportingTitle: 'It should feel trustworthy before it feels clever.',
        supportingText:
          'The value is in the combination of launch flow, runtime guardrails, and a clear explanation of how the system stays bounded.',
      }
    : isCloudFitService
      ? {
          eyebrow: 'Interactive proof',
          title: 'Open the cloud fit model when you need a fast path from shortlist to deploy pack',
          description:
            'Use the planner to capture the workload, compare providers, inspect the services listing, and decide whether the next step should be the review or the one-time deploy pack.',
          highlights: [
            'Compare provider fit across cost, ops load, and resilience tradeoffs.',
            'Review the services bill of materials after generation, not only the provider headline.',
            'Move into either the architecture review or the one-time deploy pack once the stack feels directionally right.',
          ],
          primaryLabel: 'Open the cloud fit demo',
          primaryTo: CLOUD_FIT_ROUTE,
          secondaryLabel: 'Plan the cloud fit',
          secondaryTo: discussUrl,
          supportingEyebrow: 'What the demo proves',
          supportingTitle: 'The stack decision should become deployable quickly.',
          supportingText:
            'The planner is meant to create a fast decision: keep iterating on the shortlist, or move straight into a real review or deployment package.',
        }
      : isWorkflowService
        ? {
            eyebrow: 'Interactive proof',
            title: 'Open the workflow demo when orchestration design is the clearest proof point',
            description:
              'Preview triggers, branches, approvals, and the restricted live studio so you can judge the operating pattern before building the real workflow surface.',
            highlights: [
              'Template-led preview for triggers, branching, and human checkpoints.',
              'Temporary five-minute launch into the restricted live n8n studio with no workflow persistence.',
              'A cleaner handoff into the discussion once the orchestration pattern feels right.',
            ],
            primaryLabel: 'Open the workflow demo',
            primaryTo: WORKFLOW_COMPOSER_ROUTE,
            secondaryLabel: 'Discuss the workflow build',
            secondaryTo: discussUrl,
            supportingEyebrow: 'What the demo proves',
            supportingTitle: 'The orchestration pattern should feel build-worthy.',
            supportingText:
              'The preview and live studio should make it obvious whether the workflow deserves implementation and where guardrails need to stay.',
          }
        : isDataPlatformService
          ? {
              eyebrow: 'Interactive proof',
              title: 'Open the low-cost AWS demo when you need a technical path that stays commercially sane',
              description:
                'Use the model to shape incremental extraction, S3 raw and curated zones, Parquet transforms, Athena serving, and lightweight orchestration before you commit to a heavier stack.',
              highlights: [
                'Incremental extraction, raw and curated S3 zones, and Parquet-first serving.',
                'Athena, EventBridge, SQS, and CloudWatch instead of jumping straight into heavier always-on services.',
                'A second mode dedicated to rescuing failing pipelines before redesigning the whole stack.',
              ],
              primaryLabel: 'Open the low-cost AWS demo',
              primaryTo: DATA_PIPELINE_DEMO_ROUTE,
              secondaryLabel: 'Plan the data build',
              secondaryTo: discussUrl,
              supportingEyebrow: 'What the demo proves',
              supportingTitle: 'The pipeline can stay technical without inflating the bill.',
              supportingText:
                'The value is in showing a serious AWS data path that still respects budget: replayable ingestion, curated Parquet datasets, cheap serving, and a clear upgrade path only when the workload truly demands it.',
            }
          : null

  return (
    <>
      <section className="page-hero">
        <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(18rem,0.96fr)] xl:items-start">
            <div className="relative z-10">
              <Link to={createServiceRoute()} className="soft-link inline-flex items-center gap-2">
                Back to services
              </Link>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">{service.eyebrow}</p>
              <h1 className="mt-3 max-w-4xl text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                {service.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-gray-300 sm:text-base">{service.summary}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                {primaryCta.type === 'intake' ? (
                  <IntakeTriggerButton topic={primaryCta.topic} className="primary-button">
                    {primaryCta.label}
                  </IntakeTriggerButton>
                ) : (
                  <Link to={primaryCta.to} className="primary-button">
                    {primaryCta.label}
                  </Link>
                )}
                {secondaryCta.type === 'intake' ? (
                  <IntakeTriggerButton topic={secondaryCta.topic} className="secondary-button">
                    {secondaryCta.label}
                  </IntakeTriggerButton>
                ) : (
                  <Link to={secondaryCta.to} className="secondary-button">
                    {secondaryCta.label}
                  </Link>
                )}
                {showArchitectureLink ? (
                  <Link to={ARCHITECTURE_STACK_ROUTE} className="soft-link inline-flex items-center px-2 py-3">
                    View architecture
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="relative z-10 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {service.snapshot.map((item) => (
                <div key={item.label} className="metric-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300">{item.label}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="page-shell">
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <section id="service-scope" className="terminal-window scroll-mt-28">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">service — scope</div>
            </div>

            <div className="terminal-content">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">What I deliver</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Scope and deliverables</h2>
              </div>

              <ul className="space-y-3 text-sm leading-7 text-gray-300">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex gap-3 rounded-2xl border border-dark-700/70 bg-dark-900/40 px-4 py-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="service-fit" className="terminal-window scroll-mt-28">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">service — fit</div>
            </div>

            <div className="terminal-content">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Best fit</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">When this service makes sense</h2>
              </div>

              <ul className="space-y-3 text-sm leading-7 text-gray-300">
                {service.bestFor.map((item) => (
                  <li key={item} className="flex gap-3 rounded-2xl border border-dark-700/70 bg-dark-900/40 px-4 py-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </section>

        {demoPanel ? (
          <section id="service-proof" className="terminal-window scroll-mt-28">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">demo — proof</div>
            </div>

            <div className="terminal-content">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-start">
                <div>
                  <span className="section-chip">{demoPanel.eyebrow}</span>
                  <h2 className="section-title text-3xl sm:text-4xl">{demoPanel.title}</h2>
                  <p className="section-copy">{demoPanel.description}</p>

                  <ul className="mt-6 space-y-3 text-sm leading-7 text-gray-300">
                    {demoPanel.highlights.map((item) => (
                      <li key={item} className="flex gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="metric-card p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">{demoPanel.supportingEyebrow}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{demoPanel.supportingTitle}</h3>
                  <p className="mt-4 text-sm leading-8 text-gray-400">{demoPanel.supportingText}</p>

                  <div className="mt-6 flex flex-col gap-3">
                    <Link to={demoPanel.primaryTo} className="primary-button justify-center">
                      {demoPanel.primaryLabel}
                    </Link>
                    <Link to={demoPanel.secondaryTo} className="secondary-button justify-center">
                      {demoPanel.secondaryLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {isDataPlatformService ? <AwsDataPipelineStudio /> : null}

        <section id="service-outcomes" className="terminal-window scroll-mt-28">
          <div className="terminal-header">
            <div className="text-sm text-gray-400">service — outcomes</div>
          </div>

          <div className="terminal-content">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Expected outcomes</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">What this engagement is designed to improve</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {service.outcomes.map((item) => (
                <div key={item} className="rounded-2xl border border-dark-700/70 bg-dark-900/40 p-5 text-sm leading-7 text-gray-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default ServiceDetailPage
