import { ref } from 'vue'

const snackbarVisible = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('')

export function useSnackbar() {
  const showSnackbar = (message: string, color: string = 'success') => {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackbarVisible.value = true
  }

  return {
    snackbarVisible,
    snackbarMessage,
    snackbarColor,
    showSnackbar,
  }
}
