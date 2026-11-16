import { useEffect, useMemo, useState } from 'react'
import { Check, Flame, MapPin, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import type { CartItem, Coupon, Product, StoreConfig } from '../../types/domain'
import { getCartSubtotal, getItemPrice } from '../../features/cart/cartMath'
import { beloHorizonteNeighborhoods } from '../../data/beloHorizonteNeighborhoods'
import { buildWhatsAppOrderMessage, buildWhatsAppShareUrl } from '../../features/orders/whatsappMessage'
import { recordOrderBeforeWhatsApp, type LocalOrderRecord } from '../../services/repositories/localOrderRepository'

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const DELIVERY_FEE = 5.9

interface CartDrawerProps {
  open: boolean
  store: StoreConfig
  items: CartItem[]
  products: Product[]
  onClose: () => void
  onQuantityChange: (lineId: string, quantity: number) => void
  onClear: () => void
}

function couponValue(coupon: Coupon | null, subtotal: number) {
  if (!coupon) return 0
  const amount = coupon.kind === 'percentage' ? subtotal * (coupon.value / 100) : coupon.value
  return Math.min(subtotal, Math.round(amount * 100) / 100)
}

export function CartDrawer({ open, store, items, products, onClose, onQuantityChange, onClear }: CartDrawerProps) {
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Pix')
  const [changeFor, setChangeFor] = useState('')
  const [observations, setObservations] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [reference, setReference] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponFeedback, setCouponFeedback] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const subtotal = useMemo(() => getCartSubtotal(items, products), [items, products])
  const discount = couponValue(appliedCoupon, subtotal)
  const deliveryFee = fulfillment === 'delivery' ? DELIVERY_FEE : 0
  const total = Math.max(0, subtotal + deliveryFee - discount)

  if (!open) return null

  function applyCoupon() {
    const normalized = couponCode.trim().toLocaleUpperCase('pt-BR')
    const match = store.coupons.find((coupon) => coupon.active && coupon.code.toLocaleUpperCase('pt-BR') === normalized)
    if (!normalized) {
      setAppliedCoupon(null)
      setCouponFeedback('Digite um cupom para validar.')
      return
    }
    if (!match) {
      setAppliedCoupon(null)
      setCouponFeedback('Cupom não encontrado ou fora da validade.')
      return
    }
    setAppliedCoupon(match)
    setCouponFeedback(`Cupom aplicado: ${match.kind === 'percentage' ? `${match.value}% de desconto` : `${currency.format(match.value)} de desconto`}.`)
    setFeedback('')
  }

  function sendOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    if (!customerName.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setFeedback('Informe seu nome e um telefone com DDD para continuar.')
      return
    }
    if (fulfillment === 'pickup' && !store.contact.address?.trim()) {
      setFeedback('O endereço de retirada da loja ainda precisa ser configurado.')
      return
    }
    if (fulfillment === 'delivery' && (!neighborhood || !street.trim() || !number.trim())) {
      setFeedback('Complete o bairro, a rua e o número para a entrega.')
      return
    }

    const orderId = `LB-${Date.now().toString().slice(-6)}`
    const orderItems = items.flatMap((item) => {
      const product = products.find((candidate) => candidate.id === item.productId)
      if (!product) return []
      const extras = product.addons.filter((addon) => item.selectedAddonIds.includes(addon.id)).map((addon) => addon.name)
      return [{
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        personalizations: extras,
        total: getItemPrice(item, product),
      }]
    })
    const deliveryAddress = fulfillment === 'pickup'
      ? `${store.contact.address}, ${store.contact.city}`
      : `${street.trim()}, ${number.trim()} — ${neighborhood}, ${store.contact.city}`
    const orderReference = fulfillment === 'delivery' ? reference.trim() || 'Não informada' : 'Não se aplica'
    const parsedChange = Number(changeFor.replace(',', '.'))
    const changeDescription = paymentMethod === 'Dinheiro'
      ? (changeFor.trim() && Number.isFinite(parsedChange) && parsedChange > 0 ? currency.format(parsedChange) : 'Não precisa')
      : 'Não se aplica'
    const timestamp = new Intl.DateTimeFormat('pt-BR', {
      timeZone: store.hours.timeZone, dateStyle: 'short', timeStyle: 'short', hourCycle: 'h23',
    }).format(new Date())
    const message = buildWhatsAppOrderMessage({
      orderNumber: orderId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      items: orderItems,
      subtotal,
      discount,
      couponCode: appliedCoupon?.code,
      deliveryFee,
      total,
      fulfillment,
      address: deliveryAddress,
      reference: orderReference,
      paymentMethod,
      changeFor: changeDescription,
      observations: observations.trim() || 'Sem observações.',
      orderedAt: timestamp,
    })
    const localOrder: LocalOrderRecord = {
      id: orderId,
      status: 'awaiting-whatsapp',
      createdAt: new Date().toISOString(),
      message,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      fulfillment,
      address: deliveryAddress,
      reference: orderReference,
      paymentMethod,
      changeFor: changeDescription,
      observations: observations.trim() || 'Sem observações.',
      items: orderItems,
      subtotal,
      discount,
      deliveryFee,
      total,
      couponCode: appliedCoupon?.code,
    }
    const result = recordOrderBeforeWhatsApp(localOrder, undefined, () => {
      const popup = window.open(buildWhatsAppShareUrl(store.contact.whatsapp ?? '', message), '_blank')
      if (!popup) return false
      popup.opener = null
      return true
    })
    if (result.recorded && result.opened) {
      setFeedback(`Pedido ${orderId} salvo neste dispositivo e preparado para o WhatsApp. Confira os dados e toque em enviar na conversa.`)
    } else if (result.recorded) {
      setFeedback(`Pedido ${orderId} salvo neste dispositivo, mas o WhatsApp não abriu. Tente novamente; o pedido ainda não foi enviado à loja.`)
    } else if (result.opened) {
      setFeedback('WhatsApp aberto. Não foi possível salvar uma cópia local deste pedido.')
    } else {
      setFeedback('Não foi possível salvar uma cópia local nem abrir o WhatsApp. O pedido ainda não foi enviado à loja.')
    }
  }

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <aside className="cart-drawer checkout-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-heading">
        <div className="drawer-header">
          <div><span className="eyebrow"><Flame size={12} /> LA BRASA · PEDIDOS</span><h2 id="cart-heading">Sua sacola <span>({items.reduce((sum, item) => sum + item.quantity, 0)})</span></h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar sacola"><X size={20} /></button>
        </div>
        {items.length === 0 ? <div className="empty-cart">
          <span className="empty-cart-icon"><ShoppingBag size={23} /></span>
          <h3>A sacola está vazia</h3><p>Escolha seus favoritos no cardápio.</p>
          <button type="button" className="text-button" onClick={onClose}>Voltar ao cardápio</button>
        </div> : <>
          <div className="checkout-scroll">
            <div className="cart-lines">{items.map((item) => {
              const product = products.find((candidate) => candidate.id === item.productId)
              if (!product) return null
              const addonNames = product.addons.filter((addon) => item.selectedAddonIds.includes(addon.id)).map((addon) => addon.name)
              return <article className="cart-line" key={item.lineId}>
                <img src={product.image.src} alt="" />
                <div className="cart-line-copy"><strong>{product.name}</strong>
                  {addonNames.length > 0 && <small>{addonNames.join(' · ')}</small>}
                  <span>{currency.format(getItemPrice({ ...item, quantity: 1 }, product))} / un.</span>
                </div>
                <div className="cart-line-actions">
                  <div className="quantity-control compact">
                    <button type="button" onClick={() => onQuantityChange(item.lineId, item.quantity - 1)} aria-label={`Diminuir ${product.name}`}><Minus size={13} /></button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => onQuantityChange(item.lineId, item.quantity + 1)} aria-label={`Aumentar ${product.name}`}><Plus size={13} /></button>
                  </div>
                  <strong>{currency.format(getItemPrice(item, product))}</strong>
                  <button className="remove-line" type="button" onClick={() => onQuantityChange(item.lineId, 0)} aria-label={`Remover ${product.name}`}><Trash2 size={14} /></button>
                </div>
              </article>
            })}</div>

            <form className="checkout-form" onSubmit={sendOrder}>
              <fieldset className="fulfillment-options">
                <legend>Como prefere receber?</legend>
                <label className={`fulfillment-card${fulfillment === 'pickup' ? ' selected' : ''}`}>
                  <input type="radio" name="fulfillment" value="pickup" checked={fulfillment === 'pickup'} onChange={() => setFulfillment('pickup')} />
                  <span className="fulfillment-icon"><MapPin size={16} /></span>
                  <span><b>Retirar no local</b><small>Sem taxa</small></span>
                  <Check className="fulfillment-check" size={15} />
                </label>
                <label className={`fulfillment-card${fulfillment === 'delivery' ? ' selected' : ''}`}>
                  <input type="radio" name="fulfillment" value="delivery" checked={fulfillment === 'delivery'} onChange={() => setFulfillment('delivery')} />
                  <span className="fulfillment-icon"><Flame size={16} /></span>
                  <span><b>Receber em casa</b><small>+ {currency.format(DELIVERY_FEE)}</small></span>
                  <Check className="fulfillment-check" size={15} />
                </label>
              </fieldset>

              {fulfillment === 'pickup' ? <div className={`pickup-address${store.contact.address ? '' : ' address-pending'}`}>
                <MapPin size={15} /><div><strong>Endereço para retirada</strong><span>{store.contact.address || 'Endereço da unidade ainda não configurado'}</span><small>{store.contact.city}</small></div>
              </div> : <div className="delivery-fields">
                <label className="form-label">Bairro
                  <select required value={neighborhood} onChange={(event) => setNeighborhood(event.target.value)}>
                    <option value="">Selecione seu bairro</option>
                    {beloHorizonteNeighborhoods.map((area) => <option key={area} value={area}>{area}</option>)}
                  </select>
                </label>
                <div className="address-grid">
                  <label className="form-label">Rua / avenida<input required value={street} onChange={(event) => setStreet(event.target.value)} placeholder="Nome da via" autoComplete="street-address" /></label>
                  <label className="form-label number-field">Número<input required value={number} onChange={(event) => setNumber(event.target.value)} placeholder="Nº" inputMode="numeric" /></label>
                </div>
                <label className="form-label">Ponto de referência <span>opcional</span><input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Ex.: portaria, casa amarela..." /></label>
              </div>}

              <div className="customer-fields">
                <label className="form-label">Seu nome<input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Como podemos chamar você?" autoComplete="name" /></label>
                <label className="form-label">WhatsApp com DDD<input required value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="(31) 99999-9999" inputMode="tel" autoComplete="tel" /></label>
              </div>

              <div className={`payment-fields${paymentMethod === 'Dinheiro' ? ' has-change' : ''}`}>
                <label className="form-label">Forma de pagamento
                  <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                    <option>Pix</option><option>Cartão de débito</option><option>Cartão de crédito</option><option>Dinheiro</option>
                  </select>
                </label>
                {paymentMethod === 'Dinheiro' && <label className="form-label">Troco para <span>opcional</span><input value={changeFor} onChange={(event) => setChangeFor(event.target.value)} placeholder="Ex.: 50,00 — vazio se não precisar" inputMode="decimal" /></label>}
              </div>
              <label className="form-label observations-field">Observações <span>opcional</span><textarea value={observations} onChange={(event) => setObservations(event.target.value)} placeholder="Algum detalhe para preparar o pedido?" rows={3} /></label>

              <div className="coupon-box">
                <label className="form-label" htmlFor="coupon-code">Tem um cupom?</label>
                <div className="coupon-input-row"><input id="coupon-code" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Digite seu código" autoCapitalize="characters" /><button type="button" onClick={applyCoupon}>Aplicar</button></div>
                {couponFeedback && <small className={`coupon-feedback${appliedCoupon ? ' success' : ''}`}>{couponFeedback}</small>}
              </div>

              <div className="checkout-total">
                <div><span>Subtotal</span><span>{currency.format(subtotal)}</span></div>
                <div><span>{fulfillment === 'delivery' ? 'Entrega' : 'Retirada'}</span><span>{deliveryFee ? currency.format(deliveryFee) : 'Grátis'}</span></div>
                {discount > 0 && <div className="discount-row"><span>Cupom {appliedCoupon?.code}</span><span>− {currency.format(discount)}</span></div>}
                <div className="total-row"><strong>Total</strong><strong>{currency.format(total)}</strong></div>
              </div>
              {feedback && <p className="order-feedback" role="status" aria-live="polite">{feedback}</p>}
              <button className="primary-button checkout-button send-order-button" type="submit"><span>Enviar pedido pelo WhatsApp</span><Flame size={17} /></button>
              <p className="whatsapp-note">O resumo abre no WhatsApp; você confirma o envio na conversa.</p>
            </form>
          </div>
          <div className="drawer-bottom-actions"><button className="clear-cart" type="button" onClick={onClear}>Limpar sacola</button><span>Feito com fogo. Enviado com cuidado.</span></div>
        </>}
      </aside>
    </div>
  )
}
