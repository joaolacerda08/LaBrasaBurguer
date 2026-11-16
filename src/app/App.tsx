import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUpRight, Clock3, MapPin, MessageCircle, Plus, Utensils } from 'lucide-react'
import { Link, Route, Routes } from 'react-router-dom'
import { CartDrawer } from '../components/storefront/CartDrawer'
import { FloatingIngredients } from '../components/storefront/FloatingIngredients'
import { ProductCard } from '../components/storefront/ProductCard'
import { ProductDetailsDialog } from '../components/storefront/ProductDetailsDialog'
import { BrandMark, SiteHeader } from '../components/storefront/SiteHeader'
import { StoreStatusBar } from '../components/storefront/StoreStatusBar'
import { storeConfig } from '../config/store'
import { useCart } from '../features/cart/useCart'
import { getWeeklyScheduleText } from '../features/storefront/openingStatus'
import { localCatalogRepository } from '../services/repositories/localCatalogRepository'
import type { Category, Product } from '../types/domain'

function Storefront() {
  const [categories, setCategories] = useState<Category[]>(storeConfig.categories)
  const [products, setProducts] = useState<Product[]>(storeConfig.products)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const cart = useCart()

  useEffect(() => {
    let cancelled = false
    Promise.all([localCatalogRepository.getCategories(), localCatalogRepository.getProducts()]).then(([nextCategories, nextProducts]) => {
      if (!cancelled) { setCategories(nextCategories); setProducts(nextProducts) }
    })
    return () => { cancelled = true }
  }, [])

  const visibleProducts = useMemo(() => activeCategory === 'all' ? products : products.filter((product) => product.categoryId === activeCategory), [activeCategory, products])
  const storePhone = storeConfig.contact.whatsapp?.replace(/\D/g, '') ?? ''
  const localPhone = storePhone.startsWith('55') ? storePhone.slice(2) : storePhone
  const displayPhone = localPhone.length === 11 ? `(${localPhone.slice(0, 2)}) ${localPhone.slice(2, 7)}-${localPhone.slice(7)}` : localPhone
  const addToCart = (product: Product, addons: string[] = [], quantity = 1) => cart.add(product.id, addons, quantity)
  const handleHeroPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 14
    const depths = { meat: 0.35, cheese: -0.7, lettuce: 0.55, pickle: -0.45 }
    for (const [name, depth] of Object.entries(depths)) {
      event.currentTarget.style.setProperty(`--${name}-x`, `${x * depth}px`)
      event.currentTarget.style.setProperty(`--${name}-y`, `${y * depth}px`)
    }
  }
  const resetHeroParallax = (event: React.PointerEvent<HTMLDivElement>) => {
    for (const name of ['meat', 'cheese', 'lettuce', 'pickle']) {
      event.currentTarget.style.setProperty(`--${name}-x`, '0px')
      event.currentTarget.style.setProperty(`--${name}-y`, '0px')
    }
  }

  return (
    <div className="app-shell" style={{ '--bg': storeConfig.theme.background, '--surface': storeConfig.theme.surface, '--accent': storeConfig.theme.accent, '--store-font': storeConfig.theme.fontFamily } as React.CSSProperties}>
      <SiteHeader storeName={storeConfig.name} logo={storeConfig.logo} cartCount={cart.count} onOpenCart={() => setCartOpen(true)} />
      <StoreStatusBar store={storeConfig} />

      <main>
        <section className="hero section-wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-rule" /> O FOGO ACESO EM BELO HORIZONTE</div>
            <h1 id="hero-title">A brasa<br />que <em>chama.</em></h1>
            <p>Escolha seu burger, personalize cada detalhe e receba o sabor da La Brasa do seu jeito.</p>
            <div className="hero-actions">
              <a className="primary-button" href="#cardapio">Explorar cardápio <ArrowUpRight size={16} /></a>
              <a className="hero-text-link" href="#sobre"><span><ArrowDown size={15} /></span> Conheça a casa</a>
            </div>
            <div className="hero-note"><span className="note-mark"><Utensils size={15} /></span><span>Do primeiro fogo ao último detalhe<br /><small>Escolha, personalize e peça em poucos passos.</small></span></div>
          </div>
          <div className="hero-visual" onPointerMove={handleHeroPointerMove} onPointerLeave={resetHeroParallax}>
            <FloatingIngredients />
            <div className="hero-photo-wrap">
              <img src="https://images.unsplash.com/photo-1700835880623-057175724242?auto=format&fit=crop&w=1200&q=85" alt="Hambúrguer artesanal com cheddar, bacon e cebola caramelizada" />
              <span className="hero-photo-index">LA <i /> BRASA</span>
              <div className="hero-stamp"><span>NO PONTO</span><strong>feito<br />na brasa</strong><span>LA BRASA</span></div>
            </div>
            <div className="hero-caption"><span>Seu próximo favorito</span><span>La Brasa <b>·</b> direto do fogo</span></div>
            <span className="hero-side-note">LA BRASA · BELO HORIZONTE</span>
          </div>
          <div className="hero-bottom"><span>01 / 03</span><span className="scroll-hint">ROLE PARA DESCOBRIR <ArrowDown size={13} /></span></div>
        </section>

        <section className="menu-section section-wrap" id="cardapio" aria-labelledby="menu-title">
          <div className="section-heading">
            <div><span className="eyebrow"><span className="eyebrow-rule" /> O QUE SAI DA CHAPA</span><h2 id="menu-title">Feito para <em>dar vontade.</em></h2></div>
            <p>Cada receita tem um motivo para estar aqui. Escolha a sua e deixe o resto com a gente.</p>
          </div>
          <div className="category-row" role="group" aria-label="Filtrar produtos por categoria">
            <button className={`category-filter${activeCategory === 'all' ? ' active' : ''}`} type="button" aria-pressed={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>Tudo <span>{products.length}</span></button>
            {categories.map((category) => <button className={`category-filter${activeCategory === category.id ? ' active' : ''}`} type="button" aria-pressed={activeCategory === category.id} key={category.id} onClick={() => setActiveCategory(category.id)}>{category.name}<span>{products.filter((product) => product.categoryId === category.id).length}</span></button>)}
          </div>
          <div className="product-grid">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} categoryName={categories.find((category) => category.id === product.categoryId)?.name} onSelect={setSelectedProduct} onQuickAdd={(item) => addToCart(item)} />)}
            {visibleProducts.length === 0 && <div className="no-products">Nenhum item nesta categoria por enquanto.</div>}
          </div>
          <div className="menu-footer"><span>Mostrando {visibleProducts.length} {visibleProducts.length === 1 ? 'item' : 'itens'}</span><a href="#cardapio">Ver o cardápio <ArrowUpRight size={15} /></a></div>
        </section>

        <section className="promise-section" id="sobre">
          <div className="promise-inner section-wrap">
            <div className="promise-mark"><BrandMark logo={storeConfig.logo} /></div>
            <div className="promise-copy"><span className="eyebrow">A BRASA É O COMEÇO</span><h2>Seu momento<br />merece <em>mais fogo.</em></h2></div>
            <p>{storeConfig.description} Escolha seus ingredientes, monte seu pedido e aproveite cada mordida.</p>
            <div className="promise-arrow"><ArrowUpRight size={20} /></div>
          </div>
        </section>

        <section className="visit-section section-wrap" id="localizacao">
          <div><span className="eyebrow"><span className="eyebrow-rule" /> A CASA LA BRASA</span><h2>Vem sentir<br /><em>o calor da casa.</em></h2></div>
          <div className="visit-details">
            <div className="visit-address"><MapPin size={17} /><span><b>Endereço para retirada</b><small>{storeConfig.contact.address}</small><small>{storeConfig.contact.city}</small></span></div>
            {storePhone && <a className="visit-whatsapp" href={`https://wa.me/${storePhone.startsWith('55') ? storePhone : `55${storePhone}`}`} target="_blank" rel="noreferrer noopener"><MessageCircle size={16} /><span><b>WhatsApp oficial</b><small>{displayPhone}</small></span><ArrowUpRight size={15} /></a>}
            <div className="weekly-hours" id="horarios"><div className="weekly-hours-title"><Clock3 size={16} /><b>Horários da casa</b></div>{getWeeklyScheduleText(storeConfig).map((line) => { const [day, hours] = line.split(': '); return <div className="weekly-hours-row" key={day}><span>{day}</span><span>{hours}</span></div> })}</div>
            <button className="outline-button" type="button" onClick={() => setCartOpen(true)}>Começar pedido <Plus size={16} /></button>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-inner section-wrap"><Link className="brand footer-brand" to="/" aria-label={`${storeConfig.name}, início`}><BrandMark logo={storeConfig.logo} /><span className="brand-name">{storeConfig.name}<small>BURGER & BRASA</small></span></Link><span>Fogo aceso. Sabor no ponto.</span><a href="#cardapio">Voltar ao topo ↑</a><small>© 2026 · La Brasa</small></div></footer>

      <ProductDetailsDialog product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />
      <CartDrawer open={cartOpen} store={storeConfig} items={cart.items} products={products} onClose={() => setCartOpen(false)} onQuantityChange={cart.setQuantity} onClear={cart.clear} />
    </div>
  )
}

function NotFound() {
  return <main className="not-found"><span className="eyebrow">LA BRASA</span><h1>Essa página ainda não existe.</h1><p>Volte para o cardápio e escolha seus favoritos.</p><Link className="primary-button" to="/">Voltar para a loja <ArrowUpRight size={16} /></Link></main>
}

export default function App() {
  return <Routes><Route path="/" element={<Storefront />} /><Route path="*" element={<NotFound />} /></Routes>
}
