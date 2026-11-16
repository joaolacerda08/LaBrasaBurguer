import { useEffect, useMemo, useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import type { Product } from '../../types/domain'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

interface ProductDetailsDialogProps {
  product: Product | null
  onClose: () => void
  onAdd: (product: Product, addonIds: string[], quantity: number) => void
}

export function ProductDetailsDialog({ product, onClose, onAdd }: ProductDetailsDialogProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setSelectedAddons([])
    setQuantity(1)
  }, [product?.id])

  useEffect(() => {
    if (!product) return
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [product, onClose])

  const total = useMemo(() => {
    if (!product) return 0
    const addOnTotal = product.addons.filter((addon) => selectedAddons.includes(addon.id)).reduce((sum, addon) => sum + addon.price, 0)
    return (product.price + addOnTotal) * quantity
  }, [product, quantity, selectedAddons])

  if (!product) return null

  const toggleAddon = (id: string) => setSelectedAddons((current) => current.includes(id) ? current.filter((addonId) => addonId !== id) : [...current, id])

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <button className="icon-button dialog-close" type="button" onClick={onClose} aria-label="Fechar detalhes"><X size={19} /></button>
        <div className="dialog-image"><img src={product.image.src} alt={product.image.alt} /></div>
        <div className="dialog-content">
          <span className="eyebrow">FEITO NA CHAPA</span>
          <h2 id="dialog-title">{product.name}</h2>
          <p className="dialog-description">{product.description}</p>
          <div className="dialog-section">
            <h3>Vai no seu burger</h3>
            <ul className="ingredient-list">{product.ingredients.map((ingredient) => <li key={ingredient.id}>{ingredient.name}</li>)}</ul>
          </div>
          {product.addons.length > 0 && <div className="dialog-section">
            <h3>Deixa do seu jeito <span>opcional</span></h3>
            <div className="addon-list">{product.addons.map((addon) => <label className="addon-option" key={addon.id}>
              <input type="checkbox" checked={selectedAddons.includes(addon.id)} onChange={() => toggleAddon(addon.id)} />
              <span>{addon.name}</span><small>+ {currency.format(addon.price)}</small>
            </label>)}</div>
          </div>}
          <div className="dialog-actions">
            <div className="quantity-control" aria-label="Quantidade">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Diminuir quantidade"><Minus size={15} /></button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Aumentar quantidade"><Plus size={15} /></button>
            </div>
            <button className="primary-button add-to-cart" type="button" onClick={() => { onAdd(product, selectedAddons, quantity); onClose() }}>
              Adicionar <strong>{currency.format(total)}</strong>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
