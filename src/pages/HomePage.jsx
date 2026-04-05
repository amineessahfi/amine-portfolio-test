import React from 'react'
import Hero from '../components/Hero'
import ServicesOverview from '../components/ServicesOverview'
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

        <DemoShowcase />

        <PortfolioProjects />
      </main>
    </>
  )
}

export default HomePage
