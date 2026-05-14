/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2E7D32",
        secondary: "#4CAF50",
        accent: "#81C784",
        dark: "#0A2F1F",
        light: "#E8F5E9",
      },
      fontFamily: {
        spartan: ['"League Spartan Variable"', 'sans-serif'],
        fredoka: ['"Fredoka"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}