import React from 'react'
import { Link } from 'react-router-dom'
import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL } from '../constants/links'
import { createDiscussUrl } from '../constants/routes'

function SiteFooter() {
  return (
    <footer className="pb-10 pt-2 text-sm text-dark-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] px-6 py-6 shadow-[0_20px_60px_rgba(2,6,23,0.3)] backdrop-blur-xl sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-display text-xl text-white">Amine Essahfi</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-400">
                Platform engineer focused on premium delivery across cloud infrastructure, developer platforms, data systems, and telecom operations.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="soft-link">
                GitHub
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="soft-link">
                LinkedIn
              </a>
              <a href={EMAIL_URL} className="soft-link">
                Email
              </a>
              <Link to={createDiscussUrl()} className="soft-link">
                Discuss
              </Link>
              <Link to="/architecture" className="soft-link">
                Architecture
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.22em] text-gray-500 sm:text-sm sm:tracking-[0.26em]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>Built with React, Tailwind CSS, and Vercel</span>
              <span>© {new Date().getFullYear()} Amine Essahfi</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
