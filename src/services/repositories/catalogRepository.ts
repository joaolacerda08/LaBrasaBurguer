import type { Category, Product } from '../../types/domain'

export interface CatalogRepository {
  getCategories(): Promise<Category[]>
  getProducts(): Promise<Product[]>
}
