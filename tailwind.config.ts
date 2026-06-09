import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C41E3A',
          dark: '#8B0000',
          light: '#E63950',
          50: '#FFF0F2',
          100: '#FFD6DC',
          500: '#C41E3A',
          600: '#A01830',
          700: '#8B0000',
        },
        gold: {
          DEFAULT: '#D4AF37',
          dark: '#B8960A',
          light: '#F5D06F',
          50: '#FDF9EC',
          100: '#FAF0C2',
          500: '#D4AF37',
          600: '#B8960A',
        },
        dark: {
          DEFAULT: '#080808',
          card: '#111111',
          surface: '#1A1A1A',
          border: '#2A2A2A',
          hover: '#222222',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #080808 0%, #1a0000 50%, #080808 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
        'crimson-gradient': 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F5D06F 0%, #D4AF37 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(196, 30, 58, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(196, 30, 58, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-red': '0 0 30px rgba(196, 30, 58, 0.4)',
        'glow-gold': '0 0 30px rgba(212, 175, 55, 0.4)',
        'card': '0 4px 30px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 50px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
}

export default config
