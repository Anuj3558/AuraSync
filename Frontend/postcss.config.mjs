// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ use this, not tailwindcss
    autoprefixer: {},
  },
}
