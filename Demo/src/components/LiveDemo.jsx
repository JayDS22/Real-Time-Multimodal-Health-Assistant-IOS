import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Send, Activity, Brain, Eye, Sparkles, Pause, Play } from 'lucide-react'
import PoseDemo from './PoseDemo'
import VitalsStream from './VitalsStream'
import ChatDemo from './ChatDemo'

export default function LiveDemo() {
  const [activeModality, setActiveModality] = useState('multimodal')

  const modalities = [
    { id: 'vision', label: 'Vision', icon: Eye, color: 'text-amber-400' },
    { id: 'voice', label: 'Voice', icon: Mic, color: 'text-rose-400' },
    { id: 'sensor', label: 'Sensor', icon: Activity, color: 'text-emerald-400' },
    { id: 'multimodal', label: 'Multimodal', icon: Sparkles, color: 'text-glow' },
  ]

  return (
    <section id="demo" className="relative py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <div className="text-xs font-mono text-glow uppercase tracking-[0.3em] mb-4">— Section 01 / Interactive</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-tight">
              <span className="italic font-light">Try it</span>
              <span className="text-glow italic"> live</span>
              <span className="text-zinc-500">.</span>
            </h2>
            <p className="text-mist max-w-md text-base leading-relaxed">
              Three modalities running concurrently. Switch between them or watch all of them fuse in real-time.
            </p>
          </div>
        </div>

        {/* Modality switcher */}
        <div className="flex flex-wrap gap-2 mb-8">
          {modalities.map(m => {
            const Icon = m.icon
            const isActive = activeModality === m.id
            return (
              <button
                key={m.id}
                onClick={() => setActiveModality(m.id)}
                className={`group flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
                  isActive 
                    ? 'glass-strong border-glow/40' 
                    : 'glass hover:border-white/20'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? m.color : 'text-mist'}`} />
                <span className={`text-sm font-medium ${isActive ? 'text-zinc-100' : 'text-mist'}`}>
                  {m.label}
                </span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-pulse animate-pulse" />
                )}
              </button>
            )
          })}
        </div>

        {/* Main demo area - 3 column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Pose estimation - large left panel */}
          <div className="lg:col-span-7">
            <PoseDemo active={['vision', 'multimodal'].includes(activeModality)} />
          </div>

          {/* Right column - vitals + chat stacked */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <VitalsStream active={['sensor', 'multimodal'].includes(activeModality)} />
            <ChatDemo active={['voice', 'multimodal'].includes(activeModality)} />
          </div>
        </div>
      </div>
    </section>
  )
}
