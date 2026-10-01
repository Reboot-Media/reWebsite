/** @type {import('tailwindcss').Config} */
export default {
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#0C0414',
          900: '#130A24',
          800: '#1E1038',
          700: '#2D1854',
          600: '#3B1578',
        },
        accent: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
          muted: '#C4B5FD',
          dark: '#5B21B6',
          bg: '#F5F0FF',
          border: '#E4D9FF',
          grid: '#DDD6F3',
        },
        success: '#27A244',
        danger: '#C0392B',
        roof: {
          paper:           '#FAF9FC',
          surface:         '#FFFFFF',
          ink:             '#1A1626',
          muted:           '#5E5A6E',
          'ink-muted':     '#A8A3B8',
          'border-subtle': '#E9E7F0',
          'border-strong': '#8A85A0',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(26,22,38,0.06), 0 4px 12px -2px rgba(26,22,38,0.06)',
        lift: '0 1px 2px rgba(26,22,38,0.06), 0 24px 64px -24px rgba(91,33,182,0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
