export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
      '@invictus.codes/nuxt-vuetify',
  ],
    vuetify: {
        /* vuetify options */
        vuetifyOptions: {
            theme: {
                defaultTheme: 'dark'
            }
        }
    }
})
