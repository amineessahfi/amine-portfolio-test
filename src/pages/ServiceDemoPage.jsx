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
        eyebrow: 'Dedicated demo route',
        title: 'Run the live shell without the service page getting in the way.',
        intro:
          'This page is for judging the interactive terminal itself. The service page stays focused on delivery context; the shell, access, and guardrails stay focused here.',
        notes: [
          'Use this route when the terminal is the thing you want to evaluate.',
          'Use the service page when you want the delivery scope and fit around it.',
          'Move into architecture or discussion only after the shell has proven its value.',
        ],
        focusTitle: 'Why this lives separately',
        focusText:
          'The demo is easier to trust when the runtime, access policy, and session controls are not competing with a long service page.',
        primaryLabel: 'Back to service context',
        primaryTo: serviceRoute,
        secondaryLabel: 'Discuss this demo',
        secondaryTo: discussUrl,
        tertiaryLabel: 'View architecture',
        tertiaryTo: ARCHITECTURE_STACK_ROUTE,
      }
    : isCostDemo
      ? {
          eyebrow: 'Dedicated demo route',
          title: 'Run the savings model on a page built just for the review.',
          intro:
            'This page keeps the interactive model isolated so you can test the scenario cleanly. The service page stays responsible for delivery scope, fit, and the shape of the engagement.',
          notes: [
            'Use this route when you want to pressure-test the scenario inputs directly.',
            'Use the service page when you want the surrounding implementation context.',
            'Move into the discuss flow once the estimate feels close to the real spend pressure.',
          ],
          focusTitle: 'Why this lives separately',
          focusText:
            'The review model works better when the controls and outputs are not stacked in the middle of a longer service route.',
          primaryLabel: 'Back to service context',
          primaryTo: serviceRoute,
          secondaryLabel: 'Plan the cost review',
          secondaryTo: discussUrl,
        }
      : {
          eyebrow: 'Dedicated demo route',
          title: 'Shape the workflow, then open the restricted live studio.',
          intro:
            'This page isolates the workflow thinking, then hands authenticated visitors into a restricted live n8n studio. The service page stays focused on delivery scope and operating fit.',
          notes: [
            'Use this route when you want a safe preview plus access to the actual live editor.',
            'Use the service page when you want the implementation context around the automation layer.',
            'Move into the discuss flow once the orchestration pattern feels close to the real operating problem.',
          ],
          focusTitle: 'Why this lives separately',
          focusText:
            'Workflow design is easier to judge when the preview, access guardrails, and live studio launch are the primary focus instead of one section inside a longer page.',
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
              <div className="text-sm text-gray-400">demo — purpose</div>
            </div>

            <div className="terminal-content">
              <div>
                <span className="section-chip">How to use this page</span>
                <h2 className="section-title text-3xl sm:text-4xl">A focused page for the working proof point</h2>
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
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Route focus</p>
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
