import React from 'react'
import { motion } from 'framer-motion'
import { Users, Target, Star, Zap, TrendingUp, Activity } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts'

const modalityData = [
  { modality: 'Voice', taskCompletion: 94, satisfaction: 4.8, errors: 2.1 },
  { modality: 'Gesture', taskCompletion: 88, satisfaction: 4.3, errors: 4.2 },
  { modality: 'AR Overlay', taskCompletion: 96, satisfaction: 4.9, errors: 1.8 },
  { modality: 'Haptic', taskCompletion: 82, satisfaction: 4.0, errors: 5.5 },
  { modality: 'Touch', taskCompletion: 95, satisfaction: 4.5, errors: 2.5 },
  { modality: 'Gaze', taskCompletion: 79, satisfaction: 3.8, errors: 6.3 },
  { modality: 'Audio', taskCompletion: 87, satisfaction: 4.2, errors: 3.8 },
  { modality: 'Multimodal', taskCompletion: 98, satisfaction: 4.9, errors: 1.2 },
]

const radarData = [
  { metric: 'Learnability', score: 4.8 },
  { metric: 'Efficiency', score: 4.7 },
  { metric: 'Memorability', score: 4.6 },
  { metric: 'Error Recovery', score: 4.5 },
  { metric: 'Satisfaction', score: 4.9 },
  { metric: 'Accessibility', score: 4.7 },
]

const KeyMetric = ({ icon: Icon, value, label, sublabel, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass rounded-3xl p-6 relative overflow-hidden group hover:border-mist/20 transition-all"
  >
    <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 ${color}`} />
    <div className="relative">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
      </div>
      <div className="text-4xl font-display italic gradient-text mb-1">{value}</div>
      <div className="text-sm text-white/80 font-medium">{label}</div>
      <div className="text-xs text-white/40 mt-1">{sublabel}</div>
    </div>
  </motion.div>
)

export default function Metrics() {
  return (
    <section id="metrics" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6">
            <TrendingUp className="w-3.5 h-3.5 text-glow" />
            <span className="text-xs font-mono text-white/60">USER RESEARCH</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display tracking-tight leading-tight mb-4">
            Validated with <span className="italic gradient-text">real humans.</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            30+ participant usability study. 8 interaction modalities tested. Statistical significance
            across every dimension that matters.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <KeyMetric
            icon={Users}
            value="30+"
            label="Study Participants"
            sublabel="Diverse age & fitness levels"
            color="bg-gradient-to-br from-purple-500 to-purple-700"
            delay={0}
          />
          <KeyMetric
            icon={Target}
            value="93%"
            label="Task Completion"
            sublabel="First-attempt success rate"
            color="bg-gradient-to-br from-pink-500 to-pink-700"
            delay={0.1}
          />
          <KeyMetric
            icon={Star}
            value="4.7/5"
            label="Usability Score"
            sublabel="SUS-adapted scale"
            color="bg-gradient-to-br from-emerald-500 to-emerald-700"
            delay={0.2}
          />
          <KeyMetric
            icon={Activity}
            value="93%"
            label="Recognition Accuracy"
            sublabel="9 activity classes"
            color="bg-gradient-to-br from-amber-500 to-amber-700"
            delay={0.3}
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 glass rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-display italic mb-1">A/B test — 8 modalities</h3>
                <p className="text-xs text-white/40 font-mono">Task completion × satisfaction · n=30</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-glow" />
                  <span className="text-white/60">Completion %</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-flare" />
                  <span className="text-white/60">Satisfaction</span>
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={modalityData} margin={{ top: 10, right: 10, bottom: 30, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="modality"
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={11}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,10,15,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="taskCompletion" fill="#a78bfa" radius={[6, 6, 0, 0]} />
                <Bar dataKey="satisfaction" fill="#f472b6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-white/40 font-mono mb-1">WINNER</div>
                <div className="text-sm font-medium">Multimodal fusion</div>
                <div className="text-xs text-pulse mt-0.5">98% completion</div>
              </div>
              <div>
                <div className="text-xs text-white/40 font-mono mb-1">P-VALUE</div>
                <div className="text-sm font-medium">&lt; 0.001</div>
                <div className="text-xs text-white/40 mt-0.5">Highly significant</div>
              </div>
              <div>
                <div className="text-xs text-white/40 font-mono mb-1">EFFECT SIZE</div>
                <div className="text-sm font-medium">d = 1.42</div>
                <div className="text-xs text-white/40 mt-0.5">Large (Cohen)</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 glass rounded-3xl p-6"
          >
            <div className="mb-6">
              <h3 className="text-xl font-display italic mb-1">UX dimensions</h3>
              <p className="text-xs text-white/40 font-mono">Nielsen heuristics · 5-point scale</p>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#a78bfa"
                  fill="#a78bfa"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {radarData.map((d) => (
                <div key={d.metric} className="flex items-center justify-between text-xs">
                  <span className="text-white/50">{d.metric}</span>
                  <span className="font-mono text-glow">{d.score}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 glass rounded-3xl p-8"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-xs font-mono text-white/40 mb-2">METHODOLOGY</div>
              <h4 className="font-display italic text-lg mb-2">Mixed-methods study</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                Within-subjects design. Counterbalanced ordering. Think-aloud protocol
                paired with screen recording and physiological measurement.
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-white/40 mb-2">QUALITATIVE</div>
              <h4 className="font-display italic text-lg mb-2">Ethnographic field work</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                12 hours of contextual inquiry in gyms and homes. Semi-structured
                interviews coded with thematic analysis.
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-white/40 mb-2">QUANTITATIVE</div>
              <h4 className="font-display italic text-lg mb-2">Statistical analysis</h4>
              <p className="text-sm text-white/60 leading-relaxed">
                Repeated-measures ANOVA with Bonferroni correction. Bootstrap confidence
                intervals (10,000 iterations). All p &lt; 0.05 reported.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
