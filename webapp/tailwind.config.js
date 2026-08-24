/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        substack: {
          orange: "#FF6719",
          dark: "#1A1A1A",
          light: "#F8F9FA",
          gray: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};
