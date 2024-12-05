/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'red-500': '#FF0000',
        'light-yellow': '#FFFACD',
      },
      width: {
        'product-sm': '200px',
        'product-md': '300px',
        'product-lg': '400px',
      },
      height: {
        'product-sm': '250px',
        'product-md': '375px',
        'product-lg': '500px',
      },
    },
  },
  plugins: [],
};
