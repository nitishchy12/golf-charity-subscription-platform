/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#edfdf6",
          100: "#d3f9e8",
          300: "#67e8b4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0f766e"
        }
      },
      boxShadow: {
        glow: "0 20px 80px rgba(20, 184, 166, 0.18)"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(20,184,166,0.24), transparent 40%), radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 25%), linear-gradient(180deg, #020617 0%, #0f172a 100%)"
      }
    }
  },
  plugins: []
};
