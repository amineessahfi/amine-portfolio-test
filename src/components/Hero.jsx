import React from 'react'
import { FaAws, FaDocker, FaKubernetes, FaTerraform, FaGitAlt, FaPython } from 'react-icons/fa'
import { SiDatabricks, SiApachekafka, SiPrometheus, SiGrafana } from 'react-icons/si'

function Hero() {
  const skills = [
    { name: 'AWS', icon: <FaAws className="text-orange-500" /> },
    { name: 'Kubernetes', icon: <FaKubernetes className="text-blue-500" /> },
    { name: 'Terraform', icon: <FaTerraform className="text-purple-500" /> },
    { name: 'Docker', icon: <FaDocker className="text-blue-400" /> },
    { name: 'Git', icon: <FaGitAlt className="text-orange-600" /> },
    { name: 'Python', icon: <FaPython className="text-yellow-500" /> },
    { name: 'Databricks', icon: <SiDatabricks className="text-red-500" /> },
    { name: 'Kafka', icon: <SiApachekafka className="text-black" /> },
    { name: 'Prometheus', icon: <SiPrometheus className="text-orange-400" /> },
    { name: 'Grafana', icon: <SiGrafana className="text-orange-600" /> },
  ]

  return (
    <header className="relative overflow-hidden pt-20 pb-16 px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-cyan-900/10"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Platform Engineer</span>
            <br />
            <span className="text-4xl md:text-6xl text-gray-300">with DataOps & Telco Specialization</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            I build internal developer platforms, data infrastructure, and edge computing solutions.
            Combining platform engineering with data pipeline expertise and telco infrastructure knowledge.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a 
              href="#projects" 
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-colors"
            >
              View Projects
            </a>
            <a 
              href="#contact" 
              className="px-8 py-3 border border-primary-600 text-primary-400 hover:bg-primary-900/30 rounded-lg font-semibold transition-colors"
            >
              Contact Me
            </a>
            <a 
              href="/resume.pdf" 
              className="px-8 py-3 border border-dark-700 text-gray-400 hover:bg-dark-800 rounded-lg font-semibold transition-colors"
            >
              Download Resume
            </a>
          </div>
        </div>
        
        {/* Skills showcase */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-300">Core Technologies</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-dark-800/50 border border-dark-700 rounded-lg hover:border-primary-500 transition-all duration-300 card-hover"
              >
                <span className="text-xl">{skill.icon}</span>
                <span className="font-medium">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center p-6 bg-dark-800/30 border border-dark-700 rounded-xl">
            <div className="text-3xl font-bold gradient-text">5+</div>
            <div className="text-gray-400 mt-2">Years Experience</div>
          </div>
          <div className="text-center p-6 bg-dark-800/30 border border-dark-700 rounded-xl">
            <div className="text-3xl font-bold gradient-text">50+</div>
            <div className="text-gray-400 mt-2">Projects Delivered</div>
          </div>
          <div className="text-center p-6 bg-dark-800/30 border border-dark-700 rounded-xl">
            <div className="text-3xl font-bold gradient-text">30%</div>
            <div className="text-gray-400 mt-2">Cost Optimization</div>
          </div>
          <div className="text-center p-6 bg-dark-800/30 border border-dark-700 rounded-xl">
            <div className="text-3xl font-bold gradient-text">AWS</div>
            <div className="text-gray-400 mt-2">Solutions Architect Certified</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero