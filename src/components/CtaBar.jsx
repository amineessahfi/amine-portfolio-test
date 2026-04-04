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
    <section id="contact" className="mt-12 scroll-mt-24">
      <div className="p-6 bg-gradient-to-r from-dark-800 to-dark-700 rounded-xl border border-dark-600">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 gradient-text">Ready to Build Your Platform?</h3>
            <p className="text-gray-400">
              Let&apos;s discuss how platform engineering can accelerate your development teams.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <a 
              href={LINKEDIN_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              <FaLinkedin /> Connect on LinkedIn
            </a>
            
            <a 
              href={GITHUB_URL}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              <FaGithub /> View GitHub
            </a>
            
            <a 
              href={EMAIL_URL}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors"
            >
              <FaEnvelope /> Email Me
            </a>
            
            <a
              href={RESUME_REQUEST_URL}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
            >
              <FaFileDownload /> Request Resume
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-dark-600">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-400">5+</div>
              <div className="text-sm text-gray-400">Years Experience</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">30%+</div>
              <div className="text-sm text-gray-400">Cost Savings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">100+</div>
              <div className="text-sm text-gray-400">Nodes Managed</div>
            </div>
            <div>
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
