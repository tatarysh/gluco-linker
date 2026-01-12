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
          append-icon="mdi-nutrition"
          @click:append="productsModalOpen = true"
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
      </v-col>
    </v-row>

    <ProductsModal
      v-model="productsModalOpen"
      @confirm="handleProductsConfirm"
    />
  </v-container>
</template>

<script setup lang="ts">
import calculateInsulinDose from '../libs/calculate-insulin-dose'
import type { Report } from '../libs/calculate-insulin-dose'
import { calculatorSettings } from '../composable/use-calculator-settings'
import ProductsModal from '../components/ProductsModal.vue'

const i18n = useI18n()

// SEO Meta tags
useSeoMeta({
  title: computed(() => `${i18n.t('app.name')} - ${i18n.t('app.description')}`),
  description: computed(() => i18n.t('app.description')),
  ogTitle: computed(() => i18n.t('app.name')),
  ogDescription: computed(() => i18n.t('app.description')),
  ogType: 'website',
  twitterCard: 'summary',
  twitterTitle: computed(() => i18n.t('app.name')),
  twitterDescription: computed(() => i18n.t('app.description')),
})

const sugarLevel = ref<number | undefined>()
const carbAmount = ref<number | undefined>()
const insulinDose = ref<Report>()
const productsModalOpen = ref(false)

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

const handleProductsConfirm = (totalCarbs: number) => {
  carbAmount.value = totalCarbs
}
</script>

<style lang="css">
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
