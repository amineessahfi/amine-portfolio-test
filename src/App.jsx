import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'
import RouteLoadingState from './components/RouteLoadingState'
import { ARCHITECTURE_STACK_ROUTE } from './constants/routes'
import HomePage from './pages/HomePage'

const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))
const ServiceDemoPage = lazy(() => import('./pages/ServiceDemoPage'))
const ArchitecturePage = lazy(() => import('./pages/ArchitecturePage'))
const DiscussProjectPage = lazy(() => import('./pages/DiscussProjectPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  return (
    <Suspense fallback={<RouteLoadingState />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/live-terminal-sandbox/architecture" element={<ArchitecturePage />} />
          <Route path="services/:serviceSlug/demo" element={<ServiceDemoPage />} />
          <Route path="services/:serviceSlug" element={<ServiceDetailPage />} />
          <Route path="architecture" element={<Navigate to={ARCHITECTURE_STACK_ROUTE} replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="discuss" element={<DiscussProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
