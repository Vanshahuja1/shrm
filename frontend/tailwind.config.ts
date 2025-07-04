import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import aspectRatio from '@tailwindcss/aspect-ratio'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          50: '#f5f8fa',   // Very light blue
          100: '#e5edf5',
          200: '#bfd8ee',
          300: '#8bb8de',
          400: '#5e98ce',
          500: '#234075',   // Main brand blue (deep blue)
          600: '#1a3260',
          700: '#16294d',
          800: '#13203c',
          900: '#10182b',
        },
        accent: {
          50: '#f0fcfa',
          100: '#d2f7f0',
          200: '#a5efe2',
          300: '#66e3cf',
          400: '#26d6bc',
          500: '#00b8d9',   // Sky blue accent
          600: '#0199b7',
          700: '#017992',
          800: '#015e70',
          900: '#004353',
        },
        enterprise: {
          50: '#f2f6f8',   // Light background
          100: '#e1e5ea',
          200: '#c5cbd7',
          300: '#a5b2c5',
          400: '#7a8ba7',
          500: '#5a6273',   // Slate gray for text/secondary
          600: '#47505b',
          700: '#374151',   // Darker sidebar/secondary
          800: '#23272e',
          900: '#181b22',
        },
        success: {
          50: '#f2fcf6',
          100: '#d3f8e3',
          200: '#a8f0c9',
          300: '#6ce6ac',
          400: '#2ecc71',   // Emerald green
          500: '#23b563',
          600: '#18984e',
          700: '#10743b',
          800: '#09522a',
          900: '#05311b',
        },
        warning: {
          50: '#fffcf6',
          100: '#fff6df',
          200: '#ffe2a9',
          300: '#ffcc70',
          400: '#ffa726',   // Soft orange
          500: '#ff9800',
          600: '#fb8500',
          700: '#e17509',
          800: '#b35d0d',
          900: '#7a3c09',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Dashboard specific colors
        sidebar: {
          bg: '#16294d',    // Deep blue for sidebar
          hover: '#234075', // Brand blue hover
          active: '#00b8d9',// Sky blue for active
        },
        dashboard: {
          bg: '#f2f6f8',    // Light gray/blue background
          card: '#ffffff',
          border: '#e1e5ea',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      screens: {
        'xs': '475px',
        '3xl': '1680px',
      },
    },
  },
  plugins: [
    forms,
    typography,
    aspectRatio,
  ],
}

export default config