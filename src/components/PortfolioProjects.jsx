import React from 'react'

function PortfolioProjects() {
  const projects = [
    {
      title: "Semtech OTA Platform",
      description: "Internal developer platform for over-the-air updates across IoT devices.",
      tech: ["Kubernetes", "AWS", "Terraform", "Go"],
      metrics: "Reduced deployment time by 70%"
    },
    {
      title: "Data Insight Tools",
      description: "Real-time data pipeline and visualization platform for telco metrics.",
      tech: ["Python", "Apache Airflow", "PostgreSQL", "React"],
      metrics: "Processed 2TB+ daily data"
    },
    {
      title: "SIM Tooling Platform",
      description: "Management platform for SIM card provisioning and lifecycle.",
      tech: ["Docker", "Node.js", "MongoDB", "Redis"],
      metrics: "Managed 500k+ SIM cards"
    }
  ]

  return (
    <section id="projects" className="scroll-mt-24">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="text-sm text-gray-400">portfolio — projects — showcase</div>
        </div>
        
        <div className="terminal-content">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Selected work</p>
              <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Platform Engineering Projects</h3>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              Examples of platform, automation, and data engineering work with measurable impact across cloud infrastructure and telecom tooling.
            </p>
          </div>
          
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <article key={index} className="card-hover flex h-full flex-col rounded-2xl border border-dark-700/70 bg-dark-900/40 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-lg font-semibold text-gray-100">{project.title}</h4>
                  <span className="rounded-full bg-primary-900/30 px-3 py-1 text-xs font-medium text-primary-300">
                    Platform
                  </span>
                </div>
                
                <p className="mt-4 flex-1 text-sm leading-7 text-gray-400">{project.description}</p>
                
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="rounded-full bg-dark-700 px-3 py-1 text-xs text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="mt-6 border-t border-dark-700/70 pt-4 text-sm text-green-400">
                  <span className="font-semibold">Impact:</span> {project.metrics}
                </div>
              </article>
            ))}
          </div>
          
          <div className="border-t border-dark-700/70 pt-5">
            <p className="text-sm leading-7 text-gray-400">
              <span className="font-semibold text-gray-300">Note:</span> Detailed case studies are available on request for deeper architecture, automation, and delivery details.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PortfolioProjects
