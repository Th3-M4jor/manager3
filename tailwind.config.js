// tailwind.config.js
module.exports = {
    mode: 'jit',
    purge: [
        './static/**/*.html',
        './src/**/*.{ts,tsx,js}',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        gridTemplateColumns: {
          '3': 'repeat(3, minmax(0, 1fr))',
          '10': 'repeat(10, minmax(0, 1fr))',
          '12': 'repeat(12, minmax(0, 1fr))',
          '16': 'repeat(16, minmax(0, 1fr))',
          '20': 'repeat(20, minmax(0, 1fr))',
          '24': 'repeat(24, minmax(0, 1fr))',
        },
        colors: {
          'hover-yellow': '#ac7c24',
        }
      },
    },
    variants: {},
    plugins: [],
}