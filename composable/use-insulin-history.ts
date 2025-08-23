import { useLocalStorage } from '@vueuse/core'

export interface InsulinRecord {
  id: string
  insulinAmount: number
  timestamp: number
  notes?: string
}

const INSULIN_HISTORY_KEY = 'insulin-history'

const insulinHistory = useLocalStorage<InsulinRecord[]>(INSULIN_HISTORY_KEY, [])

export function useInsulinHistory() {
  const addRecord = (insulinAmount: number, notes?: string) => {
    const newRecord: InsulinRecord = {
      id: Date.now().toString(), // Simple unique ID
      insulinAmount,
      timestamp: Date.now(),
      notes,
    }
    insulinHistory.value.push(newRecord)
  }

  const getRecords = () => {
    return insulinHistory.value.sort((a, b) => b.timestamp - a.timestamp) // Sort by newest first
  }

  const updateRecordNote = (id: string, newNote: string) => {
    const recordIndex = insulinHistory.value.findIndex((record) => record.id === id)
    if (recordIndex !== -1) {
      insulinHistory.value[recordIndex].notes = newNote
    }
  }

  return {
    insulinHistory,
    addRecord,
    getRecords,
    updateRecordNote,
  }
}
