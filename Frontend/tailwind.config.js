/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {fontFamily: {
        'CourierPrime-Regular': ['CourierPrime-Regular', 'sans-serif'],
      },},
  },
  plugins: [require("daisyui")],
};
