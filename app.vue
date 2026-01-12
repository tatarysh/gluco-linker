<template>
  <v-app>
    <v-app-bar>
      <v-container>
        <div class="d-flex align-center">
          <!-- Logo - always visible -->
          <NuxtLink :to="localePath({ name: 'index' })" class="text-decoration-none">
            <v-img
              :src="currentTheme === 'light' ? '/logo-black.svg' : '/logo-white.svg'"
              alt="Gluco Linker"
              width="40"
              height="40"
            />
          </NuxtLink>

          <!-- Text - visible on sm and up -->
          <NuxtLink :to="localePath({ name: 'index' })" class="text-decoration-none d-none d-sm-flex ms-3" :class="currentTheme === 'light' ? 'text-black' : 'text-white'">
            <v-app-bar-title class="font-weight-medium">
              {{ $t('app.name') }}
            </v-app-bar-title>
          </NuxtLink>

          <v-spacer />

          <div class="d-flex">
            <v-btn icon="mdi-calculator-variant" :to="localePath({ name: 'index' })" />

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

            <v-menu>
              <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-menu" />
              </template>

              <v-card>
                <v-list>
                  <v-list-item :to="localePath({ name: 'products' })">
                    <template #prepend>
                      <v-icon icon="mdi-nutrition" />
                    </template>
                    <template #title>
                      <span>{{ $t('products:product_list') }}</span>
                    </template>
                  </v-list-item>
                  <v-list-item :to="localePath({ name: 'settings' })">
                    <template #prepend>
                      <v-icon icon="mdi-cog" />
                    </template>
                    <template #title>
                      <span>{{ $t('settings:title') }}</span>
                    </template>
                  </v-list-item>
                  <v-divider />
                  <v-list-item :to="localePath({ name: 'about' })">
                    <template #prepend>
                      <v-icon icon="mdi-information" />
                    </template>
                    <template #title>
                      <span>{{ $t('about:title') }}</span>
                    </template>
                  </v-list-item>
                  <v-list-item :to="localePath({ name: 'contact' })">
                    <template #prepend>
                      <v-icon icon="mdi-email" />
                    </template>
                    <template #title>
                      <span>{{ $t('contact:title') }}</span>
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
import { useAppTheme } from '~/composable/use-theme'

const { locale, locales, t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const availableLocales = computed(() => locales.value.filter((i) => typeof i === 'object' && i.code !== locale.value))
const route = useRoute()

// Initialize theme
const { applyTheme, currentTheme } = useAppTheme()
if (process.client) {
  applyTheme()
}

// Get current URL for canonical and og:url
const canonicalUrl = computed(() => {
  if (process.server) {
    return `https://gluco-linker.netlify.app${route.path}`
  }
  return typeof window !== 'undefined' ? window.location.href : ''
})

// Generate hreflang links
const hreflangLinks = computed(() => {
  const links: Array<{ rel: string; hreflang: string; href: string }> = []

  locales.value.forEach((loc) => {
    if (typeof loc === 'object') {
      const localizedPath = switchLocalePath(loc.code)
      links.push({
        rel: 'alternate',
        hreflang: loc.iso || loc.code,
        href: `https://gluco-linker.netlify.app${localizedPath}`,
      })
    }
  })

  // Add x-default
  links.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `https://gluco-linker.netlify.app/`,
  })

  return links
})

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
    {
      rel: 'canonical',
      href: canonicalUrl.value,
    },
    ...hreflangLinks.value,
  ],
})

useSeoMeta({
  title: computed(() => t('app.name')),
  description: computed(() => t('app.description')),
  ogUrl: canonicalUrl.value,
  ogType: 'website',
  ogLocale: computed(() => locale.value === 'en' ? 'en_US' : 'pl_PL'),
  ogSiteName: computed(() => t('app.name')),
  twitterCard: 'summary',
})

// Structured Data (JSON-LD)
const structuredData = computed(() => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: t('app.name'),
  description: t('app.description'),
  url: 'https://gluco-linker.netlify.app',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  inLanguage: ['en-US', 'pl-PL'],
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
}))

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: structuredData.value,
    },
  ],
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
