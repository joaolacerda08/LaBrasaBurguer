import type { CartItem, Product } from '../../types/domain'

export function getItemPrice(item: CartItem, product: Product) {
  const additions = product.addons
    .filter((addon) => item.selectedAddonIds.includes(addon.id))
    .reduce((total, addon) => total + addon.price, 0)
  return (product.price + additions) * item.quantity
}

export function getCartSubtotal(items: CartItem[], products: Product[]) {
  return items.reduce((total, item) => {
    const product = products.find((candidate) => candidate.id === item.productId)
    return total + (product ? getItemPrice(item, product) : 0)
  }, 0)
}
