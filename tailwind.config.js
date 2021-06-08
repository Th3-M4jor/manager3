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
        },
        width: {
          '1/10': '10%',
          '2/10': '20%',
          '3/10': '30%',
          '4/10': '40%',
          '5/10': '50%',
          '6/10': '60%',
          '7/10': '70%',
          '8/10': '80%',
          '9/10': '90%',
        },
        margin: {
          '21p': '21vw',
          '26p': '26vw',
        }
      },
    },
    variants: {},
    plugins: [],
}