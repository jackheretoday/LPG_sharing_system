/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        "on-surface": "#e2e2e2",
        "surface": "#131313",
        "surface-dim": "#131313",
        "on-surface-variant": "#c5c7c1",
        "surface-container-highest": "#353535",
        "surface-container-high": "#2a2a2a",
        "surface-container": "#1f1f1f",
        "surface-container-low": "#1b1b1b",
        "surface-container-lowest": "#0e0e0e",
        "surface-bright": "#393939",
        "outline": "#8f918c",
        "outline-variant": "#454843",
        "primary-hub": "#ffffff",
        "on-primary-hub": "#2f312e",
        "error-hub": "#ffb4ab",
      },
    },
  },
  plugins: [],
}
