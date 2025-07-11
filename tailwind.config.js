// tailwind.config.js
module.exports = {
  content: ['./src/views/**/*.ejs'],
  safelist: ['bg-primary-700', 'hover:bg-primary-800', 'focus:ring-primary-300'],
  theme: {
    extend: {
      colors: {
        primary: {
          700: '#1d4ed8',
          800: '#1e40af',
          300: '#93c5fd',
        },
      },
    },
  },
};
