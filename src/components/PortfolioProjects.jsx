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
    <section id="projects" className="terminal-window card-hover scroll-mt-24">
      <div className="terminal-header">
        <div className="text-sm text-gray-400">portfolio — projects — showcase</div>
      </div>
      
      <div className="terminal-content">
        <h3 className="text-xl font-semibold mb-6 gradient-text">Platform Engineering Projects</h3>
        
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="p-4 border border-dark-700 rounded-lg hover:border-primary-500 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold text-gray-100">{project.title}</h4>
                <span className="text-xs px-2 py-1 bg-primary-900/30 text-primary-300 rounded">
                  Platform Engineering
                </span>
              </div>
              
              <p className="text-gray-400 text-sm mb-3">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tech.map((tech, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-dark-700 text-gray-300 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="text-sm text-green-400">
                <span className="font-semibold">Impact:</span> {project.metrics}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-dark-700">
          <p className="text-sm text-gray-400">
            <span className="font-semibold">Note:</span> Detailed case studies available upon request. These projects demonstrate platform engineering, infrastructure automation, and data pipeline expertise.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PortfolioProjects
