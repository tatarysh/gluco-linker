import { useStorageAsync } from '@vueuse/core'

const initialSetting = {
  carb_insulin_ratio: 15,
  insulin_correction_factor: 30,
  target_range_bottom: 80,
  target_range_top: 130,
}

export type Settings = typeof initialSetting

export const calculatorSettings = useStorageAsync('calculator_config', { ...initialSetting })
