/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /** Verde fosfórico estilo terminal / Matrix */
        brand: "#00FF41",
        ink: "#272822",
        surface: {
          dark: "#030806",
          light: "#f0fdf7",
        },
      },
      fontFamily: {
        sans: ["Lato", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"Courier Prime"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
