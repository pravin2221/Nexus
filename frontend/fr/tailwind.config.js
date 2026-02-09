/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        zentry: ['zentry', 'sanf-serif'],
        general: ['general', 'sanf-serif'],
        'circular-web': ['circular-web','sanf-serif'],
        'robert-medium': ['robert-medium', 'sanf-serif'],
        'robert-regular': ['robert-regular', 'sanf-serif'],
      },

      colors: {
        marvel: {
          red: '#ED1D24',
          'red-dark': '#B10D12',
          'red-light': '#FF3B42',
          black: '#0D0D0D',
          white: '#F5F5F5',
          gray: '#1A1A1A',
        },
        blue: {
          50: '#F5F5F5',
          75: '#1A1A1A',
          100: '#F5F5F5',
          200: '#0D0D0D',
          300: '#ED1D24',
        },
        violet: { 300: '#ED1D24' },
        yellow: { 100: '#1A1A1A', 300: '#ED1D24' },
      }

    },
  },
  plugins: [],
}