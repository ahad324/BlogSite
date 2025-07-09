/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0F172A', // Slate-900 for dark background
        surface: '#1E293B', // Slate-800 for cards and surfaces
        surfaceLight: '#2D3748', // Slate-700 for hover states
        text: {
          primary: '#F1F5F9', // Slate-100 for primary text
          secondary: '#CBD5E1', // Slate-300 for secondary text
          muted: '#64748B', // Slate-500 for muted text
        },
        primary: {
          DEFAULT: '#3B82F6', // Blue-500 for primary actions
          dark: '#1D4ED8', // Blue-700 for hover
        },
        accent: {
          DEFAULT: '#10B981', // Emerald-500 for accents
          dark: '#047857', // Emerald-700 for hover
        },
        error: '#EF4444', // Red-500 for errors
        border: '#4B5563', // Slate-600 for borders
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.15)',
        subtle: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
      },
      transitionProperty: {
        'colors-opacity': 'background-color, border-color, color, fill, stroke, opacity, transform',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};