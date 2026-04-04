import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { createDiscussUrl } from '../constants/routes'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/architecture', label: 'Architecture' },
]

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-[#050816]/72 px-4 py-3 shadow-[0_18px_50px_rgba(2,6,23,0.42)] backdrop-blur-2xl">
        <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary-400/25 bg-gradient-to-br from-primary-500/18 to-cyan-400/18 font-display text-sm tracking-[0.18em] text-white shadow-[0_10px_30px_rgba(37,99,235,0.18)]">
            AE
          </span>
          <span className="hidden font-display text-base tracking-[-0.03em] sm:inline">Amine Essahfi</span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-dark-900 shadow-[0_10px_24px_rgba(255,255,255,0.12)]'
                      : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link to={createDiscussUrl()} className="primary-button hidden px-4 py-2.5 md:inline-flex">
            Start a project
          </Link>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
