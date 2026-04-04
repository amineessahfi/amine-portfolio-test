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
      <div className="rounded-[2rem] border border-dark-600 bg-gradient-to-r from-dark-800 to-dark-700 px-6 py-8 shadow-2xl shadow-black/20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-300">Contact</p>
            <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Ready to Build Your Platform?</h3>
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              Let&apos;s discuss how platform engineering can accelerate your development teams.
            </p>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2">
            <a 
              href={LINKEDIN_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-700"
            >
              <FaLinkedin /> Connect on LinkedIn
            </a>
            
            <a 
              href={GITHUB_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-700"
            >
              <FaGithub /> View GitHub
            </a>
            
            <a 
              href={EMAIL_URL}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-medium transition-colors hover:bg-primary-700"
            >
              <FaEnvelope /> Email Me
            </a>
            
            <a
              href={RESUME_REQUEST_URL}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium transition-colors hover:bg-green-700"
            >
              <FaFileDownload /> Request Resume
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-dark-600 pt-6">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            <div className="metric-card p-4">
              <div className="text-2xl font-bold text-primary-400">5+</div>
              <div className="text-sm text-gray-400">Years Experience</div>
            </div>
            <div className="metric-card p-4">
              <div className="text-2xl font-bold text-green-400">30%+</div>
              <div className="text-sm text-gray-400">Cost Savings</div>
            </div>
            <div className="metric-card p-4">
              <div className="text-2xl font-bold text-cyan-400">100+</div>
              <div className="text-sm text-gray-400">Nodes Managed</div>
            </div>
            <div className="metric-card p-4">
              <div className="text-2xl font-bold text-purple-400">24/7</div>
              <div className="text-sm text-gray-400">Platform Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaBar
