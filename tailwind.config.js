/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'seafoam': '#4ECDC4',
        'teal': {
          DEFAULT: '#2A9D8F',
          light: '#6BBFB7',
          dark: '#207973',
        },
        'lavender': {
          DEFAULT: '#E0B1CB',
          light: '#F2D5E8',
          dark: '#C88BAF',
        },
        'sand': {
          DEFAULT: '#F7F7F2',
          dark: '#E8E8E0',
        },
        'charcoal': '#264653',
        'success': '#3CBA9F',
        'warning': '#FFBC42',
        'error': '#E63946',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Open Sans', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'ripple': 'ripple 0.7s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        }
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      boxShadow: {
        'soft': '0 4px 14px rgba(0,0,0,0.05)',
        'hover': '0 10px 25px rgba(0,0,0,0.07)',
      }
    },
  },
  plugins: [],
};