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
          eyebrow="Core delivery work"
          title="The broader delivery work behind the proof-led entry points"
          intro="The live demos cover the proof-led surfaces. The wider delivery work still spans platform foundations, data systems, and telecom-grade operator tooling."
          showDirectoryLink
          featuredOnly
          sectionId="home-services"
        />

        <DemoShowcase />

        <PortfolioProjects />
      </main>
    </>
  )
}

export default HomePage
