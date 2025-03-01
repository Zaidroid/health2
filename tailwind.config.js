/** @type {import('tailwindcss').Config} */
    export default {
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      darkMode: 'class', // Enable class-based dark mode
      theme: {
        extend: {
          animation: {
            'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
          keyframes: {
            wiggle: {
              '0%, 100%': { transform: 'rotate(-3deg)' },
              '50%': { transform: 'rotate(3deg)' },
            }
          },
          colors: {
            dark: {
              background: '#1a202c', // Dark gray background
              foreground: '#ffffff', // White text
              card: '#2d3748',       // Slightly lighter gray for cards
              text: '#cbd5e0',       // Light gray text
              primary: '#667eea',    // Primary color (adjust as needed)
              secondary: '#9f7aea',  // Secondary color
              muted: '#4a5568',      // Muted text color
            },
          },
        },
      },
      plugins: [],
    };
