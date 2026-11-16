import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Plus } from 'lucide-react'
import type { Product } from '../../types/domain'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

interface ProductCardProps {
  product: Product
  categoryName?: string
  onSelect: (product: Product) => void
  onQuickAdd: (product: Product) => void
}

export function ProductCard({ product, categoryName, onSelect, onQuickAdd }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false)
  const resetTimer = useRef<number | null>(null)
  useEffect(() => () => { if (resetTimer.current) window.clearTimeout(resetTimer.current) }, [])

  function quickAdd() {
    onQuickAdd(product)
    setJustAdded(true)
    if (resetTimer.current) window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setJustAdded(false), 1_150)
  }

  return (
    <article className={`product-card${product.available ? '' : ' is-unavailable'}`}>
      <button className="product-image-button" type="button" onClick={() => onSelect(product)} aria-label={`Ver ${product.name}`}>
        <img src={product.image.src} alt={product.image.alt} loading="lazy" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {!product.available && <span className="unavailable-badge">Indisponível</span>}
        <span className="image-open" aria-hidden="true"><ArrowUpRight size={17} /></span>
      </button>
      <div className="product-copy">
        <div className="product-category">{categoryName ?? 'Da casa'}</div>
        <button type="button" className="product-title" onClick={() => onSelect(product)}>{product.name}</button>
        <p>{product.description}</p>
        <div className="product-card-footer">
          <strong>{currency.format(product.price)}</strong>
          <button className={`quick-add${justAdded ? ' quick-added' : ''}`} type="button" disabled={!product.available} onClick={quickAdd} aria-label={justAdded ? `${product.name} adicionado` : `Adicionar ${product.name} à sacola`}>
            {justAdded ? <Check size={17} strokeWidth={2.2} /> : <Plus size={17} strokeWidth={2.2} />}
          </button>
        </div>
      </div>
    </article>
  )
}
