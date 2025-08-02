/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        linkedinBlue: '#0073b1',
        linkedinDarkBlue: '#0a66c2',
        linkedinLightBg: '#f3f6f8',
      },
    },
  },
  plugins: [],
};
