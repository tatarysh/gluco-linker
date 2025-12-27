<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="text-h5">{{ $t('contact:title') }}</v-card-title>
          <v-card-text>
            <p class="mb-4">{{ $t('contact:description') }}</p>

            <div class="text-h6 mb-3">{{ $t('contact:social') }}</div>
            <div class="d-flex gap-2">
              <v-btn icon="mdi-facebook" href="https://www.facebook.com/profile.php?id=61577897377510" target="_blank" variant="text" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const i18n = useI18n()

useSeoMeta({
  title: computed(() => `${i18n.t('contact:title')} - ${i18n.t('app.name')}`),
  description: computed(() => i18n.t('contact:description')),
})
</script>
