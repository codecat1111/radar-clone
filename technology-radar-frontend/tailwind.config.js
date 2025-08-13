/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'radar-gradient-start': '#8FBC8F',
        'radar-gradient-middle': '#DAA520', 
        'radar-gradient-end': '#CD853F',
        'tag-leading': '#90EE90',
        'tag-nascent': '#FFB6C1',
        'tag-watchlist': '#87CEEB',
        'primary-blue': '#4A90E2',
        'secondary-blue': '#E3F2FD',
        'filter-bg': '#F8FAFC',
        'filter-border': '#E2E8F0',
        'benefit-bg': '#F0F9FF',
        'risk-bg': '#FEF2F2'
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out'
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
}
