import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep corporate blue — brand primary
        navy: {
          DEFAULT: '#001e60',
          50:  '#e6ebf5',
          100: '#c0cde6',
          200: '#8da7d1',
          300: '#5a80bc',
          400: '#2f5aa3',
          500: '#001e60',
          600: '#001a54',
          700: '#001443',
          800: '#000f33',
          900: '#000a22',
          950: '#000615',
        },
        // Soft indigo for refined gradients
        indigo: {
          DEFAULT: '#2a3f8f',
          400: '#4257b0',
          500: '#2a3f8f',
          600: '#1f2f70',
        },
        // Strategic accent — yellow for CTA energy & highlights
        gold: {
          DEFAULT: '#FFC940',
          50:  '#fff8e6',
          100: '#ffeebf',
          200: '#ffe08a',
          300: '#ffd35c',
          400: '#FFC940',
          500: '#f5b800',
          600: '#cc9800',
        },
        // shadcn-style tokens (for imported 21st.dev components)
        border: 'var(--border)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        secondary: { foreground: 'var(--secondary-foreground)' },
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
      },
      fontFamily: {
        sans:    ['var(--font-raleway)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-raleway)', 'system-ui', 'sans-serif'],
        display: ['var(--font-marcellus)', '"Clash Display"', 'Georgia', 'serif'],
        mono:    ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      animation: {
        'fade-in':    'fadeIn 0.7s ease-out forwards',
        'slide-up':   'slideUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        'float':      'float 6s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'marquee':          'marquee var(--duration,40s) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration,40s) linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(28px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(255,201,64,0.45)' },
          '50%':     { boxShadow: '0 0 36px 4px rgba(255,201,64,0.30)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(calc(-100% - var(--gap,1rem)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to:   { transform: 'translateY(calc(-100% - var(--gap,1rem)))' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'brand-deep':      'linear-gradient(135deg, #000a22 0%, #001e60 45%, #2a3f8f 100%)',
        'brand-glow':      'radial-gradient(60% 60% at 50% 0%, rgba(66,87,176,0.35) 0%, rgba(0,30,96,0) 70%)',
      },
      boxShadow: {
        'soft':   '0 2px 24px rgba(0, 30, 96, 0.07)',
        'medium': '0 10px 40px rgba(0, 30, 96, 0.12)',
        'large':  '0 24px 70px rgba(0, 30, 96, 0.20)',
        'gold':   '0 8px 30px rgba(255, 201, 64, 0.35)',
        'navy':   '0 12px 40px rgba(0, 30, 96, 0.30)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
}

export default config
