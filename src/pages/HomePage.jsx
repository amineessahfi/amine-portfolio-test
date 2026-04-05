import React from 'react'
import Hero from '../components/Hero'
import ServicesOverview from '../components/ServicesOverview'
import TerminalCard from '../components/TerminalCard'
import DemoShowcase from '../components/DemoShowcase'
import PortfolioProjects from '../components/PortfolioProjects'

function HomePage() {
  return (
    <>
      <Hero />

      <main className="page-shell lg:gap-12">
        <ServicesOverview
          eyebrow="Service lines"
          title="Service pages built for inbound consulting work"
          intro="The homepage stays as the entry layer while each service route carries stronger positioning, sharper proof points, and a cleaner handoff into a real project conversation."
          showDirectoryLink
        />

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)]">
          <TerminalCard />
          <DemoShowcase />
        </div>

        <PortfolioProjects />
      </main>
    </>
  )
}

export default HomePage
