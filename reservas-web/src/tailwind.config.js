/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}", // Agregamos html por si acaso
    "./src/pages/**/*.{js,ts,jsx,tsx}", // Forzamos la carpeta de tus páginas
    "./src/components/**/*.{js,ts,jsx,tsx}", // Forzamos tus componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}