export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: ['@invictus.codes/nuxt-vuetify', '@nuxtjs/i18n', '@vite-pwa/nuxt'],
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
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark',
      },
    },
  },
})
