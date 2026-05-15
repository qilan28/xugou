/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
          dark: '#2563eb',
        },
        accent: {
          cyan: '#06b6d4',
          amber: '#f59e0b',
          rose: '#ec4899',
          purple: '#8b5cf6',
        },
        surface: {
          dark: 'rgba(255,255,255,0.05)',
          'dark-hover': 'rgba(255,255,255,0.08)',
          light: 'rgba(255,255,255,0.8)',
          'light-hover': 'rgba(255,255,255,0.95)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
        'glass': '0 4px 24px rgba(0, 0, 0, 0.2)',
        'glass-sm': '0 2px 12px rgba(0, 0, 0, 0.15)',
        'card': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2s infinite',
        'slide-up': 'slideUp 0.4s ease',
        'fade-in': 'fadeIn 0.3s ease',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(59, 130, 246, 0.2)' },
          '50%': { boxShadow: '0 0 24px rgba(59, 130, 246, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-dot': {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
          '70%': { transform: 'scale(1)', boxShadow: '0 0 0 6px rgba(34, 197, 94, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 60%)',
      }
    },
  },
  plugins: [],
}
