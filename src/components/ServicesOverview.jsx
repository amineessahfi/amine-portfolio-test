import React from 'react'
import { Link } from 'react-router-dom'
import { services } from '../data/services'
import ServiceCard from './ServiceCard'

function ServicesOverview({
  eyebrow = 'Services',
  title = 'Service lines built to generate qualified work',
  intro = 'Clear service pages make it easier for visitors to understand what you offer, what problems you solve, and how to start a conversation.',
  showDirectoryLink = false,
}) {
  return (
    <section>
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="text-sm text-gray-400">services - directory</div>
        </div>

        <div className="terminal-content">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="section-chip">{eyebrow}</span>
              <h2 className="section-title text-3xl sm:text-4xl">{title}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">{intro}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>

          {showDirectoryLink ? (
            <div className="border-t border-white/10 pt-5">
              <Link
                to="/services"
                className="secondary-button"
              >
                Browse all service pages
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ServicesOverview
