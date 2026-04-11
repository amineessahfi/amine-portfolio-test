import React from 'react'
import { Link } from 'react-router-dom'
import { createDiscussUrl } from '../constants/routes'

function PortfolioProjects() {
  const projects = [
    {
      title: 'Semtech OTA Platform',
      description: 'Internal developer platform for over-the-air updates across IoT devices.',
      tech: ['Kubernetes', 'AWS', 'Terraform', 'Go'],
      metrics: 'Reduced deployment time by 70%',
      topic: 'platform-engineering',
      ctaLabel: 'Scope similar platform work',
    },
    {
      title: 'Data Insight Tools',
      description: 'Real-time data pipeline and visualization platform for telco metrics.',
      tech: ['Python', 'Apache Airflow', 'PostgreSQL', 'React'],
      metrics: 'Processed 2TB+ daily data',
      topic: 'data-platforms',
      ctaLabel: 'Scope similar data work',
    },
    {
      title: 'SIM Tooling Platform',
      description: 'Management platform for SIM card provisioning and lifecycle.',
      tech: ['Docker', 'Node.js', 'MongoDB', 'Redis'],
      metrics: 'Managed 500k+ SIM cards',
      topic: 'telco-tooling',
      ctaLabel: 'Scope similar telecom tooling',
    },
  ]

  return (
    <section id="projects" className="scroll-mt-24">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="text-sm text-gray-400">portfolio - selected work</div>
        </div>

        <div className="terminal-content">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="section-chip">Selected work</span>
              <h3 className="section-title text-3xl sm:text-4xl">Delivery examples under real constraints</h3>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-gray-400 sm:text-base">
              A few representative examples across platform foundations, operational data, and telecom-grade tooling where the work had to ship, not just sound good.
            </p>
          </div>

          <div className="content-scroller">
            {projects.map((project, index) => (
              <div key={project.title} className="content-scroller-card">
                <article className="metric-card card-hover flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-lg font-semibold text-gray-100">{project.title}</h4>
                    <span className="section-chip !px-3 !py-1 !text-[10px]">
                      Platform
                    </span>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-8 text-gray-400">{project.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="skill-badge !px-3 !py-1.5 !text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4 text-sm text-primary-200">
                    <span className="font-semibold text-white">Impact:</span> {project.metrics}
                  </div>

                  <div className="mt-5">
                    <Link to={createDiscussUrl(project.topic, { intent: 'scope' })} className="secondary-button !rounded-xl !px-4 !py-2.5">
                      {project.ctaLabel}
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-sm leading-7 text-gray-400">
              <span className="font-semibold text-gray-300">Note:</span> Deeper case-study detail is available on request when you want the architecture tradeoffs, implementation shape, and delivery context behind the headline.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortfolioProjects
