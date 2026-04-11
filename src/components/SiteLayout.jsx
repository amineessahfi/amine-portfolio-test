import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import CtaBar from './CtaBar'
import SiteChatbot from './SiteChatbot'

function SiteLayout() {
  const location = useLocation()
  const showGlobalCta =
    location.pathname === '/' ||
    location.pathname === '/services'

  useEffect(() => {
    const hash = decodeURIComponent(location.hash.replace('#', ''))

    if (!hash) {
      window.scrollTo({ top: 0, left: 0 })
      return undefined
    }

    let cancelled = false

    const scrollToTarget = (attempt = 0) => {
      const element = document.getElementById(hash)
      if (element) {
        element.scrollIntoView({ block: 'start' })
        return
      }

      if (!cancelled && attempt < 12) {
        window.setTimeout(() => scrollToTarget(attempt + 1), 60)
      }
    }

    scrollToTarget()

    return () => {
      cancelled = true
    }
  }, [location.pathname, location.hash])

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-primary-500/14 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-[26rem] w-[26rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <SiteHeader />
        <Outlet />
        {showGlobalCta ? (
          <div className="page-frame pb-16">
            <CtaBar />
          </div>
        ) : null}
        <SiteFooter />
        <SiteChatbot />
      </div>
    </div>
  )
}

export default SiteLayout
