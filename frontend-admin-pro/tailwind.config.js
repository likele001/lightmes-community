/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        admin: {
          page: "#fafafa",
          primary: "#409eff",
          muted: "#909399",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 1px 4px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
