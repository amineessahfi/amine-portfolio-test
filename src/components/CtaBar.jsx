import React from 'react'
import { FaLinkedin, FaGithub, FaEnvelope, FaFileDownload } from 'react-icons/fa'
import {
  EMAIL_URL,
  GITHUB_URL,
  LINKEDIN_URL,
  RESUME_REQUEST_URL,
} from '../constants/links'

function CtaBar() {
  return (
    <section id="contact" className="scroll-mt-24">
      <div className="hero-shell px-6 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div className="max-w-xl">
            <span className="section-chip">Contact</span>
            <h3 className="section-title text-3xl sm:text-4xl">Ready to turn the site into real inbound work?</h3>
            <p className="section-copy">
              If you want the same level of technical polish in your platform, cloud footprint, or data workflows, I can help shape both the architecture and the implementation path.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-button gap-2"
            >
              <FaLinkedin /> Connect on LinkedIn
            </a>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-button gap-2"
            >
              <FaGithub /> View GitHub
            </a>

            <a
              href={EMAIL_URL}
              className="primary-button gap-2"
            >
              <FaEnvelope /> Email Me
            </a>

            <a
              href={RESUME_REQUEST_URL}
              className="secondary-button gap-2"
            >
              <FaFileDownload /> Request Resume
            </a>
          </div>
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
