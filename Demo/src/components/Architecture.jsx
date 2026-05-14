import React from 'react'
import { Smartphone, Eye, Mic, Activity, Brain, Cpu, Layers, Zap } from 'lucide-react'

export default function Architecture() {
  return (
    <section id="architecture" className="relative py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <div className="text-xs font-mono text-flare uppercase tracking-[0.3em] mb-4">— Section 02 / Architecture</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-tight">
              <span className="italic font-light">Built</span>
              <span className="text-flare italic"> end-to-end</span>
              <span className="text-zinc-500">.</span>
            </h2>
            <p className="text-mist max-w-md text-base leading-relaxed">
              Five layers — from raw sensors to fused multimodal output. Every byte stays on device.
            </p>
          </div>
        </div>

        {/* Architecture diagram */}
        <div className="glass-strong rounded-3xl p-6 md:p-10 border border-white/10 relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />

          <div className="relative space-y-4">
            {/* Layer 1: Input Sensors */}
            <Layer
              title="01 / Sensor Layer"
              subtitle="Raw multimodal input streams"
              color="cyan"
            >
              <Node icon={<Eye className="w-4 h-4" />} label="ARKit Camera" sub="30 FPS · 1080p" color="from-cyan-400 to-blue-500" />
              <Node icon={<Mic className="w-4 h-4" />} label="Microphone" sub="16kHz PCM" color="from-cyan-400 to-blue-500" />
              <Node icon={<Activity className="w-4 h-4" />} label="IMU / CoreMotion" sub="50 Hz" color="from-cyan-400 to-blue-500" />
              <Node icon={<Smartphone className="w-4 h-4" />} label="HealthKit" sub="HR · HRV · SpO₂" color="from-cyan-400 to-blue-500" />
            </Layer>

            <Arrow />

            {/* Layer 2: Processing */}
            <Layer
              title="02 / Processing Layer"
              subtitle="On-device feature extraction"
              color="purple"
            >
              <Node icon={<Layers className="w-4 h-4" />} label="Vision Framework" sub="Pose detection" color="from-glow to-violet-500" />
              <Node icon={<Mic className="w-4 h-4" />} label="Speech Recognition" sub="SFSpeechRecognizer" color="from-glow to-violet-500" />
              <Node icon={<Activity className="w-4 h-4" />} label="Kalman Filter" sub="Sensor fusion" color="from-glow to-violet-500" />
              <Node icon={<Cpu className="w-4 h-4" />} label="Feature Engine" sub="Time/freq domain" color="from-glow to-violet-500" />
            </Layer>

            <Arrow />

            {/* Layer 3: ML Inference */}
            <Layer
              title="03 / ML Inference Layer"
              subtitle="CoreML models on Neural Engine"
              color="pink"
            >
              <Node icon={<Brain className="w-4 h-4" />} label="LLaMA-7B 4-bit" sub="<100ms latency" color="from-flare to-rose-500" highlight />
              <Node icon={<Eye className="w-4 h-4" />} label="Pose Model" sub="30 FPS · 17 joints" color="from-flare to-rose-500" />
              <Node icon={<Activity className="w-4 h-4" />} label="Activity Classifier" sub="93% accuracy" color="from-flare to-rose-500" />
              <Node icon={<Zap className="w-4 h-4" />} label="Form Analyzer" sub="Real-time scoring" color="from-flare to-rose-500" />
            </Layer>

            <Arrow />

            {/* Layer 4: Fusion */}
            <Layer
              title="04 / Multimodal Fusion"
              subtitle="Late-fusion aggregation & decision logic"
              color="green"
            >
              <Node icon={<Layers className="w-4 h-4" />} label="Context Builder" sub="Cross-modal alignment" color="from-pulse to-emerald-500" />
              <Node icon={<Brain className="w-4 h-4" />} label="Reasoning Pipeline" sub="LLM-augmented" color="from-pulse to-emerald-500" />
              <Node icon={<Cpu className="w-4 h-4" />} label="Response Synthesis" sub="Personalized output" color="from-pulse to-emerald-500" />
            </Layer>

            <Arrow />

            {/* Layer 5: UI */}
            <Layer
              title="05 / Presentation Layer"
              subtitle="SwiftUI · ARKit overlays · Speech synthesis"
              color="amber"
            >
              <Node icon={<Eye className="w-4 h-4" />} label="AR Overlay" sub="Real-time skeleton" color="from-amber-400 to-orange-500" />
              <Node icon={<Mic className="w-4 h-4" />} label="Voice Output" sub="AVSpeechSynth" color="from-amber-400 to-orange-500" />
              <Node icon={<Smartphone className="w-4 h-4" />} label="SwiftUI Views" sub="60 FPS · Adaptive" color="from-amber-400 to-orange-500" />
            </Layer>
          </div>

          {/* Privacy badge */}
          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pulse to-emerald-500 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-zinc-900" />
              </div>
              <div>
                <div className="font-medium">Zero-cloud architecture</div>
                <div className="text-xs text-mist">All inference runs locally on Apple Neural Engine</div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs font-mono text-mist">
              <Stat label="LATENCY" value="<100ms" color="text-pulse" />
              <Stat label="MEMORY" value="3.5GB" color="text-glow" />
              <Stat label="POWER" value="2.1W" color="text-flare" />
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-6 gap-3">
          {['Swift 5.9', 'SwiftUI', 'ARKit 6', 'CoreML', 'Vision', 'AVFoundation'].map(t => (
            <div key={t} className="glass rounded-full px-4 py-2 text-center text-xs font-mono text-mist">
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Layer({ title, subtitle, color, children }) {
  const colors = {
    cyan: 'border-cyan-500/20 bg-cyan-500/5',
    purple: 'border-glow/20 bg-glow/5',
    pink: 'border-flare/20 bg-flare/5',
    green: 'border-pulse/20 bg-pulse/5',
    amber: 'border-amber-500/20 bg-amber-500/5',
  }
  return (
    <div className={`rounded-2xl border ${colors[color]} p-5`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-1">
        <div>
          <div className="font-medium text-sm">{title}</div>
          <div className="text-xs text-mist mt-0.5">{subtitle}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {children}
      </div>
    </div>
  )
}

function Node({ icon, label, sub, color, highlight }) {
  return (
    <div className={`relative group ${highlight ? 'glow-purple' : ''}`}>
      <div className="bg-black/30 hover:bg-black/40 rounded-xl p-3 border border-white/5 hover:border-white/20 transition-all">
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white mb-2`}>
          {icon}
        </div>
        <div className="text-xs font-medium text-zinc-200 leading-tight">{label}</div>
        <div className="text-[10px] text-mist mt-0.5 font-mono">{sub}</div>
      </div>
    </div>
  )
}

function Arrow() {
  return (
    <div className="flex justify-center py-1">
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-px h-3 bg-gradient-to-b from-transparent to-mist/40" />
        <svg width="12" height="6" viewBox="0 0 12 6" fill="none">
          <path d="M6 6L0.803848 0L11.1962 0L6 6Z" fill="rgba(161, 161, 170, 0.4)"/>
        </svg>
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] uppercase tracking-wider text-mist">{label}</span>
      <span className={`${color} font-medium`}>{value}</span>
    </div>
  )
}
