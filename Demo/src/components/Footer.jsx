import React from 'react'
import { Github, Heart, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-glow to-flare" />
                <div className="absolute inset-0 w-7 h-7 rounded-lg bg-gradient-to-br from-glow to-flare blur-md opacity-60" />
              </div>
              <span className="font-display italic text-2xl">Pulse.ai</span>
            </div>
            <p className="text-sm text-white/50 max-w-md leading-relaxed mb-6">
              A real-time multimodal health assistant for iOS. Vision, voice, and sensor fusion —
              all on-device. Zero cloud. Built with Swift, CoreML, ARKit, and a lot of user research.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-flare fill-flare" />
              <span>by Jay Guwalani</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase text-white/40 mb-4">Project</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://github.com/JayDS22/Real-Time-Multimodal-Health-Assistant-IOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  GitHub repo <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#architecture" className="text-white/70 hover:text-white transition-colors">
                  Architecture
                </a>
              </li>
              <li>
                <a href="#metrics" className="text-white/70 hover:text-white transition-colors">
                  Research data
                </a>
              </li>
              <li>
                <a href="#demo" className="text-white/70 hover:text-white transition-colors">
                  Live demo
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase text-white/40 mb-4">Stack</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>Swift 5.9 · iOS 17+</li>
              <li>CoreML · LLaMA-7B 4-bit</li>
              <li>ARKit · Vision · CoreMotion</li>
              <li>SwiftUI · Charts · Combine</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-white/30 font-mono">
            © 2026 Pulse.ai — MIT License — Not affiliated with Apple Inc.
          </div>
          <a
            href="https://github.com/JayDS22/Real-Time-Multimodal-Health-Assistant-IOS"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>JayDS22/Real-Time-Multimodal-Health-Assistant-IOS</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
