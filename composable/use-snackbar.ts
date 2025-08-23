import { ref } from 'vue'

interface SnackbarOptions {
  message: string
  type?: 'success' | 'info' | 'warning' | 'error'
  timeout?: number
}

const isSnackbarVisible = ref(false)
const snackbarMessage = ref('')
const snackbarType = ref<'success' | 'info' | 'warning' | 'error'>('info')
const snackbarTimeout = ref(3000)

export function useSnackbar() {
  const add = (options: SnackbarOptions) => {
    snackbarMessage.value = options.message
    snackbarType.value = options.type || 'info'
    snackbarTimeout.value = options.timeout || 3000
    isSnackbarVisible.value = true
  }

  const hide = () => {
    isSnackbarVisible.value = false
  }

  return {
    isSnackbarVisible,
    snackbarMessage,
    snackbarType,
    snackbarTimeout,
    add,
    hide,
  }
}
