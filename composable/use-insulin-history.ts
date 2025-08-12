import { ref } from 'vue'

interface InsulinRecord {
  insulinAmount: number;
  timestamp: number;
  notes?: string;
}

const INSULIN_HISTORY_KEY = 'insulinHistory';

const insulinHistory = ref<InsulinRecord[]>([]);

const loadHistory = () => {
  if (process.client) {
    const history = localStorage.getItem(INSULIN_HISTORY_KEY);
    if (history) {
      insulinHistory.value = JSON.parse(history);
    }
  }
};

const saveHistory = (record: InsulinRecord) => {
  insulinHistory.value.push(record);
  if (process.client) {
    localStorage.setItem(INSULIN_HISTORY_KEY, JSON.stringify(insulinHistory.value));
  }
};

export const useInsulinHistory = () => {
  loadHistory();

  return {
    insulinHistory,
    saveHistory,
  };
};
