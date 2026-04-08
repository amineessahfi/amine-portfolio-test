import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LOGIN_ROUTE } from '../constants/routes'
import { useSiteAuth } from '../context/SiteAuthContext'

function SiteHeader() {
  const { authReady, authState } = useSiteAuth()
  const navItems = [
    { to: '/', label: 'Home', end: true },
    { to: '/services', label: 'Services' },
  ]
  const authLabel = !authReady
    ? 'Access'
    : authState.authenticated
      ? authState.user?.email || 'Account'
      : 'Access'

  return (
    <header className="sticky top-0 z-50 pt-4">
      <div className="page-frame">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.6rem] border border-white/10 bg-[#050816]/78 px-4 py-3.5 shadow-[0_18px_50px_rgba(2,6,23,0.42)] backdrop-blur-2xl sm:flex-nowrap sm:px-5">
          <Link to="/" className="flex items-center gap-3 text-sm font-semibold text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary-400/25 bg-gradient-to-br from-primary-500/18 to-cyan-400/18 font-display text-sm tracking-[0.18em] text-white shadow-[0_10px_30px_rgba(37,99,235,0.18)]">
              AE
            </span>
            <span className="hidden font-display text-base tracking-[-0.03em] sm:inline">Amine Essahfi</span>
          </Link>

          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
            <nav className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] [scrollbar-width:none]">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-all sm:px-4 sm:text-sm ${
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

            <NavLink
              to={LOGIN_ROUTE}
              className={({ isActive }) =>
                `inline-flex w-full items-center justify-center rounded-full border px-4 py-2.5 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:w-auto sm:max-w-[15rem] sm:justify-start ${
                  isActive
                    ? 'border-white/20 bg-white/[0.1] text-white'
                    : 'border-white/10 bg-white/[0.04] text-gray-200'
                }`
              }
            >
              <span className="truncate">{authLabel}</span>
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
