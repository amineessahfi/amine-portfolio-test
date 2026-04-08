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
          title="Start with the service that matches the pressure point"
          intro="Use the homepage to orient quickly, then move into the service page with the closest fit once the bottleneck is clear."
          showDirectoryLink
        />

        <DemoShowcase />

        <PortfolioProjects />
      </main>
    </>
  )
}

export default HomePage
