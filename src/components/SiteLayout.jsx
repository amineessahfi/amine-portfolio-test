import React from 'react'
import { Outlet } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import CtaBar from './CtaBar'

function SiteLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-gray-100">
      <SiteHeader />
      <Outlet />
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <CtaBar />
      </div>
      <SiteFooter />
    </div>
  )
}

export default SiteLayout
