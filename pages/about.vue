<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <div class="text-h5 mb-4">{{ $t('app.name') }}</div>

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

        <v-divider class="my-4" />

        <div class="text-h6 mb-2">{{ $t('about:bugs') }}</div>
        <p class="text-body-2">
          {{ $t('about:bugs_text') }}
          <a href="https://github.com/tatarysh/gluco-linker/issues" target="_blank" class="text-primary">
            GitHub Issues
          </a>
        </p>
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
