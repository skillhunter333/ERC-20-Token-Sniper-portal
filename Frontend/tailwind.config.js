/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {fontFamily: {
        'CourierPrime-Regular': ['CourierPrime-Regular', 'sans-serif'],
      },
    
       colors: {
        purple: {
          
          '950': '#0a0624',
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
