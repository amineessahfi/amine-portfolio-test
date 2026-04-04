import React from 'react'
import Hero from '../components/Hero'
import ServicesOverview from '../components/ServicesOverview'
import TerminalCard from '../components/TerminalCard'
import CostCalculator from '../components/CostCalculator'
import PortfolioProjects from '../components/PortfolioProjects'

function HomePage() {
  return (
    <>
      <Hero />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 sm:gap-10 sm:px-6 lg:gap-12 lg:px-8">
        <ServicesOverview
          eyebrow="Service lines"
          title="Service pages built for inbound consulting work"
          intro="This keeps the homepage as the entry point while giving each service a dedicated route, stronger positioning, and room for future lead capture."
          showDirectoryLink
        />

        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <TerminalCard />
          <CostCalculator />
        </div>

        <PortfolioProjects />
      </main>
    </>
  )
}

export default HomePage
