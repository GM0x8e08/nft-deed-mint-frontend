/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'defi-bg': '#0a0a0a',
        'defi-card': '#1a1a1a',
        'defi-border': '#333333',
        'defi-text': '#ffffff',
        'defi-text-secondary': '#cccccc',
        'defi-accent': '#00d4aa',
        'defi-accent-hover': '#00b894',
        'defi-error': '#ff6b6b',
        'defi-success': '#51cf66',
        'defi-warning': '#ffd43b',
      },
      fontFamily: {
        'defi': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
