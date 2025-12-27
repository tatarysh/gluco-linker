import { useStorageAsync } from '@vueuse/core'

export type Product = {
  id: string
  name: string
  carbsPer100g: number
  defaultWeight?: number
  createdAt: number
  updatedAt: number
}

export type SelectedProduct = {
  productId: string
  weight: number
  carbs: number
}

const initialProducts: Product[] = []

export const products = useStorageAsync('products_database', initialProducts)

export const useProducts = () => {
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  const addProduct = (name: string, carbsPer100g: number, defaultWeight?: number): Product => {
    const now = Date.now()
    const product: Product = {
      id: generateId(),
      name,
      carbsPer100g,
      defaultWeight,
      createdAt: now,
      updatedAt: now,
    }
    products.value = [...products.value, product]
    return product
  }

  const updateProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>): void => {
    products.value = products.value.map(p =>
      p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
    )
  }

  const deleteProduct = (id: string): void => {
    products.value = products.value.filter(p => p.id !== id)
  }

  const getProductById = (id: string): Product | undefined => {
    return products.value.find(p => p.id === id)
  }

  const calculateCarbs = (carbsPer100g: number, weight: number): number => {
    return (carbsPer100g * weight) / 100
  }

  return { products, addProduct, updateProduct, deleteProduct, getProductById, calculateCarbs }
}
