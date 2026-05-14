import React, { useState, useEffect } from 'react'
import { Github, Activity } from 'lucide-react'

export default function Navigation({ activeSection, setActiveSection }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const sections = [
    { id: 'demo', label: 'Live Demo' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'metrics', label: 'Metrics' },
  ]

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'py-3' : 'py-5'
    }`}>
      <div className={`mx-4 sm:mx-8 transition-all duration-500 ${
        scrolled ? 'glass-strong rounded-full px-6 py-2.5' : 'px-4'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-glow to-flare flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute inset-0 rounded-lg bg-glow blur-md opacity-40" />
            </div>
            <div className="font-display text-xl italic tracking-tight">
              Pulse<span className="text-glow">.ai</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="px-4 py-2 text-sm text-mist hover:text-zinc-100 transition-colors rounded-full hover:bg-white/5"
              >
                {s.label}
              </button>
            ))}
          </div>

          <a
            href="https://github.com/JayDS22/Real-Time-Multimodal-Health-Assistant-IOS"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-all text-sm font-medium border border-white/10"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  )
}
