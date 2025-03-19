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
        // Using RGB variables for dynamic color theming
        primary: {
          50: 'rgb(var(--color-primary-50))',
          100: 'rgb(var(--color-primary-100))',
          200: 'rgb(var(--color-primary-200))',
          300: 'rgb(var(--color-primary-300))',
          400: 'rgb(var(--color-primary-400))',
          500: 'rgb(var(--color-primary-500))',
          600: 'rgb(var(--color-primary-600))',
          700: 'rgb(var(--color-primary-700))',
          800: 'rgb(var(--color-primary-800))',
          900: 'rgb(var(--color-primary-900))',
          950: 'rgb(var(--color-primary-950))',
        },
        dark: {
          background: 'rgb(10, 10, 20)',
          card: 'rgb(20, 20, 35)',
          foreground: 'rgb(250, 250, 255)',
          text: 'rgb(200, 200, 220)',
          muted: 'rgb(40, 40, 60)'
        }
      },
      animation: {
        'pulse-gentle': 'pulse 3s ease-in-out infinite',
        'float': 'float 5s ease-in-out infinite',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'slide-up-fade': 'slideUpFade 0.4s ease-out',
        'progress': 'progress 2s ease-in-out',
        'color-shift': 'colorShift 8s infinite',
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
        colorShift: {
          '0%, 100%': { backgroundColor: 'rgb(var(--color-primary-500))' },
          '33%': { backgroundColor: 'rgb(var(--color-primary-600))' },
          '66%': { backgroundColor: 'rgb(var(--color-primary-400))' },
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, rgb(var(--color-primary-600)), rgb(var(--color-primary-500)))',
        'gradient-secondary': 'linear-gradient(to right, rgb(var(--color-primary-700)), rgb(var(--color-primary-600)))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    // Add custom utility classes for theme colors
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-gradient-primary': {
          'background-image': 'linear-gradient(to right, rgb(var(--color-primary-600)), rgb(var(--color-primary-400)))',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          'color': 'transparent',
        },
        '.bg-gradient-primary': {
          'background-image': 'linear-gradient(to right, rgb(var(--color-primary-600)), rgb(var(--color-primary-500)))',
        },
        '.border-primary': {
          'border-color': 'rgb(var(--color-primary-500))',
        },
        '.ring-primary': {
          '--tw-ring-color': 'rgb(var(--color-primary-500))',
        },
      };
      addUtilities(newUtilities);
    }
  ],
}
