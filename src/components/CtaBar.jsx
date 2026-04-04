import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaEnvelope, FaFileDownload, FaGithub, FaLinkedin, FaTerminal } from 'react-icons/fa'
import {
  EMAIL_URL,
  GITHUB_URL,
  LINKEDIN_URL,
  RESUME_REQUEST_URL,
} from '../constants/links'
import { AWS_CALCULATOR_ROUTE, LIVE_SANDBOX_ROUTE, createDiscussUrl } from '../constants/routes'

function CtaBar() {
  return (
    <section id="contact" className="scroll-mt-24">
      <div className="hero-shell px-6 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div className="max-w-xl">
            <span className="section-chip">Next step</span>
            <h3 className="section-title text-3xl sm:text-4xl">Ready to turn curiosity into a scoped project conversation?</h3>
            <p className="section-copy">
              Use the platform the same way I want your visitors to use yours: hit the route that matches the problem, try the proof point, then move into a deliberate conversation once the fit is obvious.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link to={createDiscussUrl()} className="primary-button gap-2">
              <FaArrowRight />
              Start a project conversation
            </Link>

            <Link to={LIVE_SANDBOX_ROUTE} className="secondary-button gap-2">
              <FaTerminal />
              Try the live sandbox
            </Link>

            <Link to={AWS_CALCULATOR_ROUTE} className="secondary-button gap-2">
              <FaEnvelope />
              Run the AWS savings model
            </Link>

            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="secondary-button gap-2">
              <FaLinkedin />
              Connect on LinkedIn
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
          <a href={EMAIL_URL} className="soft-link">
            Email directly
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="soft-link">
            View GitHub
          </a>
          <a href={RESUME_REQUEST_URL} className="soft-link">
            Request resume
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="soft-link">
            LinkedIn
          </a>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            <div className="metric-card p-4">
              <div className="text-2xl font-semibold text-white">5+</div>
              <div className="mt-2 text-sm text-gray-400">Years Experience</div>
            </div>
            <div className="metric-card p-4">
              <div className="text-2xl font-semibold text-white">30%+</div>
              <div className="mt-2 text-sm text-gray-400">Cost Savings</div>
            </div>
            <div className="metric-card p-4">
              <div className="text-2xl font-semibold text-white">100+</div>
              <div className="mt-2 text-sm text-gray-400">Nodes Managed</div>
            </div>
            <div className="metric-card p-4">
              <div className="text-2xl font-semibold text-white">24/7</div>
              <div className="mt-2 text-sm text-gray-400">Operational Ownership</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaBar
