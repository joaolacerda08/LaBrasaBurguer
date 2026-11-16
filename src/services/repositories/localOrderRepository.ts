export interface LocalOrderItem {
  productId: string
  name: string
  quantity: number
  personalizations: string[]
  total: number
}

export interface LocalOrderRecord {
  id: string
  status: 'awaiting-whatsapp'
  createdAt: string
  message: string
  customerName: string
  customerPhone: string
  fulfillment: 'pickup' | 'delivery'
  address: string
  reference: string
  paymentMethod: string
  changeFor: string
  observations: string
  items: LocalOrderItem[]
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
  couponCode?: string
}

interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const STORAGE_KEY = 'la-brasa-orders-v1'
const MAX_SAVED_ORDERS = 100

export function saveLocalOrder(order: LocalOrderRecord, storage?: StorageLike) {
  try {
    const destination = storage ?? globalThis.localStorage
    const raw = destination.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return false
    destination.setItem(STORAGE_KEY, JSON.stringify([...parsed, order].slice(-MAX_SAVED_ORDERS)))
    return true
  } catch {
    return false
  }
}

/** Persists the order before attempting the external WhatsApp handoff. */
export function recordOrderBeforeWhatsApp(
  order: LocalOrderRecord,
  storage: StorageLike | undefined,
  openWhatsApp: () => boolean,
) {
  const recorded = saveLocalOrder(order, storage)
  let opened = false
  try {
    opened = openWhatsApp()
  } catch {
    opened = false
  }
  return { recorded, opened }
}
