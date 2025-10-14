/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        solana: {
          purple: '#9945FF',
          cyan: '#14F195',
          blue: '#4E44CE',
          green: '#19FB9B',
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
        title2: ['Cinzel Decorative', 'serif'],
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
          '0%, 100%': {
            boxShadow: '0 0 30px rgba(153, 69, 255, 0.3), inset 0 0 20px rgba(255, 107, 53, 0.1)',
          },
          '50%': {
            boxShadow: '0 0 50px rgba(153, 69, 255, 0.5), inset 0 0 30px rgba(255, 107, 53, 0.2)',
          },
        },
      },
      // ATUALIZADO AQUI
      backgroundImage: {
        'metal-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #2a2a2a 100%)',
        'forge-radial': 'radial-gradient(circle, rgba(153,69,255,0.15) 0%, rgba(10,10,10,0) 70%)',
        'cyberpunk-radial': 'radial-gradient(circle at top, #1c1c1c, #000000)',
        // Gradientes do body adicionados aqui
        'main-background': [
          'radial-gradient(ellipse 120% 80% at 70% 20%, #535259, transparent 50%)',
          'radial-gradient(ellipse 100% 60% at 30% 10%, #4B3852, transparent 60%)',
          'radial-gradient(ellipse 90% 70% at 50% 0%, #4B3256, transparent 65%)',
          'radial-gradient(ellipse 110% 50% at 80% 30%, #34323C, transparent 40%)',
        ],
        'deep-gradient': 'radial-gradient(circle at top, #1c1c1c, #060606)',
        'deep-gradient-transparent':
          'radial-gradient(circle at top, rgba(28, 28, 28, 0.6), rgba(6, 6, 6, 0.6))',
        'violet-abyss': 'radial-gradient(125% 125% at 50% 90%, #060606 40%, #413F47 100%)',
      },
      // Sombras personalizadas adicionadas aqui
      boxShadow: {
        'glow-border-green': '0 0 20px rgba(20, 241, 149, 0.3)',
        'glow-border-purple': '0 0 20px rgba(153, 69, 255, 0.3)',
        'metal-texture':
          'inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.5)',
        'forge-glow':
          '0 0 40px rgba(153, 69, 255, 0.4), 0 0 80px rgba(153, 69, 255, 0.2), inset 0 0 20px rgba(255, 107, 53, 0.1)',
        'inner-glow': 'inset 0px 1px 16px -3px rgba(6,6,6,0.7)',
      },
    },
  },
  plugins: [],
};
