import React from 'react'
import { Link } from 'react-router-dom'
import { COST_REVIEW_ROUTE, LIVE_SANDBOX_ROUTE, createServiceRoute } from '../constants/routes'

const demoRoutes = {
  'cloud-cost-optimization': COST_REVIEW_ROUTE,
  'live-terminal-sandbox': LIVE_SANDBOX_ROUTE,
}

function ServiceCard({ service }) {
  const demoRoute = demoRoutes[service.slug]

  return (
    <article className="card-hover relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_18px_60px_rgba(2,6,23,0.2)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.12),transparent_34%)]" />
      <div className="relative z-10">
        <span className="section-chip">{service.eyebrow}</span>
      </div>
      <h3 className="relative z-10 mt-5 text-2xl font-semibold text-white">{service.title}</h3>
      <p className="relative z-10 mt-4 flex-1 text-sm leading-8 text-gray-400">{service.summary}</p>

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
          Open route
        </Link>
        {demoRoute ? (
          <Link
            to={demoRoute}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-gray-300 transition-colors hover:text-white"
          >
            Open demo
          </Link>
        ) : null}
      </div>
    </article>
  )
}

export default ServiceCard
