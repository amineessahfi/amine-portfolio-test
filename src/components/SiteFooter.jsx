import React from 'react'
import { Link } from 'react-router-dom'
import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL } from '../constants/links'

function SiteFooter() {
  return (
    <footer className="border-t border-dark-800 py-8 text-center text-sm text-dark-400">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Amine Essahfi. Platform Engineer & Data Infrastructure Specialist.</p>
        <p>Built with React, Tailwind CSS, and deployed on Vercel.</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary-400">
            GitHub
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary-400">
            LinkedIn
          </a>
          <a href={EMAIL_URL} className="transition-colors hover:text-primary-400">
            Email
          </a>
          <Link to="/architecture" className="transition-colors hover:text-primary-400">
            Architecture
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
