import React, { useState, useEffect, useRef } from 'react'
import { Heart, Wind, Activity, Droplets } from 'lucide-react'

export default function VitalsStream({ active }) {
  const [hr, setHr] = useState(72)
  const [spo2, setSpo2] = useState(98)
  const [hrv, setHrv] = useState(45)
  const [resp, setResp] = useState(16)
  const ecgCanvasRef = useRef(null)
  const ecgDataRef = useRef([])

  useEffect(() => {
    if (!active) return
    
    const interval = setInterval(() => {
      setHr(prev => Math.max(58, Math.min(95, prev + (Math.random() - 0.5) * 3)))
      setSpo2(prev => Math.max(95, Math.min(99, prev + (Math.random() - 0.5) * 0.6)))
      setHrv(prev => Math.max(30, Math.min(70, prev + (Math.random() - 0.5) * 2)))
      setResp(prev => Math.max(12, Math.min(20, prev + (Math.random() - 0.5) * 1.5)))
    }, 1200)

    return () => clearInterval(interval)
  }, [active])

  // ECG animation
  useEffect(() => {
    if (!active) return
    let frame = 0
    
    const animate = () => {
      const canvas = ecgCanvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const W = canvas.width
      const H = canvas.height

      frame++
      
      // ECG-like wave function
      const generateEcg = (t) => {
        const beat = (t * hr / 60) % 1
        if (beat < 0.05) return Math.sin(beat * Math.PI * 20) * 0.4
        if (beat < 0.08) return -0.3
        if (beat < 0.1) return 0.95 // R peak
        if (beat < 0.12) return -0.5
        if (beat < 0.15) return -0.1
        if (beat < 0.3) return Math.sin((beat - 0.15) * Math.PI * 6) * 0.15
        return Math.random() * 0.05 - 0.025
      }

      const newPoint = generateEcg(frame / 30)
      ecgDataRef.current.push(newPoint)
      if (ecgDataRef.current.length > W / 2) {
        ecgDataRef.current.shift()
      }

      ctx.clearRect(0, 0, W, H)
      
      // Grid
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.08)'
      ctx.lineWidth = 1
      for (let y = 0; y < H; y += 15) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }

      // Center line
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.15)'
      ctx.beginPath()
      ctx.moveTo(0, H / 2)
      ctx.lineTo(W, H / 2)
      ctx.stroke()

      // Draw ECG line with glow
      ctx.shadowBlur = 8
      ctx.shadowColor = 'rgba(244, 114, 182, 0.8)'
      ctx.strokeStyle = '#f472b6'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      ctx.beginPath()
      ecgDataRef.current.forEach((point, i) => {
        const x = i * 2
        const y = H / 2 - point * (H / 2.5)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
      ctx.shadowBlur = 0

      // Leading dot
      if (ecgDataRef.current.length > 0) {
        const lastY = H / 2 - ecgDataRef.current[ecgDataRef.current.length - 1] * (H / 2.5)
        const lastX = (ecgDataRef.current.length - 1) * 2
        
        ctx.fillStyle = '#f472b6'
        ctx.shadowBlur = 12
        ctx.shadowColor = '#f472b6'
        ctx.beginPath()
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      requestAnimationFrame(animate)
    }

    const animFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrame)
  }, [active, hr])

  return (
    <div className="glass-strong rounded-3xl overflow-hidden border border-white/10 p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-pulse animate-pulse" />
          <span className="text-sm font-medium">Sensor Fusion</span>
        </div>
        <div className="text-[10px] font-mono text-mist uppercase tracking-wider">50 Hz · Kalman</div>
      </div>

      {/* ECG Waveform */}
      <div className="relative bg-black/40 rounded-xl p-3 mb-4 overflow-hidden">
        <canvas ref={ecgCanvasRef} width={400} height={120} className="w-full h-auto" />
        <div className="absolute top-2 left-3 flex items-center gap-1.5">
          <Heart className="w-3 h-3 text-flare" fill="currentColor" />
          <span className="text-[10px] font-mono text-flare uppercase tracking-wider">ECG</span>
        </div>
        {!active && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <span className="text-xs text-mist">Sensor inactive</span>
          </div>
        )}
      </div>

      {/* Vitals grid */}
      <div className="grid grid-cols-2 gap-2">
        <VitalTile
          icon={<Heart className="w-3.5 h-3.5" />}
          label="HEART RATE"
          value={Math.round(hr)}
          unit="bpm"
          color="text-flare"
          bgColor="bg-flare/5"
        />
        <VitalTile
          icon={<Droplets className="w-3.5 h-3.5" />}
          label="SPO₂"
          value={spo2.toFixed(0)}
          unit="%"
          color="text-cyan-400"
          bgColor="bg-cyan-500/5"
        />
        <VitalTile
          icon={<Activity className="w-3.5 h-3.5" />}
          label="HRV"
          value={Math.round(hrv)}
          unit="ms"
          color="text-glow"
          bgColor="bg-glow/5"
        />
        <VitalTile
          icon={<Wind className="w-3.5 h-3.5" />}
          label="RESP"
          value={Math.round(resp)}
          unit="/min"
          color="text-pulse"
          bgColor="bg-pulse/5"
        />
      </div>
    </div>
  )
}

function VitalTile({ icon, label, value, unit, color, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-3 border border-white/5`}>
      <div className={`flex items-center gap-1.5 ${color} mb-1.5`}>
        {icon}
        <span className="text-[9px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-display italic ${color}`}>{value}</span>
        <span className="text-[10px] text-mist">{unit}</span>
      </div>
    </div>
  )
}
