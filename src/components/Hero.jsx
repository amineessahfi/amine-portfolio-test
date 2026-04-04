import React from 'react'
import { FaAws, FaDocker, FaGitAlt, FaPython } from 'react-icons/fa'
import { SiKubernetes, SiTerraform, SiDatabricks, SiApachekafka, SiPrometheus, SiGrafana } from 'react-icons/si'
import { RESUME_REQUEST_URL } from '../constants/links'

function Hero() {
  const skills = [
    { name: 'AWS', icon: <FaAws className="text-orange-500" /> },
    { name: 'Kubernetes', icon: <SiKubernetes className="text-blue-500" /> },
    { name: 'Terraform', icon: <SiTerraform className="text-purple-500" /> },
    { name: 'Docker', icon: <FaDocker className="text-blue-400" /> },
    { name: 'Git', icon: <FaGitAlt className="text-orange-600" /> },
    { name: 'Python', icon: <FaPython className="text-yellow-500" /> },
    { name: 'Databricks', icon: <SiDatabricks className="text-red-500" /> },
    { name: 'Kafka', icon: <SiApachekafka className="text-gray-100" /> },
    { name: 'Prometheus', icon: <SiPrometheus className="text-orange-400" /> },
    { name: 'Grafana', icon: <SiGrafana className="text-orange-600" /> },
  ]

  return (
    <header className="relative overflow-hidden px-4 pb-10 pt-14 sm:px-6 sm:pb-14 sm:pt-20 lg:px-8 lg:pt-24">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-cyan-900/10"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-dark-700/70 bg-dark-900/50 px-6 py-10 shadow-2xl shadow-black/20 backdrop-blur sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
              <span className="gradient-text">Platform Engineer</span>
              <span className="mt-4 block text-2xl text-gray-300 sm:text-3xl lg:text-5xl">
                with DataOps & Telco Specialization
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-gray-400 sm:text-lg lg:text-xl">
              I build internal developer platforms, data infrastructure, and edge computing solutions.
              Combining platform engineering with data pipeline expertise and telco infrastructure knowledge.
            </p>
            
            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap">
              <a 
                href="#projects" 
                className="inline-flex min-w-[11rem] justify-center rounded-xl bg-primary-600 px-6 py-3 font-semibold transition-colors hover:bg-primary-700"
              >
                View Projects
              </a>
              <a 
                href="#contact" 
                className="inline-flex min-w-[11rem] justify-center rounded-xl border border-primary-600 px-6 py-3 font-semibold text-primary-400 transition-colors hover:bg-primary-900/30"
              >
                Contact Me
              </a>
              <a 
                href={RESUME_REQUEST_URL}
                className="inline-flex min-w-[11rem] justify-center rounded-xl border border-dark-700 px-6 py-3 font-semibold text-gray-300 transition-colors hover:bg-dark-800"
              >
                Request Resume
              </a>
            </div>
          </div>

          <div className="mt-12 border-t border-dark-700/70 pt-10">
            <h2 className="text-center text-2xl font-semibold text-gray-200">Core Technologies</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="card-hover flex min-h-[72px] items-center gap-3 rounded-2xl border border-dark-700/70 bg-dark-800/40 px-4 py-3"
                >
                  <span className="text-xl">{skill.icon}</span>
                  <span className="font-medium text-gray-100">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="metric-card text-center">
              <div className="text-3xl font-bold gradient-text">5+</div>
              <div className="mt-2 text-sm text-gray-400">Years Experience</div>
            </div>
            <div className="metric-card text-center">
              <div className="text-3xl font-bold gradient-text">50+</div>
              <div className="mt-2 text-sm text-gray-400">Projects Delivered</div>
            </div>
            <div className="metric-card text-center">
              <div className="text-3xl font-bold gradient-text">30%</div>
              <div className="mt-2 text-sm text-gray-400">Cost Optimization</div>
            </div>
            <div className="metric-card text-center">
              <div className="text-3xl font-bold gradient-text">AWS</div>
              <div className="mt-2 text-sm text-gray-400">Solutions Architect Certified</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
