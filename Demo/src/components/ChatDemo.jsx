import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Sparkles, Cpu } from 'lucide-react'

const RESPONSES = {
  squat: "Keep your back straight, knees aligned with toes, and engage your core. Lower until thighs are parallel to ground. Form check: maintain controlled 2-second descent.",
  form: "Watch your posture — chest up, shoulders back. Your current form score is in the optimal zone. Engage your core and breathe through each rep.",
  heart: "Your heart rate sits at the lower end of zone 2 (60-70% max HR) — great for fat oxidation. For cardio adaptation, push into zone 3.",
  breath: "Try box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat 5 cycles. This activates parasympathetic response.",
  workout: "Based on your HRV (45ms) and recent activity, I recommend a moderate-intensity 30min session. Focus on compound movements with quality form.",
  sleep: "Quality sleep drives recovery. Your HRV suggests good autonomic balance. Aim 7-9hrs, consistent schedule, no screens 1hr before bed.",
  nutrition: "Post-workout, target 20-30g protein within 30min. Pair complex carbs (oats, sweet potato) for glycogen replenishment.",
  default: "I'm analyzing your real-time biometrics and movement. Ask me about form, recovery, nutrition, or training — I'll personalize for you."
}

const getResponse = (input) => {
  const lower = input.toLowerCase()
  if (lower.includes('squat') || lower.includes('rep')) return RESPONSES.squat
  if (lower.includes('form') || lower.includes('posture')) return RESPONSES.form
  if (lower.includes('heart') || lower.includes('hr')) return RESPONSES.heart
  if (lower.includes('breath') || lower.includes('stress')) return RESPONSES.breath
  if (lower.includes('workout') || lower.includes('exercise') || lower.includes('train')) return RESPONSES.workout
  if (lower.includes('sleep') || lower.includes('rest')) return RESPONSES.sleep
  if (lower.includes('food') || lower.includes('eat') || lower.includes('nutrition')) return RESPONSES.nutrition
  return RESPONSES.default
}

export default function ChatDemo({ active }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi. I'm running on-device LLaMA-7B. Ask me about your training, recovery, or form.", latency: 87 }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)

  const suggestions = ['How is my form?', 'Workout for today?', 'Breathing techniques']

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const send = async (text) => {
    const t = (text || input).trim()
    if (!t) return
    
    setMessages(prev => [...prev, { role: 'user', text: t }])
    setInput('')
    setIsThinking(true)

    // Simulate quantized LLM inference latency (40-95ms)
    const latency = 40 + Math.random() * 55
    await new Promise(r => setTimeout(r, latency))

    setMessages(prev => [...prev, {
      role: 'ai',
      text: getResponse(t),
      latency: Math.round(latency)
    }])
    setIsThinking(false)
  }

  const toggleListen = () => {
    if (isListening) {
      setIsListening(false)
      // Simulate transcription
      setTimeout(() => send("How is my squat form looking today?"), 300)
    } else {
      setIsListening(true)
      // Auto-stop after 3 seconds for demo
      setTimeout(() => {
        setIsListening(false)
        send("How is my squat form looking today?")
      }, 2500)
    }
  }

  return (
    <div className="glass-strong rounded-3xl overflow-hidden border border-white/10 flex flex-col" style={{minHeight: 280}}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-glow to-flare flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium leading-tight">LLaMA-7B Assistant</div>
            <div className="text-[10px] text-mist font-mono">4-bit · ANE · {Math.round(messages.filter(m => m.latency).reduce((a, m) => a + m.latency, 0) / messages.filter(m => m.latency).length || 0)}ms avg</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-pulse/10 border border-pulse/20">
          <Cpu className="w-3 h-3 text-pulse" />
          <span className="text-[10px] text-pulse uppercase tracking-wider">Local</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[280px]" style={{minHeight: 200}}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${
                m.role === 'user'
                  ? 'bg-gradient-to-br from-glow to-flare text-zinc-900 font-medium'
                  : 'bg-white/5 text-zinc-200 border border-white/5'
              }`}>
                {m.text}
              </div>
              {m.latency && (
                <div className="text-[9px] text-mist mt-1 px-2 font-mono">
                  ⚡ {m.latency}ms · on-device
                </div>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-glow animate-bounce" style={{animationDelay: '0ms'}} />
                <div className="w-1.5 h-1.5 rounded-full bg-glow animate-bounce" style={{animationDelay: '150ms'}} />
                <div className="w-1.5 h-1.5 rounded-full bg-glow animate-bounce" style={{animationDelay: '300ms'}} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-mist hover:text-zinc-200 transition-colors border border-white/5"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={active ? "Ask anything..." : "Voice modality inactive"}
            disabled={!active}
            className="flex-1 bg-white/5 rounded-full px-4 py-2 text-sm outline-none border border-white/5 focus:border-glow/40 disabled:opacity-40 transition-colors placeholder-mist/50"
          />
          <button
            onClick={toggleListen}
            disabled={!active}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors disabled:opacity-30 ${
              isListening 
                ? 'bg-rose-500 text-white pulse-ring' 
                : 'bg-white/5 hover:bg-white/10 text-mist'
            }`}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => send()}
            disabled={!active || !input.trim()}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-glow to-flare flex items-center justify-center disabled:opacity-30 transition-opacity"
          >
            <Send className="w-3.5 h-3.5 text-zinc-900" />
          </button>
        </div>
      </div>
    </div>
  )
}
