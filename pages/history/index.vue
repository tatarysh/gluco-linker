<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>{{ $t('history.title') }}</v-card-title>
          <v-card-text>
            <div v-if="history.length === 0">
              <p>{{ $t('history.noEntries') }}</p>
            </div>
            <v-data-table
              v-else
              :headers="headers"
              :items="history"
              item-key="id"
              class="elevation-1"
            >
              <template v-slot:item.timestamp="{ item }">
                {{ new Date(item.timestamp).toLocaleString() }}
              </template>
              <template v-slot:item.inputs.glucose="{ item }">
                {{ item.inputs.glucose }} mg/dl
              </template>
              <template v-slot:item.inputs.carbs="{ item }">
                {{ item.inputs.carbs }} g
              </template>
              <template v-slot:item.result.insulinDose="{ item }">
                {{ item.result.insulinDose.toFixed(2) }}
              </template>
              <template v-slot:item.note="{ item }">
                <v-icon @click="toggleNote(item.id)">
                  {{ editingNoteId === item.id ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
                <div v-if="editingNoteId === item.id">
                  <v-textarea
                    v-model="noteText"
                    @blur="saveNote(item.id)"
                    :placeholder="$t('history.notePlaceholder')"
                    rows="2"
                    auto-grow
                    variant="outlined"
                  ></v-textarea>
                </div>
                <div v-else-if="item.note">
                  {{ item.note }}
                </div>
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
