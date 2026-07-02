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
        // Strategic accent — royal blue for CTAs & highlights (token kept as `gold` for
        // class continuity; values are blue). `gold-400` is the primary accent everywhere.
        gold: {
          DEFAULT: '#2563EB',
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#2563EB',
          500: '#1d4ed8',
          600: '#1e40af',
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
        display: ['var(--font-poppins)', 'var(--font-raleway)', 'system-ui', 'sans-serif'],
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
          '0%,100%': { boxShadow: '0 0 0 0 rgba(37,99,235,0.45)' },
          '50%':     { boxShadow: '0 0 36px 4px rgba(37,99,235,0.30)' },
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
        // Layered, navy-tinted elevation scale — reads as depth, not blur.
        'soft':   '0 1px 2px rgba(9,30,66,0.06), 0 3px 10px rgba(9,30,66,0.05), 0 14px 28px -10px rgba(9,30,66,0.10)',
        'medium': '0 2px 4px rgba(9,30,66,0.05), 0 10px 22px -6px rgba(9,30,66,0.12), 0 28px 52px -14px rgba(9,30,66,0.16)',
        'large':  '0 4px 8px rgba(9,30,66,0.06), 0 18px 36px -10px rgba(9,30,66,0.16), 0 52px 90px -20px rgba(9,30,66,0.22)',
        // Accent CTA: blue glow + crisp contact shadow + inner top highlight.
        'gold':   'inset 0 1px 0 rgba(255,255,255,0.22), 0 2px 4px rgba(37,99,235,0.22), 0 10px 24px -6px rgba(37,99,235,0.45)',
        // Primary navy CTA: same treatment in brand navy.
        'navy':   'inset 0 1px 0 rgba(255,255,255,0.14), 0 2px 4px rgba(0,30,96,0.20), 0 12px 28px -8px rgba(0,30,96,0.45)',
        // Cards sitting on dark navy sections.
        'dark-card': '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 50px -12px rgba(0,0,0,0.55)',
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
