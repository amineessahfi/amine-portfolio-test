import React, { Suspense, lazy } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import IntakeTriggerButton from '../components/IntakeTriggerButton'
import { ARCHITECTURE_STACK_ROUTE, createServiceRoute } from '../constants/routes'
import { getServiceBySlug } from '../data/services'
import NotFoundPage from './NotFoundPage'

const CloudFitPlanner = lazy(() => import('../components/CloudFitPlanner'))
const SandboxTerminal = lazy(() => import('../components/SandboxTerminal'))
const WorkflowComposerDemo = lazy(() => import('../components/WorkflowComposerDemo'))

function ServiceDemoPage() {
  const { serviceSlug } = useParams()
  const location = useLocation()
  const service = getServiceBySlug(serviceSlug)

  if (!service) {
    return <NotFoundPage />
  }

  if (serviceSlug !== service.slug) {
    return <Navigate to={`${createServiceRoute(service.slug)}/demo${location.search}${location.hash}`} replace />
  }

  const isSandboxDemo = service.slug === 'live-terminal-sandbox'
  const isCloudFitDemo = service.slug === 'cloud-fit-deployment'
  const isWorkflowDemo = service.slug === 'workflow-composer'

  if (!isSandboxDemo && !isCloudFitDemo && !isWorkflowDemo) {
    return <NotFoundPage />
  }

  const serviceRoute = createServiceRoute(service.slug)
  const demoCopy = isSandboxDemo
    ? {
        eyebrow: 'Live sandbox',
        title: 'Test the live shell under real operating guardrails.',
        intro:
          'Launch a short-lived Linux shell, review the access flow, and judge whether the runtime feels trustworthy enough to use as a product proof point.',
        notes: [
          'Check how quickly the session becomes understandable to a first-time visitor.',
          'Look at the guardrails, expiry, and access flow as part of the value, not just the terminal itself.',
          'Use the sandbox architecture page when you want to inspect the control plane behind the experience.',
        ],
        focusTitle: 'What this should prove',
        focusText:
          'The experience should make the runtime boundaries, launch flow, and product value feel credible in minutes.',
        primaryLabel: 'Back to service context',
        primaryTo: serviceRoute,
        secondaryLabel: 'Discuss the sandbox build',
        secondaryTopic: service.slug,
        tertiaryLabel: 'View sandbox architecture',
        tertiaryTo: ARCHITECTURE_STACK_ROUTE,
      }
    : isCloudFitDemo
      ? {
          eyebrow: 'Cloud fit model',
          title: 'Compare the shortlist, inspect the stack, and choose the handoff.',
          intro:
            'Use the planner to describe the workload, rank the strongest provider fit, review the services listing, and pressure-test whether the next step should be the review or the one-time deploy pack.',
          notes: [
            'Check whether the recommendation explains both cost and ops burden instead of pretending the cheapest provider always wins.',
            'Review the services listing as the real approval surface after generation, not just the provider headline.',
            'Use the CTA fork to move either into the architecture review or straight into the one-time deployment ask.',
          ],
          focusTitle: 'What this should prove',
          focusText:
            'The model should turn a fuzzy infra debate into a believable shortlist, a concrete bill of materials, and a delivery-shaped next step.',
          primaryLabel: 'Back to service context',
          primaryTo: serviceRoute,
          secondaryLabel: 'Discuss the cloud fit',
          secondaryTopic: service.slug,
        }
      : {
          eyebrow: 'Workflow proof',
          title: 'Shape the flow, then use the restricted live studio in-page.',
          intro:
            'Use the preview builder to pressure-test triggers, branches, and approvals before loading the real constrained n8n studio inside the website.',
          notes: [
            'See whether the orchestration pattern is clear enough before you touch the live editor.',
            'Use the restricted studio when you want to validate the real surface under safe limits.',
            'Move into the discussion once the workflow shape feels close to the operating problem you need solved.',
          ],
          focusTitle: 'What this should prove',
          focusText:
            'The preview should show whether the workflow deserves implementation, while the live studio confirms that the editor surface can stay safely constrained.',
          primaryLabel: 'Back to service context',
          primaryTo: serviceRoute,
          secondaryLabel: 'Discuss this workflow',
          secondaryTopic: service.slug,
        }
  const DemoSurface = isSandboxDemo ? SandboxTerminal : isCloudFitDemo ? CloudFitPlanner : WorkflowComposerDemo

  return (
    <>
      <section className="page-hero">
        <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(18rem,0.96fr)] xl:items-start">
            <div className="relative z-10">
              <Link to={serviceRoute} className="soft-link inline-flex items-center gap-2">
                Back to service
              </Link>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">{demoCopy.eyebrow}</p>
              <h1 className="mt-3 max-w-4xl text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                {demoCopy.title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-8 text-gray-300 sm:text-base">{demoCopy.intro}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={demoCopy.primaryTo} className="secondary-button">
                  {demoCopy.primaryLabel}
                </Link>
                <IntakeTriggerButton topic={demoCopy.secondaryTopic} className="primary-button">
                  {demoCopy.secondaryLabel}
                </IntakeTriggerButton>
                {demoCopy.tertiaryTo ? (
                  <Link to={demoCopy.tertiaryTo} className="soft-link inline-flex items-center px-2 py-3">
                    {demoCopy.tertiaryLabel}
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
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-start">
          <div id="demo-guide" className="terminal-window scroll-mt-28">
            <div className="terminal-header">
              <div className="text-sm text-gray-400">demo — proof</div>
            </div>

            <div className="terminal-content">
              <div>
                <span className="section-chip">What to test</span>
                <h2 className="section-title text-3xl sm:text-4xl">Judge the proof point before you move into scope</h2>
              </div>

              <ol className="space-y-3">
                {demoCopy.notes.map((item, index) => (
                  <li key={item} className="flex gap-4 rounded-[1.35rem] border border-white/10 bg-white/[0.03] px-4 py-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-7 text-gray-300">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div id="demo-focus" className="metric-card scroll-mt-28 p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Proof focus</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">{demoCopy.focusTitle}</h2>
            <p className="mt-4 text-sm leading-8 text-gray-400">{demoCopy.focusText}</p>
            <div className="mt-6 space-y-3">
              {service.highlights.slice(0, 3).map((item) => (
                <div key={item} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-gray-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Suspense
          fallback={
            <section className="terminal-window">
              <div className="terminal-header">
                <div className="text-sm text-gray-400">demo — loading</div>
              </div>

              <div className="terminal-content">
                <p className="text-sm leading-7 text-gray-300">Preparing the proof surface for this route.</p>
              </div>
            </section>
          }
        >
          <DemoSurface />
        </Suspense>
      </main>
    </>
  )
}

export default ServiceDemoPage
