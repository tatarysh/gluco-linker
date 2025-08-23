<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-text-field
          v-model.number="sugarLevel"
          :label="$t('sugar.level')"
          type="number"
          suffix="mg/dL"
          persistent-placeholder
          variant="solo-filled"
        />
        <v-text-field
          v-model.number="carbAmount"
          :label="$t('carb.amount')"
          type="number"
          persistent-placeholder
          variant="solo-filled"
          :suffix="$t('gram:short_unit')"
        />

        <v-text-field
          :value="sumInsulin"
          :label="$t('insulin.dose')"
          :suffix="$t('units')"
          type="number"
          :disabled="true"
          persistent-placeholder
          variant="solo"
          :messages="details"
        />

        <div class="d-flex justify-center my-3">
          <v-btn color="success" @click="calculate">{{ $t('calculate') }}</v-btn>
        </div>

        <div class="d-flex justify-center my-3">
          <v-btn color="primary" :disabled="!sumInsulin || parseFloat(sumInsulin) <= 0" @click="saveRecord">{{ $t('save') }}</v-btn>
        </div>

        <v-checkbox v-model="showNotes" :label="$t('calculator:add_notes')" />

        <v-textarea
          v-if="showNotes"
          v-model="note"
          :label="$t('calculator:notes')"
          variant="outlined"
          auto-grow
          rows="3"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import calculateInsulinDose from '../libs/calculate-insulin-dose'
import type { Report } from '../libs/calculate-insulin-dose'
import { calculatorSettings } from '../composable/use-calculator-settings'
import { useInsulinHistory } from '../composable/use-insulin-history'
import { useSnackbar } from '../composable/use-snackbar'

const i18n = useI18n()
const { addRecord } = useInsulinHistory()
const { showSnackbar } = useSnackbar()

const sugarLevel = ref<number | undefined>()
const carbAmount = ref<number | undefined>()
const insulinDose = ref<Report>()
const showNotes = ref(false)
const note = ref('')

const sumInsulin = computed(() => {
  if (!insulinDose.value) {
    return 0
  }

  const sum = insulinDose.value.dose + insulinDose.value.correction

  return (sum > 0 ? sum : 0).toFixed(2)
})

const details = computed(() => {
  if (!insulinDose.value) {
    return
  }

  return i18n.t('calculator:details', {
    dose: insulinDose.value.dose.toFixed(2),
    correction: insulinDose.value.correction.toFixed(2),
  })
})

watch([sugarLevel, carbAmount], () => (insulinDose.value = undefined))

const calculate = () => {
  if (sugarLevel.value && carbAmount.value) {
    insulinDose.value = calculateInsulinDose(carbAmount.value, sugarLevel.value, calculatorSettings.value)
  }
}

const saveRecord = () => {
  if (sumInsulin.value && parseFloat(sumInsulin.value) > 0) {
    addRecord(parseFloat(sumInsulin.value), showNotes.value ? note.value : undefined)
    sugarLevel.value = undefined
    carbAmount.value = undefined
    insulinDose.value = undefined
    showNotes.value = false
    note.value = ''
    showSnackbar(i18n.t('calculator:save_success'), 'success')
  }
}
</script>

<style lang="css">
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>