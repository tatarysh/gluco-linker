import en from './lang/en-US.json'

export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['@invictus.codes/nuxt-vuetify', '@nuxtjs/i18n', '@kevinmarrec/nuxt-pwa'],
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
      description: en['app.description'],
      theme_color: '#4CAF50',
      background_color: '#000000',
    },
    icon: {
      source: './public/favicon.webp',
    },
    workbox: {
      enabled: true,
    },
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
