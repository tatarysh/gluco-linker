import { computed, watch } from 'vue'
import { useStorageAsync } from '@vueuse/core'
import { useTheme } from 'vuetify'

export type ThemeMode = 'auto' | 'light' | 'dark'

let themeModePreferenceInstance: ReturnType<typeof useStorageAsync> | null = null

const getThemeModePreference = () => {
  if (!themeModePreferenceInstance) {
    themeModePreferenceInstance = useStorageAsync<ThemeMode>('theme_mode', 'auto')
  }
  return themeModePreferenceInstance
}

export const useAppTheme = () => {
  const themeModePreference = getThemeModePreference()
  const vuetifyTheme = useTheme()

  // Wykryj preferowany motyw systemowy
  const getSystemTheme = (): 'light' | 'dark' => {
    if (process.client && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'dark' // fallback dla SSR
  }

  // Oblicz aktualny motyw bazując na preferencji użytkownika
  const currentTheme = computed<'light' | 'dark'>(() => {
    if (themeModePreference.value === 'auto') {
      return getSystemTheme()
    }
    return themeModePreference.value
  })

  // Zastosuj motyw w Vuetify
  const applyTheme = () => {
    if (process.client) {
      vuetifyTheme.global.name.value = currentTheme.value
    }
  }

  // Obserwuj zmiany preferencji systemowych (tylko dla trybu 'auto')
  if (process.client) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (themeModePreference.value === 'auto') {
        applyTheme()
      }
    })
  }

  // Obserwuj zmiany preferencji użytkownika
  watch(themeModePreference, applyTheme, { immediate: true })

  const setThemeMode = (mode: ThemeMode) => {
    themeModePreference.value = mode
  }

  return {
    themeMode: themeModePreference,
    currentTheme,
    setThemeMode,
    applyTheme,
  }
}
