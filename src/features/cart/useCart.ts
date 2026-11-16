import { useEffect, useMemo, useState } from 'react'
import type { CartItem } from '../../types/domain'

const STORAGE_KEY = 'la-brasa-cart-v1'

function readCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) as CartItem[] : []
  } catch {
    return []
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(readCart)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch { /* A sacola continua utilizável durante esta sessão. */ }
  }, [items])

  const count = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items])

  function add(productId: string, selectedAddonIds: string[], quantity: number) {
    const normalizedAddons = [...selectedAddonIds].sort()
    const lineId = `${productId}:${normalizedAddons.join(',')}`
    setItems((current) => {
      const existing = current.find((item) => item.lineId === lineId)
      if (existing) return current.map((item) => item.lineId === lineId ? { ...item, quantity: item.quantity + quantity } : item)
      return [...current, { lineId, productId, selectedAddonIds: normalizedAddons, quantity }]
    })
  }

  function setQuantity(lineId: string, quantity: number) {
    setItems((current) => quantity <= 0 ? current.filter((item) => item.lineId !== lineId) : current.map((item) => item.lineId === lineId ? { ...item, quantity } : item))
  }

  function clear() { setItems([]) }

  return { items, count, add, setQuantity, clear }
}
