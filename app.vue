<template>
  <v-app>
    <v-app-bar>
      <v-container>
        <div class="d-flex justify-space-between align-center">
          <v-app-bar-title class="font-weight-medium">
            {{ $t('app.name') }}
          </v-app-bar-title>

          <v-menu>
            <template #activator="{ props, on }">
              <v-btn v-bind="props" icon="mdi-translate" v-on="on" />
            </template>

            <v-card>
              <v-list>
                <v-list-item v-for="lang in availableLocales" :key="lang" :to="switchLocalePath(lang.code)">
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
      </v-container>
    </v-app-bar>
    <v-main>
      <nuxt-page />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => locales.value.filter((i) => i.code !== locale.value))
</script>
