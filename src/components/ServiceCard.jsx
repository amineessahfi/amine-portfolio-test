import React from 'react'
import { Link } from 'react-router-dom'

function ServiceCard({ service }) {
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

      <Link
        to={`/services/${service.slug}`}
        className="relative z-10 mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary-200 transition-colors hover:text-white"
      >
        View service
        <span aria-hidden="true">more</span>
      </Link>
    </article>
  )
}

export default ServiceCard
