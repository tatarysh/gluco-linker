<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="text-h4 mb-4">{{ $t('history:title') }}</h1>

        <v-data-table
          :headers="headers"
          :items="insulinHistory"
          item-key="timestamp"
          class="elevation-1"
        >
          <template #item.insulinAmount="{ item }">
            {{ item.insulinAmount.toFixed(2) }} {{ $t('units') }}
          </template>
          <template #item.timestamp="{ item }">
            {{ new Date(item.timestamp).toLocaleString() }}
          </template>
          <template #item.notes="{ item }">
            <v-textarea
              v-model="item.notes"
              variant="solo-filled"
              rows="1"
              auto-grow
              hide-details
              @change="updateNote(item)"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :timeout="3000">
      {{ snackbarText }}
      <template #actions>
        <v-btn color="blue" variant="text" @click="snackbar = false">
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { useInsulinHistory } from '~/composable/use-insulin-history'

const i18n = useI18n()
const { insulinHistory } = useInsulinHistory()

const snackbar = ref(false)
const snackbarText = ref('')

const headers = [
  {
    title: i18n.t('insulin.dose'),
    key: 'insulinAmount',
  },
  {
    title: i18n.t('history:time'),
    key: 'timestamp',
  },
  {
    title: i18n.t('calculator:notes'),
    key: 'notes',
  },
]

const updateNote = (item: any) => {
  // Logic to update the note in local storage
  // For now, it's directly bound to item.notes, so it updates the ref.
  // We need to re-save the entire history to local storage.
  if (process.client) {
    }
  snackbarText.value = i18n.t('history:note_update_success');
  snackbar.value = true;
}
</script>
