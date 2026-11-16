export interface Category {
  id: string
  name: string
  description?: string
}

export interface ProductIngredient {
  id: string
  name: string
}

export interface ProductAddon {
  id: string
  name: string
  price: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: { src: string; alt: string; credit?: string }
  categoryId: string
  ingredients: ProductIngredient[]
  addons: ProductAddon[]
  available: boolean
  badge?: string
}

export interface CartItem {
  lineId: string
  productId: string
  quantity: number
  selectedAddonIds: string[]
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  items: CartItem[]
  status: OrderStatus
  subtotal: number
  fulfillment: 'pickup' | 'delivery'
  deliveryFee: number
  discount: number
  total: number
  customerName: string
  customerPhone: string
  neighborhood?: string
  deliveryAddress?: { street: string; number: string; reference?: string }
  couponCode?: string
  createdAt: string
}

export interface Coupon {
  code: string
  kind: 'percentage' | 'fixed'
  value: number
  active: boolean
}

export interface StoreConfig {
  id: string
  name: string
  tagline: string
  description: string
  logo: { src?: string; alt: string; fallbackText: string }
  contact: { phone?: string; whatsapp?: string; email?: string; address?: string; city?: string }
  theme: { background: string; surface: string; accent: string; fontFamily: string }
  hours: {
    timeZone: string
    weekly: Record<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', { open: string; close: string } | null>
  }
  coupons: Coupon[]
  categories: Category[]
  products: Product[]
}
