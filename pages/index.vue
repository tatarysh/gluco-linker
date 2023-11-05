
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-text-field label="Poziom cukru we krwi" type="number" v-model="sugarLevel"/>
        <v-text-field label="Ilość węglowodanów do posiłku" type="number" v-model="carbs" />

        <v-text-field label="Ile podać insuliny" type="number" v-model="insulin" disabled />

        <div class="d-flex justify-center">
          <v-btn color="success" @click="calculate">Oblicz</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import calculateInsulinDose from '~/libs/calculate-insulin-dose'

const sugarLevel = ref<number | undefined>()
const carbs = ref<number | undefined>()
const insulin = ref()

watch([sugarLevel, carbs], () => insulin.value = undefined)

const calculate = () => {
  if( sugarLevel.value && carbs.value) {
    insulin.value = calculateInsulinDose(carbs.value, 15, sugarLevel.value)
  }
}
</script>
