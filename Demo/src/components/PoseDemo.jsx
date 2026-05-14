import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Award, Target, AlertCircle } from 'lucide-react'

export default function PoseDemo({ active }) {
  const [isRunning, setIsRunning] = useState(true)
  const [phase, setPhase] = useState(0)
  const [reps, setReps] = useState(0)
  const [formScore, setFormScore] = useState(85)
  const [fps, setFps] = useState(30)
  const [exercise, setExercise] = useState('Squat')
  const canvasRef = useRef(null)
  const requestRef = useRef()
  const lastRepRef = useRef(false)
  const fpsRef = useRef({ frames: 0, lastTime: Date.now() })

  const exercises = ['Squat', 'Push-up', 'Lunge', 'Plank']

  useEffect(() => {
    if (!isRunning || !active) return

    const animate = () => {
      setPhase(p => p + 0.04)
      drawPose()
      
      // FPS counter
      fpsRef.current.frames++
      const now = Date.now()
      if (now - fpsRef.current.lastTime >= 1000) {
        setFps(fpsRef.current.frames)
        fpsRef.current.frames = 0
        fpsRef.current.lastTime = now
      }
      
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [isRunning, active])

  useEffect(() => {
    // Count reps
    const squatDepth = (Math.sin(phase) + 1) / 2
    const isAtBottom = squatDepth > 0.85
    if (isAtBottom && !lastRepRef.current) {
      setReps(r => r + 1)
      // Vary form score
      setFormScore(75 + Math.random() * 22)
    }
    lastRepRef.current = isAtBottom
  }, [phase])

  const drawPose = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    ctx.clearRect(0, 0, W, H)

    // Background grid
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.05)'
    ctx.lineWidth = 1
    for (let x = 0; x < W; x += 30) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, H)
      ctx.stroke()
    }
    for (let y = 0; y < H; y += 30) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(W, y)
      ctx.stroke()
    }

    // Calculate keypoints based on phase (squat motion)
    const squatDepth = (Math.sin(phase) + 1) / 2
    const cx = W / 2
    const baseY = H * 0.15

    const keypoints = {
      nose: [cx, baseY + squatDepth * 30],
      lShoulder: [cx - 50, baseY + 50 + squatDepth * 30],
      rShoulder: [cx + 50, baseY + 50 + squatDepth * 30],
      lElbow: [cx - 75, baseY + 110 + squatDepth * 30],
      rElbow: [cx + 75, baseY + 110 + squatDepth * 30],
      lWrist: [cx - 95, baseY + 170 + squatDepth * 30],
      rWrist: [cx + 95, baseY + 170 + squatDepth * 30],
      lHip: [cx - 35, baseY + 180 + squatDepth * 50],
      rHip: [cx + 35, baseY + 180 + squatDepth * 50],
      lKnee: [cx - 45, baseY + 260 + squatDepth * 20],
      rKnee: [cx + 45, baseY + 260 + squatDepth * 20],
      lAnkle: [cx - 50, baseY + 340],
      rAnkle: [cx + 50, baseY + 340],
    }

    // Skeleton connections
    const connections = [
      ['lShoulder', 'rShoulder', 'glow'],
      ['lShoulder', 'lElbow', 'glow'],
      ['lElbow', 'lWrist', 'glow'],
      ['rShoulder', 'rElbow', 'glow'],
      ['rElbow', 'rWrist', 'glow'],
      ['lShoulder', 'lHip', 'pulse'],
      ['rShoulder', 'rHip', 'pulse'],
      ['lHip', 'rHip', 'pulse'],
      ['lHip', 'lKnee', 'flare'],
      ['lKnee', 'lAnkle', 'flare'],
      ['rHip', 'rKnee', 'flare'],
      ['rKnee', 'rAnkle', 'flare'],
    ]

    const colors = {
      glow: 'rgba(167, 139, 250, 0.9)',
      pulse: 'rgba(16, 185, 129, 0.9)',
      flare: 'rgba(244, 114, 182, 0.9)',
    }

    // Draw connections with glow
    connections.forEach(([a, b, color]) => {
      const [x1, y1] = keypoints[a]
      const [x2, y2] = keypoints[b]
      
      // Glow effect
      ctx.shadowBlur = 15
      ctx.shadowColor = colors[color]
      ctx.strokeStyle = colors[color]
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    })
    ctx.shadowBlur = 0

    // Draw keypoints
    Object.entries(keypoints).forEach(([name, [x, y]]) => {
      // Outer glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12)
      gradient.addColorStop(0, 'rgba(167, 139, 250, 0.8)')
      gradient.addColorStop(1, 'rgba(167, 139, 250, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, 12, 0, Math.PI * 2)
      ctx.fill()

      // Core point
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // Confidence indicators around joints
    if (Math.random() > 0.7) {
      Object.values(keypoints).forEach(([x, y]) => {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(x, y, 8 + Math.random() * 4, 0, Math.PI * 2)
        ctx.stroke()
      })
    }

    // Draw form indicators
    const leftKneeAngle = calculateAngle(keypoints.lHip, keypoints.lKnee, keypoints.lAnkle)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.font = '11px JetBrains Mono'
    ctx.fillText(`${Math.round(leftKneeAngle)}°`, keypoints.lKnee[0] - 30, keypoints.lKnee[1] + 5)
  }

  const calculateAngle = (a, b, c) => {
    const ang = Math.abs(Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]))
    return (ang * 180 / Math.PI)
  }

  return (
    <div className="glass-strong rounded-3xl overflow-hidden border border-white/10 relative h-full min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400">REC</span>
          </div>
          <div className="text-sm font-medium">Pose Estimation</div>
          <div className="text-xs text-mist font-mono">{fps} FPS</div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1.5 outline-none cursor-pointer"
          >
            {exercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
          </select>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="relative bg-gradient-to-br from-black/40 via-glow/5 to-flare/5 p-4">
        <canvas
          ref={canvasRef}
          width={700}
          height={400}
          className="w-full h-auto rounded-2xl"
        />
        
        {/* Overlay scanlines */}
        <div className="absolute inset-4 rounded-2xl scanline pointer-events-none opacity-50" />

        {/* Corner markers */}
        <div className="absolute top-6 left-6 w-6 h-6 border-l-2 border-t-2 border-glow/60" />
        <div className="absolute top-6 right-6 w-6 h-6 border-r-2 border-t-2 border-glow/60" />
        <div className="absolute bottom-6 left-6 w-6 h-6 border-l-2 border-b-2 border-glow/60" />
        <div className="absolute bottom-6 right-6 w-6 h-6 border-r-2 border-b-2 border-glow/60" />

        {!active && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <div className="text-mist text-sm">Vision modality inactive</div>
              <div className="text-xs text-mist/50 mt-1">Switch modality to enable</div>
            </div>
          </div>
        )}
      </div>

      {/* Stats bottom */}
      <div className="p-5 grid grid-cols-3 gap-3">
        <StatBox
          icon={<Target className="w-3.5 h-3.5" />}
          label="Reps"
          value={reps}
          color="text-glow"
        />
        <StatBox
          icon={<Award className="w-3.5 h-3.5" />}
          label="Form Score"
          value={`${Math.round(formScore)}`}
          unit="/100"
          color={formScore >= 80 ? 'text-pulse' : formScore >= 60 ? 'text-amber-400' : 'text-rose-400'}
        />
        <StatBox
          icon={<AlertCircle className="w-3.5 h-3.5" />}
          label="Cadence"
          value="32"
          unit="rpm"
          color="text-flare"
        />
      </div>

      {/* Feedback line */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 text-xs text-mist bg-white/5 rounded-full px-4 py-2.5">
          <Sparkles className="w-3.5 h-3.5 text-glow" />
          <span>
            {formScore >= 80 
              ? 'Excellent form. Keep your core engaged.' 
              : formScore >= 60 
              ? 'Watch your knee alignment — keep them over toes.'
              : 'Slow down and focus on depth.'}
          </span>
        </div>
      </div>
    </div>
  )
}

function StatBox({ icon, label, value, unit, color }) {
  return (
    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
      <div className={`flex items-center gap-1.5 ${color} mb-2`}>
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-display italic ${color}`}>{value}</span>
        {unit && <span className="text-xs text-mist">{unit}</span>}
      </div>
    </div>
  )
}

function Sparkles({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/>
    </svg>
  )
}
