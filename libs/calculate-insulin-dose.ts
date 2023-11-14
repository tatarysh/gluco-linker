import type { Settings } from '../composable/use-calculator-settings'

export type Report = { dose: number; correction: number }

export default (carbohydrates: number, bloodSugarLevel: number, settings: Settings): Report => {
  const dose = carbohydrates / settings.carb_insulin_ratio

  let correction = 0

  if (settings.target_range_bottom > bloodSugarLevel) {
    correction -= (settings.target_range_bottom - bloodSugarLevel) / settings.insulin_correction_factor
  }

  if (settings.target_range_top < bloodSugarLevel) {
    correction += (bloodSugarLevel - settings.target_range_top) / settings.insulin_correction_factor
  }

  return { dose, correction }
}
