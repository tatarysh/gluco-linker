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

        <v-row class="my-3" justify="space-between">
          <v-col cols="auto">
            <v-btn color="success" @click="calculate">{{ $t('calculate') }}</v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" @click="saveCalculation" :disabled="sumInsulin === '0.00' || sumInsulin === '0'">{{ $t('save') }}</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-snackbar v-model="showSnackbar" :timeout="3000">{{ snackbarMessage }}</v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import calculateInsulinDose from '../libs/calculate-insulin-dose'
import type { Report } from '../libs/calculate-insulin-dose'
import { calculatorSettings } from '../composable/use-calculator-settings'
import { useHistory } from '~/composable/use-history'

const { addHistoryEntry } = useHistory()
const i18n = useI18n()

const sugarLevel = ref<number | undefined>()
const carbAmount = ref<number | undefined>()
const insulinDose = ref<Report>()
const showSnackbar = ref(false)
const snackbarMessage = ref('')

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

const saveCalculation = () => {
  if (insulinDose.value && sugarLevel.value && carbAmount.value) {
    const newEntry = {
      inputs: {
        glucose: sugarLevel.value,
        carbs: carbAmount.value,
      },
      result: {
        insulinDose: insulinDose.value.dose + insulinDose.value.correction,
      },
    };
    console.log('Adding history entry:', newEntry);
    addHistoryEntry(newEntry);
    snackbarMessage.value = i18n.t('save.success')
    showSnackbar.value = true
    sugarLevel.value = undefined
    carbAmount.value = undefined
    insulinDose.value = undefined
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
