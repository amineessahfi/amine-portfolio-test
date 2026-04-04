import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { EMAIL_URL } from '../constants/links'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
]

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-dark-700/80 bg-dark-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-500/50 bg-primary-500/10 text-primary-300">
            AE
          </span>
          <span className="hidden sm:inline">Amine Essahfi</span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1 rounded-full border border-dark-700/80 bg-dark-800/70 p-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <a
            href={EMAIL_URL}
            className="hidden rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 md:inline-flex"
          >
            Discuss a project
          </a>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
