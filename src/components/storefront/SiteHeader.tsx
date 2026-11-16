import { ArrowUpRight, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { StoreConfig } from '../../types/domain'

interface SiteHeaderProps {
  storeName: string
  logo: StoreConfig['logo']
  cartCount: number
  onOpenCart: () => void
}

export function BrandMark({ logo }: { logo: StoreConfig['logo'] }) {
  return logo.src ? <img className="brand-image" src={logo.src} alt={logo.alt} /> : <span className="brand-mark" aria-label={logo.alt}>{logo.fallbackText}</span>
}

export function SiteHeader({ storeName, logo, cartCount, onOpenCart }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label={`${storeName}, início`}>
          <BrandMark logo={logo} />
          <span className="brand-name">{storeName}<small>HAMBURGUERIA</small></span>
        </Link>
        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#cardapio">Cardápio</a>
          <a href="#sobre">Nossa casa</a>
          <a href="#localizacao">Onde estamos</a>
        </nav>
        <div className="header-actions">
          <button className="cart-button" type="button" onClick={onOpenCart} aria-label={`Abrir sacola, ${cartCount} itens`}>
            <ShoppingBag size={18} strokeWidth={1.8} />
            <span className="cart-label">Sua sacola</span>
            <span className="cart-count">{cartCount}</span>
          </button>
          <a className="header-order" href="#cardapio">Pedir agora <ArrowUpRight size={15} /></a>
        </div>
      </div>
    </header>
  )
}
