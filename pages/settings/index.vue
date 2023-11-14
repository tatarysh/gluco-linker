<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-form v-model="valid" validate-on="submit" @submit.prevent="onSubmit">
          <v-text-field
            v-model.number="setting.carb_insulin_ratio"
            type="number"
            :label="$t('setting:carb_insulin_ratio')"
            persistent-placeholder
            variant="solo-filled"
            validate-on="lazy blur"
            :rules="[rules.gt(0), rules.lt(50)]"
          />
          <v-text-field
            v-model.number="setting.insulin_correction_factor"
            type="number"
            :label="$t('setting:insulin_correction_factor')"
            persistent-placeholder
            variant="solo-filled"
            :rules="[rules.gt(10), rules.lt(50)]"
          />
          <v-text-field
            v-model.number="setting.target_range_bottom"
            type="number"
            :label="$t('setting:target_range_bottom')"
            persistent-placeholder
            variant="solo-filled"
            :rules="[rules.gt(75), rules.lt(100)]"
          />
          <v-text-field
            v-model.number="setting.target_range_top"
            type="number"
            :label="$t('setting:target_range_top')"
            persistent-placeholder
            variant="solo-filled"
            :rules="[rules.gt(100), rules.lt(200)]"
          />

          <div class="d-flex justify-center">
            <v-btn color="success" type="submit" :disabled="!valid">{{ $t('save') }}</v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { calculatorSettings } from '../../composable/use-calculator-settings'

const i18n = useI18n()

type Validator = (value: unknown) => true | string
type FunctionValidator = (params: any) => Validator

const rules: Record<string, Validator | FunctionValidator> = {
  gt: (number: number) => (value: unknown) => {
    if (typeof value === 'number' && value > number) {
      return true
    }

    return i18n.t('rules:number_greater_than', { number })
  },
  lt: (number: number) => (value: unknown) => {
    if (typeof value === 'number' && value < number) {
      return true
    }

    return i18n.t('rules:number_less_than', { number })
  },
}

const valid = ref(false)
const setting = ref({ ...calculatorSettings.value })
const onSubmit = () => (calculatorSettings.value = setting.value)
</script>
