import en from './lang/en-US.json'

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  nitro: {
    presets: 'netlify-edge',
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml'],
    },
  },
  modules: ['@invictus.codes/nuxt-vuetify', '@nuxtjs/i18n', '@kevinmarrec/nuxt-pwa', 'nuxt-gtag'],
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, user-scalable=0',
      meta: [
        {
          name: 'description',
          content: en['app.description'],
        },
      ],
    },
  },
  pwa: {
    manifest: {
      name: 'Gluco Linker',
      short_name: 'Kalkulator Insuliny',
      description: en['app.description'],
      background_color: '#000000',
    },
    icon: {
      source: './public/favicon.webp',
    },
  },
  gtag: {
    id: process.env.GOOGLE_GTM,
  },
  i18n: {
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'en',
    locales: [
      {
        name: 'English',
        icon: '🇺🇸',
        code: 'en',
        iso: 'en-US',
        file: 'en-US.json',
      },
      {
        name: 'Polski',
        icon: '🇵🇱',
        code: 'pl',
        iso: 'pl-PL',
        file: 'pl-PL.json',
      },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },
  vuetify: {
    moduleOptions: {
      useIconCDN: true,
      treeshaking: true,
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
      },
    },
  },
})
