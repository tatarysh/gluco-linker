<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title class="text-h5">{{ $t('app.name') }}</v-card-title>
          <v-card-text>
            <div class="text-subtitle-1 mb-4">{{ $t('app.description') }}</div>

            <v-divider class="my-4" />

            <div class="text-h6 mb-2">{{ $t('about:features') }}</div>
            <ul class="ml-4">
              <li>{{ $t('about:feature_calculator') }}</li>
              <li>{{ $t('about:feature_products') }}</li>
              <li>{{ $t('about:feature_settings') }}</li>
              <li>{{ $t('about:feature_offline') }}</li>
              <li>{{ $t('about:feature_multilang') }}</li>
            </ul>

            <v-divider class="my-4" />

            <div class="text-h6 mb-2">{{ $t('about:disclaimer') }}</div>
            <p class="text-body-2">
              {{ $t('about:disclaimer_text') }}
            </p>

            <v-divider class="my-4" />

            <div class="text-h6 mb-2">{{ $t('about:contact') }}</div>
            <p>
              {{ $t('about:contact_text') }}
              <NuxtLink :to="localePath({ name: 'contact' })" class="text-primary">
                {{ $t('about:contact_link') }}
              </NuxtLink>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const i18n = useI18n()

useSeoMeta({
  title: computed(() => `${i18n.t('about:title')} - ${i18n.t('app.name')}`),
  description: computed(() => i18n.t('about:description')),
})
</script>
