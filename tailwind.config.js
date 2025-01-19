/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          gradient: {
            start: '#833AB4',
            end: '#E1306C'
          }
        }
      }
    },
  },
  plugins: [],
}
