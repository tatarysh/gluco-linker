<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-text-field v-model="sugarLevel" :label="$t('sugar.level')" type="number" />
        <v-text-field v-model="carbAmount" :label="$t('carb.amount')" type="number" />

        <v-text-field v-model="insulinDose" :label="$t('insulin.dose')" type="number" disabled />

        <div class="d-flex justify-center">
          <v-btn color="success" @click="calculate">{{ $t('calculate') }}</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import calculateInsulinDose from '~/libs/calculate-insulin-dose'

const sugarLevel = ref<number | undefined>()
const carbAmount = ref<number | undefined>()
const insulinDose = ref()

watch([sugarLevel, carbAmount], () => (insulinDose.value = undefined))

const calculate = () => {
  if (sugarLevel.value && carbAmount.value) {
    insulinDose.value = calculateInsulinDose(carbAmount.value, 15, sugarLevel.value)
  }
}
</script>
