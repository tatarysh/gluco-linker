<template>
  <div>
    <h1>{{ $t('history.title') }}</h1>
    <div v-if="history.length === 0">
      <p>{{ $t('history.noEntries') }}</p>
    </div>
    <div v-else>
      <ul>
        <li v-for="entry in history" :key="entry.id">
          <div>
            <strong>{{ $t('history.date') }}:</strong> {{ new Date(entry.timestamp).toLocaleString() }}
          </div>
          <div>
            <strong>{{ $t('history.glucose') }}:</strong> {{ entry.inputs.glucose }} mg/dl
          </div>
          <div>
            <strong>{{ $t('history.carbs') }}:</strong> {{ entry.inputs.carbs }} g
          </div>
          <div>
            <strong>{{ $t('history.insulinDose') }}:</strong> {{ entry.result.insulinDose.toFixed(2) }}
          </div>
          <div>
            <button @click="toggleNote(entry.id)">
              {{ editingNoteId === entry.id ? $t('history.hideNote') : $t('history.showNote') }}
            </button>
            <div v-if="editingNoteId === entry.id">
              <textarea v-model="noteText" @blur="saveNote(entry.id)" :placeholder="$t('history.notePlaceholder')"></textarea>
            </div>
            <div v-else-if="entry.note">
              <strong>{{ $t('history.note') }}:</strong> {{ entry.note }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useHistory, type HistoryEntry } from '~/composable/use-history';

const { history, updateNote } = useHistory();
const editingNoteId = ref<string | null>(null);
const noteText = ref('');

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

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
