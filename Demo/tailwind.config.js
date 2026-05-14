/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Instrument Serif"', 'serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
        'sans': ['"Geist"', 'sans-serif'],
      },
      colors: {
        'noir': '#0a0a0f',
        'ink': '#13131a',
        'ash': '#1f1f2e',
        'mist': '#a1a1aa',
        'pulse': '#10b981',
        'glow': '#a78bfa',
        'flare': '#f472b6',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      }
    },
  },
  plugins: [],
}
