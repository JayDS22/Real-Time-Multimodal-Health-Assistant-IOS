# Demo — interactive web platform

An interactive marketing & exploration site for the Real-Time Multimodal Health Assistant. Built with React 18 and Vite. Showcases:

- Live **pose estimation** demo (canvas-based animated skeleton with rep counting)
- Live **vitals stream** with a Kalman-filtered ECG waveform
- Live **chat demo** simulating the on-device LLM with sub-100 ms inference timing
- Full **architecture diagram** rendered as interactive blocks
- The complete **A/B-test results** across all 8 interaction modalities

## Quick start

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

## Production build

```bash
npm run build
npm run preview
```

The build output goes to `dist/` and is fully static — drop it on any CDN, Netlify, Vercel, or GitHub Pages.

## Stack

- **React 18** with hooks
- **Vite 5** for dev server + build
- **Tailwind CSS 3** with a custom design system (see `tailwind.config.js`)
- **Recharts** for the metrics charts
- **Framer Motion** for entrance animations
- **Lucide React** for icons

## Design system

The visual language is a dark "noir" aesthetic with glass-morphism and ambient gradient backgrounds. Tokens are defined in `tailwind.config.js`:

| Token | Color | Use |
| :--- | :--- | :--- |
| `noir` | `#0a0a0f` | App background |
| `ink` | `#13131a` | Card background |
| `ash` | `#1c1c24` | Elevated surfaces |
| `mist` | `#94a3b8` | Tertiary text |
| `glow` | `#a78bfa` | Primary accent (purple) |
| `flare` | `#f472b6` | Secondary accent (pink) |
| `pulse` | `#10b981` | Success / live data (green) |

Typography:
- **Display** — Instrument Serif (italic for emphasis)
- **Body** — Geist Sans
- **Mono** — JetBrains Mono

## Project structure

```
Demo/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx                       # Top-level layout
    ├── components/
    │   ├── Navigation.jsx            # Sticky nav with scroll glass effect
    │   ├── Hero.jsx                  # Headline + live metric tiles
    │   ├── LiveDemo.jsx              # 4-modality switcher container
    │   ├── PoseDemo.jsx              # Animated canvas pose estimation
    │   ├── VitalsStream.jsx          # ECG waveform + vital tiles
    │   ├── ChatDemo.jsx              # LLM chat simulator
    │   ├── Architecture.jsx          # 5-layer diagram
    │   ├── Metrics.jsx               # A/B-test results + radar chart
    │   └── Footer.jsx
    └── styles/
        └── index.css                 # Tailwind directives + utilities
```

## Notes

- Pose and vitals data are simulated in the browser — no camera or sensor access is requested. The same component contracts mirror what the iOS app produces.
- The chat demo uses keyword-matched canned responses with realistic latency jitter (40–95 ms) to demonstrate the user-facing behavior of the on-device LLM.
- The site is fully responsive down to 375 px width.
