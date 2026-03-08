/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olsson: {
          // Olsson brand greens from logo
          green: '#8CC63F',        // main
          'green-light': '#A2C92B', // lighter, more yellow
          'green-dark': '#679A46',  // darker, for contrast/hover
          black: '#0a0a0a',
          white: '#fafafa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
