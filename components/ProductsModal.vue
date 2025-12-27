<template>
  <v-dialog v-model="isOpen" max-width="600" scrollable>
    <v-card>
      <v-card-title>{{ $t('products:add_from_products') }}</v-card-title>

      <v-divider />

      <v-card-text style="max-height: 400px">
        <div v-if="availableProducts.length === 0" class="text-center pa-4 text-medium-emphasis">
          {{ $t('products:no_products_available') }}
          <div class="mt-2">
            <v-btn
              :to="localePath({ name: 'products' })"
              variant="text"
              color="primary"
            >
              {{ $t('products:go_to_products_page') }}
            </v-btn>
          </div>
        </div>

        <div v-else>
          <!-- Podsumowanie -->
          <Transition name="slide-fade">
            <v-card v-if="selectedProducts.length > 0" variant="tonal" color="success" class="mb-4">
              <v-card-text>
                <div class="text-h6">
                  {{ $t('products:total_carbs') }}: {{ totalCarbs.toFixed(1) }}{{ $t('gram:short_unit') }}
                </div>
                <div class="text-caption">
                  {{ selectedProducts.length }} {{ $t('products:products_count') }}
                </div>
              </v-card-text>
            </v-card>
          </Transition>

          <!-- Formularz dodawania produktu do listy -->
          <v-card class="mb-4" border rounded>
            <v-card-text>
              <v-select
                v-model="selectedProductId"
                :items="productSelectItems"
                :label="$t('products:select_product')"
                variant="solo-filled"
                item-title="text"
                item-value="value"
              />

              <v-text-field
                v-if="selectedProductId"
                v-model.number="weight"
                :label="$t('products:weight')"
                type="number"
                variant="solo-filled"
                persistent-placeholder
                :suffix="$t('gram:short_unit')"
                @keyup.enter="addProductToList"
              />

              <div class="d-flex justify-end">
                <v-btn
                  color="success"
                  variant="elevated"
                  @click="addProductToList"
                >
                  {{ $t('products:add_to_list') }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Lista wybranych produktów -->
          <Transition name="slide-fade">
            <div v-if="selectedProducts.length > 0">
              <div class="text-subtitle-2 mb-2">{{ $t('products:selected_products') }}:</div>

              <v-list>
              <v-list-item
                v-for="(item, index) in selectedProducts"
                :key="index"
                class="mb-1"
                border
                rounded
              >
                <template #prepend>
                  <v-icon icon="mdi-food-apple" size="small" />
                </template>

                <v-list-item-title>{{ getProductName(item.productId) }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.weight }}{{ $t('gram:short_unit') }} = {{ item.carbs.toFixed(1) }}{{ $t('gram:short_unit') }} {{ $t('products:carbs_short') }}
                </v-list-item-subtitle>

                <template #append>
                  <v-btn
                    icon="mdi-close"
                    size="small"
                    variant="text"
                    @click="removeProduct(index)"
                  />
                </template>
              </v-list-item>
              </v-list>
            </div>
          </Transition>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-btn variant="text" @click="cancel">
          {{ $t('cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          color="success"
          @click="confirm"
          :disabled="selectedProducts.length === 0"
        >
          <span class="d-none d-sm-inline">
            {{ $t('products:apply_to_calculator') }}
          </span>
          <span class="d-sm-none">
            {{ $t('apply_short') }}
          </span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useProducts, type Product, type SelectedProduct } from '../composable/use-products'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': [totalCarbs: number]
}>()

const i18n = useI18n()
const localePath = useLocalePath()
const { products, getProductById, calculateCarbs } = useProducts()

// Dialog state
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Dostępne produkty
const availableProducts = computed(() => products.value)

// Items dla v-select
const productSelectItems = computed(() => {
  return availableProducts.value.map(p => ({
    text: `${p.name} (${p.carbsPer100g}g/100g)`,
    value: p.id,
  }))
})

// Stan formularza
const selectedProductId = ref<string>('')
const weight = ref<number | undefined>(undefined)
const selectedProducts = ref<SelectedProduct[]>([])

// Automatyczne ustawienie domyślnej wagi
watch(selectedProductId, (newId) => {
  if (newId) {
    const product = getProductById(newId)
    if (product?.defaultWeight) {
      weight.value = product.defaultWeight
    } else {
      weight.value = undefined
    }
  }
})

// Walidacja
const canAddProduct = computed(() => {
  return selectedProductId.value && weight.value && weight.value > 0
})

// Suma węglowodanów
const totalCarbs = computed(() => {
  return selectedProducts.value.reduce((sum, item) => sum + item.carbs, 0)
})

// Pobierz nazwę produktu
const getProductName = (productId: string): string => {
  return getProductById(productId)?.name || '?'
}

// Dodaj produkt do listy
const addProductToList = () => {
  if (!canAddProduct.value) return

  const product = getProductById(selectedProductId.value)
  if (!product) return

  const carbs = calculateCarbs(product.carbsPer100g, weight.value!)

  selectedProducts.value.push({
    productId: product.id,
    weight: weight.value!,
    carbs,
  })

  // Reset formularza
  selectedProductId.value = ''
  weight.value = undefined
}

// Usuń produkt z listy
const removeProduct = (index: number) => {
  selectedProducts.value.splice(index, 1)
}

// Anuluj
const cancel = () => {
  isOpen.value = false
  resetModal()
}

// Zatwierdź
const confirm = () => {
  emit('confirm', totalCarbs.value)
  isOpen.value = false
  resetModal()
}

// Reset modalu
const resetModal = () => {
  selectedProductId.value = ''
  weight.value = undefined
  selectedProducts.value = []
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
