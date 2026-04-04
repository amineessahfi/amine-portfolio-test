import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaAws, FaDocker, FaGitAlt, FaPython } from 'react-icons/fa'
import { SiDatabricks, SiKubernetes, SiTerraform } from 'react-icons/si'
import { EMAIL_URL } from '../constants/links'

const expertisePillars = [
  {
    title: 'Platform engineering',
    description: 'Golden paths, internal developer platforms, and delivery guardrails that scale with engineering teams.',
  },
  {
    title: 'Cloud efficiency',
    description: 'AWS architecture decisions shaped around performance, cost visibility, and operational confidence.',
  },
  {
    title: 'Data and telecom systems',
    description: 'Pipeline-heavy systems, operational tooling, and infrastructure built for high-volume environments.',
  },
]

const metrics = [
  { value: '5+', label: 'Years across platform, cloud, and data delivery' },
  { value: '50+', label: 'Projects spanning platform and infrastructure work' },
  { value: '30%+', label: 'Savings identified in targeted cloud reviews' },
]

const tools = [
  { label: 'AWS', icon: <FaAws className="text-orange-400" /> },
  { label: 'Kubernetes', icon: <SiKubernetes className="text-sky-400" /> },
  { label: 'Terraform', icon: <SiTerraform className="text-violet-400" /> },
  { label: 'Docker', icon: <FaDocker className="text-cyan-400" /> },
  { label: 'Python', icon: <FaPython className="text-yellow-400" /> },
  { label: 'Git', icon: <FaGitAlt className="text-orange-500" /> },
  { label: 'Databricks', icon: <SiDatabricks className="text-red-400" /> },
]

function Hero() {
  return (
    <header className="px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="hero-shell px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] xl:items-start">
            <div className="relative z-10">
              <span className="section-chip">Platform engineering / cloud / data systems</span>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.32em] text-primary-200/90">
                Consulting offers shaped like products
              </p>
              <h1 className="section-title max-w-4xl text-4xl sm:text-5xl lg:text-[4.4rem] lg:leading-[1.02]">
                Build a stack that looks
                <span className="gradient-text"> deliberate</span>
                , ships faster, and feels premium end to end.
              </h1>
              <p className="section-copy max-w-2xl text-base sm:text-lg">
                I design developer platforms, cloud infrastructure, and data-heavy systems for teams that want cleaner architecture, stronger delivery workflows, and sharper technical positioning.
              </p>

              <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap">
                <Link to="/services" className="primary-button gap-2">
                  Explore services
                  <FaArrowRight className="text-xs" />
                </Link>
                <a href="#projects" className="secondary-button">
                  View delivery examples
                </a>
                <a href={EMAIL_URL} className="soft-link inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3">
                  Discuss a project
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="metric-card">
                    <p className="text-3xl font-semibold text-white sm:text-4xl">{metric.value}</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 space-y-5">
              <div className="metric-card p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Current positioning</p>
                <h2 className="mt-4 text-2xl font-semibold text-white sm:text-[2rem]">
                  Architecture, delivery, and operational polish in one offer.
                </h2>
                <p className="mt-4 text-sm leading-8 text-gray-400">
                  The site is structured to feel closer to a premium consulting studio than a developer portfolio, while still showing real technical depth and hands-on systems work.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                {expertisePillars.map((pillar) => (
                  <div key={pillar.title} className="metric-card p-5">
                    <p className="text-sm font-semibold text-white">{pillar.title}</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10 border-t border-white/10 pt-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-200">Core toolkit</p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                  Tools and platforms I reach for when I am building paved roads, cost-aware cloud setups, and reliable delivery foundations.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {tools.map((tool) => (
                  <span key={tool.label} className="skill-badge">
                    {tool.icon}
                    {tool.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
