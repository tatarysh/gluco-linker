<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <!-- Formularz dodawania/edycji produktu -->
        <div class="mb-4">
          <div class="text-h6 mb-3">
            {{ editingProduct ? $t('products:edit_product') : $t('products:add_product') }}
          </div>
          <v-form v-model="valid" validate-on="lazy blur" @submit.prevent="onSubmit">
            <v-text-field
              v-model="form.name"
              :label="$t('products:product_name')"
              variant="solo-filled"
              persistent-placeholder
              :rules="[rules.required]"
            />
            <v-text-field
              v-model.number="form.carbsPer100g"
              :label="$t('products:carbs_per_100g')"
              type="number"
              variant="solo-filled"
              persistent-placeholder
              :suffix="$t('gram:short_unit')"
              :rules="[rules.required, rules.gt(0), rules.lt(100)]"
            />
            <v-text-field
              v-model.number="form.defaultWeight"
              :label="$t('products:default_weight_optional')"
              type="number"
              variant="solo-filled"
              persistent-placeholder
              :suffix="$t('gram:short_unit')"
              :rules="[rules.gtOptional(0)]"
            />

            <div class="d-flex justify-end gap-2">
              <v-btn
                v-if="editingProduct"
                color="error"
                variant="text"
                @click="cancelEdit"
              >
                {{ $t('cancel') }}
              </v-btn>
              <v-btn
                color="success"
                @click="onSubmit"
              >
                {{ editingProduct ? $t('update') : $t('add') }}
              </v-btn>
            </div>
          </v-form>
        </div>

        <!-- Lista produktów -->
        <v-card elevation="2">
          <v-card-title>{{ $t('products:product_list') }}</v-card-title>
          <v-card-text>
            <div v-if="sortedProducts.length === 0" class="text-center pa-4 text-medium-emphasis">
              {{ $t('products:no_products') }}
            </div>

            <v-list v-else>
              <v-list-item
                v-for="product in sortedProducts"
                :key="product.id"
                class="mb-2"
                border
                rounded
              >
                <template #prepend>
                  <v-icon icon="mdi-food-apple" />
                </template>

                <v-list-item-title>{{ product.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ product.carbsPer100g }}{{ $t('gram:short_unit') }} / 100{{ $t('gram:short_unit') }}
                  <span v-if="product.defaultWeight">
                    • {{ $t('products:default') }}: {{ product.defaultWeight }}{{ $t('gram:short_unit') }}
                  </span>
                </v-list-item-subtitle>

                <template #append>
                  <div class="d-flex gap-1">
                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      variant="text"
                      @click="startEdit(product)"
                    />
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      @click="confirmDelete(product)"
                    />
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog potwierdzenia usunięcia -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>{{ $t('products:confirm_delete') }}</v-card-title>
        <v-card-text>
          {{ $t('products:confirm_delete_message', { name: productToDelete?.name }) }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">
            {{ $t('cancel') }}
          </v-btn>
          <v-btn color="error" variant="text" @click="deleteProduct">
            {{ $t('delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { useProducts, type Product } from '../../composable/use-products'

const i18n = useI18n()
const { products, addProduct, updateProduct, deleteProduct: deleteProductFn } = useProducts()

// Walidacja
type Validator = (value: unknown) => true | string
type FunctionValidator = (params: any) => Validator

const rules: Record<string, Validator | FunctionValidator> = {
  required: (value: unknown) => {
    if (value && String(value).trim().length > 0) {
      return true
    }
    return i18n.t('rules:required')
  },
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
  gtOptional: (number: number) => (value: unknown) => {
    if (value === undefined || value === null || value === '') {
      return true
    }
    if (typeof value === 'number' && value > number) {
      return true
    }
    return i18n.t('rules:number_greater_than', { number })
  },
}

// Stan formularza
const valid = ref(false)
const editingProduct = ref<Product | null>(null)
const form = ref({
  name: '',
  carbsPer100g: undefined as number | undefined,
  defaultWeight: undefined as number | undefined,
})

// Sortowanie produktów alfabetycznie
const sortedProducts = computed(() => {
  return [...products.value].sort((a, b) => a.name.localeCompare(b.name))
})

// Obsługa formularza
const onSubmit = () => {
  if (!valid.value) return

  if (editingProduct.value) {
    updateProduct(editingProduct.value.id, {
      name: form.value.name,
      carbsPer100g: form.value.carbsPer100g!,
      defaultWeight: form.value.defaultWeight,
    })
    cancelEdit()
  } else {
    addProduct(
      form.value.name,
      form.value.carbsPer100g!,
      form.value.defaultWeight
    )
    resetForm()
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    carbsPer100g: undefined,
    defaultWeight: undefined,
  }
}

const startEdit = (product: Product) => {
  editingProduct.value = product
  form.value = {
    name: product.name,
    carbsPer100g: product.carbsPer100g,
    defaultWeight: product.defaultWeight,
  }
}

const cancelEdit = () => {
  editingProduct.value = null
  resetForm()
}

// Usuwanie produktu
const deleteDialog = ref(false)
const productToDelete = ref<Product | null>(null)

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  deleteDialog.value = true
}

const deleteProduct = () => {
  if (productToDelete.value) {
    deleteProductFn(productToDelete.value.id)
    deleteDialog.value = false
    productToDelete.value = null
    if (editingProduct.value?.id === productToDelete.value?.id) {
      cancelEdit()
    }
  }
}

// SEO Meta tags
useSeoMeta({
  title: computed(() => `${i18n.t('products:product_list')} - ${i18n.t('app.name')}`),
  description: computed(() => i18n.t('products:description') || i18n.t('app.description')),
  ogTitle: computed(() => `${i18n.t('products:product_list')} - ${i18n.t('app.name')}`),
  ogDescription: computed(() => i18n.t('products:description') || i18n.t('app.description')),
  ogType: 'website',
  twitterCard: 'summary',
  twitterTitle: computed(() => `${i18n.t('products:product_list')} - ${i18n.t('app.name')}`),
  twitterDescription: computed(() => i18n.t('products:description') || i18n.t('app.description')),
})
</script>
