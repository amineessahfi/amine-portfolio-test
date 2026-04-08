import React from 'react'
import { Link } from 'react-router-dom'
import { GITHUB_URL, LINKEDIN_URL, createDiscussEmailUrl } from '../constants/links'
import { LIVE_SANDBOX_ARCHITECTURE_ROUTE, createDiscussUrl } from '../constants/routes'

function SiteFooter() {
  return (
    <footer className="pb-10 pt-2 text-sm text-dark-400">
      <div className="page-frame">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] px-6 py-6 shadow-[0_20px_60px_rgba(2,6,23,0.3)] backdrop-blur-xl sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-display text-xl text-white">Amine Essahfi</p>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-400">
                Platform engineer focused on high-value delivery across runtime architecture, delivery systems, operational data, and telecom-grade tooling.
              </p>
            </div>

            <div className="w-full max-w-xl space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-200">Ready to scope the work?</p>
                <h3 className="mt-3 text-xl font-semibold text-white">Send the project brief first.</h3>
                <p className="mt-3 text-sm leading-7 text-gray-400">
                  The structured brief is the fastest handoff. It captures the context once, keeps the next step focused, and still preserves a direct-email fallback.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to={createDiscussUrl()} className="primary-button !px-4 !py-2.5">
                    Start project brief
                  </Link>
                  <Link to={LIVE_SANDBOX_ARCHITECTURE_ROUTE} className="secondary-button !px-4 !py-2.5">
                    Sandbox architecture
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
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
