<template>
  <v-app>
    <v-app-bar>
      <v-container>
        <div class="d-flex justify-space-between align-center">
          <v-app-bar-title class="font-weight-medium">
            {{ $t('app.name') }}
          </v-app-bar-title>

          <div class="d-flex">
            <v-btn icon="mdi-calculator-variant" :to="localePath({ name: 'index' })" />
            <v-btn icon="mdi-cog" :to="localePath({ name: 'settings' })" />

            <v-menu>
              <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-translate" />
              </template>

              <v-card>
                <v-list>
                  <v-list-item v-for="lang in availableLocales" :key="lang.code" :to="switchLocalePath(lang.code)">
                    <template #prepend>
                      <span class="me-3">{{ lang.icon }}</span>
                    </template>
                    <template #title>
                      <span>{{ lang.name }}</span>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </div>
        </div>
      </v-container>
    </v-app-bar>
    <v-main>
      <nuxt-page />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const { locale, locales, t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const availableLocales = computed(() => locales.value.filter((i) => typeof i === 'object' && i.code !== locale.value))

useHead({
  htmlAttrs: {
    lang: locale.value,
  },
  link: [
    {
      rel: 'icon',
      type: 'image/webp',
      href: '/favicon.webp',
    },
  ],
})

useSeoMeta({
  title: computed(() => t('app.name')),
  description: computed(() => t('app.description')),
})
</script>

<style>
body {
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    'Noto Sans',
    'Liberation Sans',
    sans-serif,
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji';
}
</style>
