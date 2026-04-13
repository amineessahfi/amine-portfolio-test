import React from 'react'
import { Link } from 'react-router-dom'
import { CLOUD_FIT_ROUTE, LIVE_SANDBOX_ROUTE, WORKFLOW_COMPOSER_ROUTE, createServiceRoute } from '../constants/routes'

const demoRoutes = {
  'cloud-fit-deployment': CLOUD_FIT_ROUTE,
  'live-terminal-sandbox': LIVE_SANDBOX_ROUTE,
  'workflow-composer': WORKFLOW_COMPOSER_ROUTE,
}

function ServiceCard({ service, className = '' }) {
  const demoRoute = demoRoutes[service.slug]
  const typicalOutcome = service.snapshot.find((item) => item.label === 'Typical outcome')?.value

  return (
    <article className={`card-hover relative flex self-start flex-col overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_60px_rgba(2,6,23,0.2)] ${className}`.trim()}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.12),transparent_34%)]" />
      <div className="relative z-10">
        <span className="section-chip">{service.categoryLabel || service.eyebrow}</span>
      </div>
      <h3 className="relative z-10 mt-5 text-2xl font-semibold text-white">{service.title}</h3>
      <p className="relative z-10 mt-4 flex-1 text-sm leading-8 text-gray-400">{service.summary}</p>

      {typicalOutcome ? (
        <div className="relative z-10 mt-5 rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-200">Typical outcome</p>
          <p className="mt-2 text-sm text-gray-100">{typicalOutcome}</p>
        </div>
      ) : null}

      <ul className="relative z-10 mt-6 space-y-3 text-sm text-gray-300">
        {service.highlights.slice(0, 3).map((highlight) => (
          <li key={highlight} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      <div className="relative z-10 mt-8 flex flex-wrap gap-x-4 gap-y-2">
        <Link
          to={createServiceRoute(service.slug)}
          className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-200 transition-colors hover:text-white"
        >
          View service
        </Link>
        {demoRoute ? (
          <Link
            to={demoRoute}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-gray-300 transition-colors hover:text-white"
          >
            View proof
          </Link>
        ) : null}
      </div>
    </article>
  )
}

export default ServiceCard
