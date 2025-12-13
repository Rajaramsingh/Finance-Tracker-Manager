/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wealthy-green': {
          900: '#004d00', // Deep Green
          800: '#007a33', // Rich Green
          600: '#3d9c79', // Medium Rich Green (Derived)
          500: '#66b3a1', // Sage
          300: '#b2e0d4', // Mint
          100: '#e0f7f1', // Mist
        }
      }
    },
  },
  plugins: [],
}

