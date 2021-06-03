// tailwind.config.js
module.exports = {
    mode: 'jit',
    purge: [
        './static/**/*.html',
        './src/**/*.{ts,tsx,js}',
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {},
    },
    variants: {},
    plugins: [],
}