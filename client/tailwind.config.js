/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: "#0f0f13",
        panel: "#17171d",
        accent: "#6366f1",
      },
    },
  },
  plugins: [],
};
