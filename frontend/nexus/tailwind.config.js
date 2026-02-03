/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0a0a0a',
        'cyber-dark': '#0f0f0f',
        'cyber-gray': '#1a1a1a',
        'neon-green': '#00ff41',
        'neon-cyan': '#00f3ff',
        'neon-red': '#ff003c',
        'neon-purple': '#bc13fe',
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
        cyber: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 1s linear infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
      boxShadow: {
        'neon-green': '0 0 10px #00ff41, 0 0 20px #00ff41',
        'neon-cyan': '0 0 10px #00f3ff, 0 0 20px #00f3ff',
        'neon-red': '0 0 10px #ff003c, 0 0 20px #ff003c',
      }
    },
  },
  plugins: [],
}
