import React from 'react'
import Hero from './components/Hero'
import TerminalCard from './components/TerminalCard'
import CostCalculator from './components/CostCalculator'
import PortfolioProjects from './components/PortfolioProjects'
import CtaBar from './components/CtaBar'
import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL } from './constants/links'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Hero />
      
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <TerminalCard />
          <CostCalculator />
        </div>
        
        <PortfolioProjects />
      </main>
      
      <CtaBar />
      
      <footer className="border-t border-dark-800 py-8 text-center text-dark-400 text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Amine Essahfi. Platform Engineer & Data Infrastructure Specialist.</p>
          <p className="mt-2">Built with React, Tailwind CSS, and deployed on Vercel.</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">GitHub</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">LinkedIn</a>
            <a href={EMAIL_URL} className="hover:text-primary-400 transition-colors">Email</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
