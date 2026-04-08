import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'
import { ARCHITECTURE_STACK_ROUTE } from './constants/routes'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import ServiceDemoPage from './pages/ServiceDemoPage'
import ArchitecturePage from './pages/ArchitecturePage'
import DiscussProjectPage from './pages/DiscussProjectPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
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
  )
}

export default App
