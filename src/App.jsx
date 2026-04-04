import React from 'react'
import Hero from './components/Hero'
import TerminalCard from './components/TerminalCard'
import CostCalculator from './components/CostCalculator'
import PortfolioProjects from './components/PortfolioProjects'
import CtaBar from './components/CtaBar'
import { EMAIL_URL, GITHUB_URL, LINKEDIN_URL } from './constants/links'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-gray-100">
      <Hero />
      
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 sm:gap-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <TerminalCard />
          <CostCalculator />
        </div>
        
        <PortfolioProjects />
        <CtaBar />
      </main>
      
      <footer className="border-t border-dark-800 py-8 text-center text-dark-400 text-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Amine Essahfi. Platform Engineer & Data Infrastructure Specialist.</p>
          <p>Built with React, Tailwind CSS, and deployed on Vercel.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
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
