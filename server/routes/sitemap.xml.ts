export default defineEventHandler(async (event) => {
  const protocol = getHeader(event, 'x-forwarded-proto') || 'https'
  const host = getHeader(event, 'x-forwarded-host') || getHeader(event, 'host') || 'localhost'
  const baseUrl = `${protocol}://${host}`

  const routes = [
    { path: '/', changefreq: 'weekly', priority: 1.0 },
    { path: '/products', changefreq: 'monthly', priority: 0.8 },
    { path: '/settings', changefreq: 'monthly', priority: 0.7 },
    { path: '/about', changefreq: 'yearly', priority: 0.6 },
    { path: '/contact', changefreq: 'yearly', priority: 0.6 },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return xml
})
