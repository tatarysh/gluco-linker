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
    if (storedHistory) {
      history.value = JSON.parse(storedHistory);
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
