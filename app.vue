<template>
  <v-app>
    <v-app-bar>
      <v-container>
        <div class="d-flex justify-space-between align-center">
          <!-- Desktop version - full name -->
          <NuxtLink :to="localePath({ name: 'index' })" class="text-decoration-none d-none d-sm-flex" style="color: white">
            <v-app-bar-title class="font-weight-medium">
              {{ $t('app.name') }}
            </v-app-bar-title>
          </NuxtLink>

          <!-- Mobile version - GL in circle -->
          <NuxtLink :to="localePath({ name: 'index' })" class="text-decoration-none d-sm-none">
            <v-avatar color="primary" class="font-weight-bold">
              GL
            </v-avatar>
          </NuxtLink>

          <div class="d-flex">
            <v-btn icon="mdi-calculator-variant" :to="localePath({ name: 'index' })" />
            <v-btn icon="mdi-nutrition" :to="localePath({ name: 'products' })" />
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
    <v-footer class="bg-dark border-t">
      <v-container>
        <div class="d-flex justify-space-between align-center py-1 text-caption">
          <div>
            © {{ new Date().getFullYear() }} {{ $t('app.name') }}
          </div>
          <div class="d-flex align-center">
            <NuxtLink :to="localePath({ name: 'about' })" class="text-decoration-none text-caption mx-2">
              {{ $t('about:title') }}
            </NuxtLink>
            <span class="text-caption">·</span>
            <NuxtLink :to="localePath({ name: 'contact' })" class="text-decoration-none text-caption mx-2">
              {{ $t('contact:title') }}
            </NuxtLink>
          </div>
        </div>
      </v-container>
    </v-footer>
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
