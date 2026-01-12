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

  const locales = ['en', 'pl']
  const allRoutes: Array<{ path: string; changefreq: string; priority: number }> = []

  // Generate routes for each locale
  routes.forEach((route) => {
    locales.forEach((locale) => {
      const localizedPath = locale === 'en' ? route.path : `/${locale}${route.path}`
      allRoutes.push({
        path: localizedPath,
        changefreq: route.changefreq,
        priority: route.priority,
      })
    })
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return xml
})
