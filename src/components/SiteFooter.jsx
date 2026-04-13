import React from 'react'
import { Link } from 'react-router-dom'
import { GITHUB_URL, LINKEDIN_URL, createDiscussEmailUrl } from '../constants/links'
import { LOGIN_ROUTE, SERVICES_DIRECTORY_ROUTE, createDiscussUrl } from '../constants/routes'

function SiteFooter() {
  return (
    <footer className="pb-10 pt-2 text-sm text-dark-400">
      <div className="page-frame">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-6 py-6 shadow-[0_20px_60px_rgba(2,6,23,0.3)] backdrop-blur-xl sm:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(24rem,0.92fr)]">
            <div>
              <p className="font-display text-xl text-white">Amine Essahfi</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
                Production-focused consulting across cloud fit, workflow systems, platform foundations, operational data, and telecom-heavy delivery work.
              </p>
              <p className="mt-5 text-xs uppercase tracking-[0.24em] text-gray-500">
                Strategy when needed. Implementation when it matters. Clear next steps either way.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Navigate</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Link to={SERVICES_DIRECTORY_ROUTE} className="soft-link">
                    Services
                  </Link>
                  <Link to={createDiscussUrl('', { intent: 'scope' })} className="soft-link">
                    Discuss a project
                  </Link>
                  <Link to={LOGIN_ROUTE} className="soft-link">
                    Access gated demos
                  </Link>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Contact & profiles</p>
                <div className="mt-4 flex flex-col gap-3">
                  <a href={createDiscussEmailUrl()} className="soft-link">
                    Email fallback
                  </a>
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="soft-link">
                    Code profile
                  </a>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="soft-link">
                    Professional profile
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.22em] text-gray-500 sm:text-sm sm:tracking-[0.26em]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span>Platform systems, operational data, and production-focused delivery</span>
              <span>© {new Date().getFullYear()} Amine Essahfi</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
