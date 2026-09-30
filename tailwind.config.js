/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#fdfcf9',
          100: '#f7f4ed',
          200: '#eee8dc',
          300: '#ded4c1',
          DEFAULT: '#fbf9f5',
        },
        ink: {
          900: '#141210',
          800: '#211d1a',
          700: '#332e29',
          600: '#4a433c',
          500: '#696056',
          DEFAULT: '#1c1917',
        },
        seal: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#e11d48',
          600: '#c23b22', // Rouge vermillon traditionnel
          700: '#9f2814',
          DEFAULT: '#c23b22',
        },
        jade: {
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        chinese: ['"PingFang SC"', '"Noto Sans SC"', '"Microsoft YaHei"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

