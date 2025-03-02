/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./global.css", // Ensure global.css is included in the content array
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Dynamically created colors, will be used with CSS variables
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
        },
        dark: {
          background: 'rgb(10, 10, 20)',
          card: 'rgb(20, 20, 35)',
          foreground: 'rgb(250, 250, 255)',
          text: 'rgb(200, 200, 220)',
          primary: 'var(--color-primary-500)',
          muted: 'rgb(40, 40, 60)'
        }
      },
      animation: {
        'pulse-gentle': 'pulse 3s ease-in-out infinite',
        'float': 'float 5s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'slide-up-fade': 'slideUpFade 0.4s ease-out',
        'progress': 'progress 2s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        slideUpFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
