import React, { useState, useEffect } from 'react'
import { ArrowDown, Cpu, Eye, Mic, Heart } from 'lucide-react'

export default function Hero() {
  const [heartRate, setHeartRate] = useState(72)
  const [steps, setSteps] = useState(8432)
  const [spo2, setSpo2] = useState(98)

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => Math.max(60, Math.min(85, prev + (Math.random() - 0.5) * 4)))
      setSteps(prev => prev + Math.floor(Math.random() * 3))
      setSpo2(prev => Math.max(95, Math.min(99, prev + (Math.random() - 0.5) * 0.5)))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-8 pt-24 pb-16">
      <div className="max-w-7xl mx-auto w-full">
        {/* Live status badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-pulse/30">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-pulse" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-pulse animate-ping" />
            </div>
            <span className="text-xs font-medium text-pulse tracking-wider uppercase">Live · On-Device · Zero-Cloud</span>
          </div>
        </div>

        {/* Main heading */}
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.95] tracking-tight mb-8">
            <span className="block italic font-light text-zinc-200">Health that</span>
            <span className="block">
              <span className="gradient-text italic">sees</span>
              <span className="text-zinc-400">, </span>
              <span className="gradient-text italic">hears</span>
              <span className="text-zinc-400">, </span>
              <span className="gradient-text italic">feels</span>
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-mist max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            A real-time multimodal iOS assistant fusing <span className="text-zinc-200">vision</span>,
            {' '}<span className="text-zinc-200">audio</span>, and <span className="text-zinc-200">motion</span> on
            quantized LLaMA-7B — entirely on your device.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16">
            <a
              href="#demo"
              onClick={(e) => { e.preventDefault(); document.getElementById('demo')?.scrollIntoView({behavior:'smooth'})}}
              className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-glow to-flare text-zinc-900 font-medium overflow-hidden glow-purple hover:scale-[1.02] transition-transform"
            >
              <span className="relative z-10 flex items-center gap-2">
                Try Live Demo
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </a>
            <a
              href="#architecture"
              onClick={(e) => { e.preventDefault(); document.getElementById('architecture')?.scrollIntoView({behavior:'smooth'})}}
              className="px-8 py-3.5 rounded-full glass-strong hover:bg-white/10 transition-colors font-medium"
            >
              View Architecture
            </a>
          </div>
        </div>

        {/* Floating metrics cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          <MetricCard
            icon={<Heart className="w-4 h-4" />}
            label="Heart Rate"
            value={Math.round(heartRate)}
            unit="bpm"
            color="from-rose-400 to-red-500"
            live
          />
          <MetricCard
            icon={<Cpu className="w-4 h-4" />}
            label="Inference"
            value="<100"
            unit="ms"
            color="from-cyan-400 to-blue-500"
          />
          <MetricCard
            icon={<Eye className="w-4 h-4" />}
            label="Pose FPS"
            value="30"
            unit="fps"
            color="from-amber-400 to-orange-500"
          />
          <MetricCard
            icon={<Mic className="w-4 h-4" />}
            label="Accuracy"
            value="93"
            unit="%"
            color="from-emerald-400 to-teal-500"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-mist">
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-mist to-transparent" />
      </div>
    </section>
  )
}

function MetricCard({ icon, label, value, unit, color, live }) {
  return (
    <div className="relative group">
      <div className="glass rounded-2xl p-4 sm:p-5 hover:border-white/20 transition-all relative overflow-hidden">
        {live && (
          <div className="absolute top-3 right-3 flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-pulse animate-pulse" />
            <span className="text-[9px] uppercase tracking-wider text-pulse font-medium">Live</span>
          </div>
        )}
        <div className={`inline-flex w-8 h-8 rounded-lg bg-gradient-to-br ${color} items-center justify-center mb-3 text-white`}>
          {icon}
        </div>
        <div className="text-mist text-xs uppercase tracking-wider mb-1.5 font-medium">{label}</div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-display italic">{value}</span>
          <span className="text-xs text-mist">{unit}</span>
        </div>
      </div>
    </div>
  )
}
