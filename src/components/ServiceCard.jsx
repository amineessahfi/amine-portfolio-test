import React from 'react'
import { Link } from 'react-router-dom'

function ServiceCard({ service }) {
  return (
    <article className="card-hover flex h-full flex-col rounded-2xl border border-dark-700/70 bg-dark-900/40 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">{service.eyebrow}</p>
      <h3 className="mt-3 text-xl font-semibold text-white">{service.title}</h3>
      <p className="mt-4 flex-1 text-sm leading-7 text-gray-400">{service.summary}</p>

      <ul className="mt-5 space-y-2 text-sm text-gray-300">
        {service.highlights.slice(0, 3).map((highlight) => (
          <li key={highlight} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      <Link
        to={`/services/${service.slug}`}
        className="mt-6 inline-flex w-fit items-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      >
        View service
      </Link>
    </article>
  )
}

export default ServiceCard
