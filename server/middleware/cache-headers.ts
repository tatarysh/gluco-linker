export default defineEventHandler((event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=604800')
})
