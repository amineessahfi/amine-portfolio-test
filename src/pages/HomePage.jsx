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
          title="When the problem is real, move into the service that matches it"
          intro="Use live proof when you want technical trust first. Use the service page when you already need a diagnostic, redesign, or implementation path."
          showDirectoryLink
        />

        <DemoShowcase />

        <PortfolioProjects />
      </main>
    </>
  )
}

export default HomePage
