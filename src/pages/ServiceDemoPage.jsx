import React from 'react'
import { Link, useParams } from 'react-router-dom'
import CostCalculator from '../components/CostCalculator'
import SandboxTerminal from '../components/SandboxTerminal'
import WorkflowComposerDemo from '../components/WorkflowComposerDemo'
import { ARCHITECTURE_STACK_ROUTE, createDiscussUrl, createServiceRoute } from '../constants/routes'
import { getServiceBySlug } from '../data/services'
import NotFoundPage from './NotFoundPage'

function ServiceDemoPage() {
  const { serviceSlug } = useParams()
  const service = getServiceBySlug(serviceSlug)

  if (!service) {
    return <NotFoundPage />
  }

  const isSandboxDemo = service.slug === 'live-terminal-sandbox'
  const isCostDemo = service.slug === 'cloud-cost-optimization'
  const isWorkflowDemo = service.slug === 'workflow-composer'

  if (!isSandboxDemo && !isCostDemo && !isWorkflowDemo) {
    return <NotFoundPage />
  }

  const serviceRoute = createServiceRoute(service.slug)
  const discussUrl = createDiscussUrl(service.slug)
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
        secondaryTo: discussUrl,
        tertiaryLabel: 'View sandbox architecture',
        tertiaryTo: ARCHITECTURE_STACK_ROUTE,
      }
    : isCostDemo
      ? {
          eyebrow: 'Cost model',
          title: 'Model the savings pressure before you scope the cleanup.',
          intro:
            'Adjust the scenario inputs and see whether the savings case is strong enough to justify a targeted cost-efficiency engagement.',
          notes: [
            'Test whether the likely savings are directionally meaningful for your current spend profile.',
            'Check how easy it is to move from estimate to a concrete review conversation.',
            'Use the service page when you want the implementation context around the cleanup work itself.',
          ],
          focusTitle: 'What this should prove',
          focusText:
            'The model should make spend pressure and likely savings legible quickly enough to justify a real review.',
          primaryLabel: 'Back to service context',
          primaryTo: serviceRoute,
          secondaryLabel: 'Discuss the cost review',
          secondaryTo: discussUrl,
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
          secondaryTo: discussUrl,
        }

  return (
    <>
      <section className="page-hero">
        <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(18rem,0.96fr)] xl:items-start">
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
                <Link to={demoCopy.secondaryTo} className="primary-button">
                  {demoCopy.secondaryLabel}
                </Link>
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
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] xl:items-start">
          <div className="terminal-window">
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

          <div className="metric-card p-6 sm:p-7">
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

        {isSandboxDemo ? <SandboxTerminal /> : isCostDemo ? <CostCalculator /> : <WorkflowComposerDemo />}
      </main>
    </>
  )
}

export default ServiceDemoPage
