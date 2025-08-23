<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="text-h4 mb-4">{{ $t('history.title') }}</h1>

        <v-data-table
          :headers="headers"
          :items="records"
          item-key="id"
          class="elevation-1"
          :no-data-text="$t('history.no_data')"
        >
          <template #[`item.insulinAmount`]>
            ="{ item }"> {{ item.insulinAmount.toFixed(2) }} {{ $t('units') }}
          </template>

          <template #[`item.timestamp`]>
            ="{ item }">
            {{ formatDate(item.timestamp) }}
          </template>

          <template #[`item.notes`]>
            ="{ item }">
            <v-textarea
              v-model="item.notes"
              :label="$t('notes')"
              variant="solo-filled"
              rows="1"
              auto-grow
              density="compact"
              @update:model-value="updateNote(item.id, item.notes)"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useInsulinHistory, InsulinRecord } from '../../composable/use-insulin-history'
import { useSnackbar } from '../../composable/use-snackbar'

const i18n = useI18n()
const { getRecords, updateRecordNote } = useInsulinHistory()
const { add: showSnackbar } = useSnackbar()

const records = ref<InsulinRecord[]>(getRecords())

const headers = computed(() => [
  { title: i18n.t('insulin.dose'), key: 'insulinAmount' },
  { title: i18n.t('time'), key: 'timestamp' },
  { title: i18n.t('notes'), key: 'notes' },
])

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString(i18n.locale.value)
}

const updateNote = (id: string, newNote: string | undefined) => {
  updateRecordNote(id, newNote || '')
  showSnackbar({
    type: 'success',
    message: i18n.t('note.updated'),
  })
}

// Refresh records when the component mounts or when insulinHistory changes
onMounted(() => {
  records.value = getRecords()
})

// Watch for changes in insulinHistory from local storage
watch(
  () => useInsulinHistory().insulinHistory.value,
  () => {
    records.value = getRecords()
  },
  { deep: true },
)

useHead({
  title: computed(() => i18n.t('history.title')),
})
</script>
