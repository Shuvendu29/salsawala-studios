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
          DEFAULT: '#bdb2ff',
          dark: '#8b7af7',
          light: '#d4cfff',
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#bdb2ff',
          600: '#9d8ff5',
          700: '#7c6ee8',
        },
        gold: {
          DEFAULT: '#ffc8dd',
          dark: '#ff9dbe',
          light: '#ffe3ee',
          50: '#fff5f8',
          100: '#ffebf2',
          500: '#ffc8dd',
          600: '#ff9dbe',
        },
        dark: {
          DEFAULT: '#edf6f9',
          card: '#ffffff',
          surface: '#f5efff',
          border: '#ffc6ff',
          hover: '#ede9fe',
        },
        ink: {
          DEFAULT: '#2d1b69',
          secondary: '#5a4d8f',
          muted: '#9188c4',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #edf6f9 0%, #f5efff 50%, #ffeef5 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 0%, rgba(45,27,105,0.08) 100%)',
        'crimson-gradient': 'linear-gradient(135deg, #bdb2ff 0%, #8b7af7 100%)',
        'gold-gradient': 'linear-gradient(135deg, #ffc8dd 0%, #ff9dbe 100%)',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(189, 178, 255, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(189, 178, 255, 0.7)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-red': '0 0 30px rgba(189, 178, 255, 0.5)',
        'glow-gold': '0 0 30px rgba(255, 200, 221, 0.5)',
        'card': '0 4px 30px rgba(189, 178, 255, 0.2)',
        'card-hover': '0 8px 50px rgba(189, 178, 255, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config
