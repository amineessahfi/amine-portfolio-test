import React from 'react'
import Hero from '../components/Hero'
import ServicesOverview from '../components/ServicesOverview'
import DemoShowcase from '../components/DemoShowcase'
import PortfolioProjects from '../components/PortfolioProjects'
import SectionScroller from '../components/SectionScroller'

const homeSectionItems = [
  { id: 'home-services', label: 'Services' },
  { id: 'home-proof', label: 'Proof' },
  { id: 'projects', label: 'Projects' },
]

function HomePage() {
  return (
    <>
      <Hero />
      <SectionScroller items={homeSectionItems} label="Browse homepage sections" />

      <main className="page-shell lg:gap-12">
        <ServicesOverview
          eyebrow="Service lines"
          title="When the problem is real, move into the service that matches it"
          intro="Use live proof when you want technical trust first. Use the service page when you already need a diagnostic, redesign, or implementation path."
          showDirectoryLink
          sectionId="home-services"
        />

        <DemoShowcase />

        <PortfolioProjects />
      </main>
    </>
  )
}

export default HomePage
