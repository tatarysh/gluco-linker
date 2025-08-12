<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>{{ $t('history.title') }}</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="[{ title: 'ID', key: 'id' }, { title: 'Timestamp', key: 'timestamp' }]"
              :items="history"
              item-key="id"
              class="elevation-1"
            >
              <template v-slot:item.timestamp="{ item }">
                {{ new Date(item.timestamp).toLocaleString() }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useHistory, type HistoryEntry } from '~/composable/use-history';

const { history, updateNote } = useHistory();
const editingNoteId = ref<string | null>(null);
const noteText = ref('');

const headers = [
  { title: 'Date', key: 'timestamp' },
  { title: 'Glucose', key: 'inputs.glucose' },
  { title: 'Carbs', key: 'inputs.carbs' },
  { title: 'Insulin Dose', key: 'result.insulinDose' },
  { title: 'Note', key: 'note' },
];

const toggleNote = (id: string) => {
  if (editingNoteId.value === id) {
    editingNoteId.value = null;
    noteText.value = '';
  } else {
    editingNoteId.value = id;
    const entry = history.value.find(e => e.id === id);
    if (entry) {
      noteText.value = entry.note || '';
    }
  }
};

const saveNote = (id: string) => {
  updateNote(id, noteText.value);
  editingNoteId.value = null;
};
</script>
