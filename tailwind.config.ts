import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem', xl: '2.5rem', '2xl': '3rem' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1400px' },
    },
    extend: {
      colors: {
        brand: {
          primary: '#0f172a',
          surface: '#0c1222',
          card: '#111827',
          border: 'rgba(99, 102, 241, 0.2)',
        },
        accent: {
          blue: '#3b82f6',
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          glow: '#6366f1',
        },
        neutral: {
          850: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        golf: {
          dark: '#0c3d3d',
          primary: '#0d5c5c',
          DEFAULT: '#0f766e',
          light: '#14b8a6',
          pale: '#ccfbf1',
        },
        costa: {
          sand: '#e8e0d5',
          gold: '#b8860b',
          warm: '#d4a574',
          olive: '#6b7c5c',
        },
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        accent: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(13, 92, 92, 0.85) 50%, rgba(15, 23, 42, 0.9) 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 40%, rgba(15, 23, 42, 0.9) 100%)',
        'section-pattern': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20, 184, 166, 0.08), transparent)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #a855f7 100%)',
        'gradient-glow': 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.06) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6, 182, 212, 0.04) 0px, transparent 50%)',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        glow: '0 0 20px -5px rgba(99, 102, 241, 0.4), 0 0 40px -10px rgba(139, 92, 246, 0.3)',
        'glow-lg': '0 0 40px -5px rgba(99, 102, 241, 0.5), 0 0 80px -15px rgba(139, 92, 246, 0.4)',
        'glow-sm': '0 0 15px -3px rgba(99, 102, 241, 0.35)',
        'inner-glow': 'inset 0 0 60px -20px rgba(99, 102, 241, 0.15)',
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'logo-glow': 'logo-glow 3s ease-in-out infinite',
        'icon-float': 'icon-float 4s ease-in-out infinite',
        'text-glow': 'text-glow 3s ease-in-out infinite',
        'grid-drift': 'grid-drift 20s linear infinite',
        'scan-line': 'scan-line 8s ease-in-out infinite',
        'float-dot': 'float-dot 15s ease-in-out infinite',
        'text-3d-pop': 'text-3d-pop 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'flag-wave': 'flag-wave 2.8s ease-in-out infinite',
        'stagger-3': 'fade-in-up 0.6s ease-out 0.4s forwards',
        'stagger-4': 'fade-in-up 0.6s ease-out 0.55s forwards',
        'stagger-5': 'fade-in-up 0.6s ease-out 0.7s forwards',
      },
      keyframes: {
        'grid-drift': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(60px, 60px)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        'float-dot': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(8px, -12px)' },
          '50%': { transform: 'translate(-5px, 6px)' },
          '75%': { transform: 'translate(10px, 4px)' },
        },
        'text-glow': {
          '0%, 100%': { opacity: '0.9', textShadow: '0 0 12px rgba(99, 102, 241, 0.4)' },
          '50%': { opacity: '1', textShadow: '0 0 20px rgba(139, 92, 246, 0.6)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'icon-float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-2px) scale(1.05)' },
        },
        'logo-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))' },
          '50%': { opacity: '0.95', filter: 'drop-shadow(0 0 14px rgba(139, 92, 246, 0.5))' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'text-3d-pop': {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'flag-wave': {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
      },
      transitionDuration: { 400: '400ms' },
    },
  },
  plugins: [],
};

export default config;
