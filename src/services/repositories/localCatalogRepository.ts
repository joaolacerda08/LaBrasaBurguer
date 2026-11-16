import { storeCategories, storeProducts } from '../../data/storeCatalog'
import type { CatalogRepository } from './catalogRepository'

// Adaptador local; pode ser substituído por um cliente HTTP sem alterar a vitrine.
export const localCatalogRepository: CatalogRepository = {
  async getCategories() { return storeCategories },
  async getProducts() { return storeProducts },
}
