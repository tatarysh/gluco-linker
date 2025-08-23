import { ref, watchEffect, onMounted } from 'vue'

interface InsulinRecord {
  insulinAmount: number;
  timestamp: number;
  notes?: string;
}

const INSULIN_HISTORY_KEY = 'insulinHistory';

const insulinHistory = ref<InsulinRecord[]>([]);
let isHistoryLoaded = false; // Flag to ensure history is loaded only once

const loadHistory = () => {
  if (process.client && !isHistoryLoaded) {
    const history = localStorage.getItem(INSULIN_HISTORY_KEY);
    if (history) {
      insulinHistory.value = JSON.parse(history);
    }
    isHistoryLoaded = true;
  }
};

const saveHistoryToLocalStorage = () => {
  if (process.client) {
    localStorage.setItem(INSULIN_HISTORY_KEY, JSON.stringify(insulinHistory.value));
  }
};

export const useInsulinHistory = () => {
  onMounted(() => {
    loadHistory();
  });

  watchEffect(() => {
    // Save history to local storage whenever insulinHistory changes
    saveHistoryToLocalStorage();
  });

  const addRecord = (record: InsulinRecord) => {
    insulinHistory.value.push(record);
  };

  return {
    insulinHistory,
    addRecord,
    saveHistoryToLocalStorage, // Export saveHistoryToLocalStorage
  };
};
