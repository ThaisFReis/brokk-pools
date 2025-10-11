/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        solana: {
          purple: '#9945FF',
          green: '#14F195',
          teal: '#00D4AA',
          dark: '#1A1A2E',
          gray: '#060606',
        },
        cyberpunk: {
          neon: '#00FFF0',
          pink: '#FF006E',
          blue: '#00D9FF',
          violet: '#9D4EDD',
        },
        forge: {
          deepblack: '#0A0A0A',
          metaldark: '#1a1a1a',
          metalgray: '#2a2a2a',
          steel: '#3a3a3a',
          ember: '#FF6B35',
          glow: '#FFA500',
          hotmetal: '#FF4500',
        },
      },
      fontFamily: {
        display: ['IBM Plex Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
        title: ['Cinzel', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-in-delayed': 'fadeIn 0.5s ease-in-out 0.1s both',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'ember-flicker': 'emberFlicker 3s ease-in-out infinite',
        'data-stream': 'dataStream 20s linear infinite',
        'forge-pulse': 'forgePulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(20, 241, 149, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(20, 241, 149, 0.8)' },
        },
        emberFlicker: {
          '0%, 100%': { opacity: '0.3', filter: 'brightness(1)' },
          '50%': { opacity: '0.6', filter: 'brightness(1.5)' },
        },
        dataStream: {
          '0%': { transform: 'translateY(0) translateX(0)' },
          '100%': { transform: 'translateY(-100%) translateX(20px)' },
        },
        forgePulse: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(153, 69, 255, 0.3), inset 0 0 20px rgba(255, 107, 53, 0.1)' },
          '50%': { boxShadow: '0 0 50px rgba(153, 69, 255, 0.5), inset 0 0 30px rgba(255, 107, 53, 0.2)' },
        },
      },
      backgroundImage: {
        'metal-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #2a2a2a 100%)',
        'forge-radial': 'radial-gradient(circle, rgba(153,69,255,0.15) 0%, rgba(10,10,10,0) 70%)',
      },
    },
  },
  plugins: [],
};
