/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: "class", // or "media"
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
  important: true,
};

