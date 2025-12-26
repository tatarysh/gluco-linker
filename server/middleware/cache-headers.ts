export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
})
