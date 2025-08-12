import { ref, onMounted } from 'vue';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  inputs: {
    glucose: number;
    carbs: number;
  };
  result: {
    insulinDose: number;
  };
  note?: string;
}

const HISTORY_STORAGE_KEY = 'gluco-linker-history';

export function useHistory() {
  const history = ref<HistoryEntry[]>([]);

  const loadHistory = () => {
    const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    console.log('Loading history - storedHistory:', storedHistory);
    if (storedHistory) {
      history.value = JSON.parse(storedHistory);
      console.log('Loading history - parsed history:', history.value);
    }
  };

  const saveHistory = () => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.value));
  };

  const addHistoryEntry = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: new Date().toISOString(),
      timestamp: Date.now(),
    };
    history.value.unshift(newEntry);
    saveHistory();
  };

  const updateNote = (id: string, note: string) => {
    const entry = history.value.find(e => e.id === id);
    if (entry) {
      entry.note = note;
      saveHistory();
    }
  };

  onMounted(loadHistory);

  return {
    history,
    addHistoryEntry,
    updateNote,
  };
}
