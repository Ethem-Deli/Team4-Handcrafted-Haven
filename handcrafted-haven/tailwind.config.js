/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: "#A3B18A",
        beige: "#DAD7CD",
        terracotta: "#CB997E",
        charcoal: "#3A3A3A",
        softgray: "#6B705C",
        offwhite: "#F8F7F3",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
};
