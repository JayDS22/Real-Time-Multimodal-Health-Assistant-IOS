import React, { useState, useEffect } from 'react'
import Hero from './components/Hero'
import LiveDemo from './components/LiveDemo'
import Architecture from './components/Architecture'
import Metrics from './components/Metrics'
import Footer from './components/Footer'
import Navigation from './components/Navigation'

function App() {
  const [activeSection, setActiveSection] = useState('hero')

  return (
    <div className="min-h-screen bg-noir text-zinc-100 relative">
      {/* Background ambient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] rounded-full bg-glow/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-1/4 w-[600px] h-[600px] rounded-full bg-flare/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] rounded-full bg-pulse/5 blur-[120px]" />
      </div>

      {/* Noise grain overlay */}
      <div className="fixed inset-0 grain opacity-[0.015] pointer-events-none z-0" />

      <div className="relative z-10">
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
        <Hero />
        <LiveDemo />
        <Architecture />
        <Metrics />
        <Footer />
      </div>
    </div>
  )
}

export default App
