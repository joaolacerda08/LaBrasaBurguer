export interface WhatsAppOrderItem {
  name: string
  quantity: number
  total: number
  personalizations?: string[]
  observation?: string
}

export interface WhatsAppOrderMessageData {
  orderNumber: string
  customerName: string
  customerPhone: string
  items: WhatsAppOrderItem[]
  subtotal: number
  discount?: number
  couponCode?: string
  deliveryFee: number
  total: number
  fulfillment: 'pickup' | 'delivery'
  address: string
  reference?: string
  paymentMethod: string
  changeFor?: string
  observations?: string
  orderedAt: string
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function buildWhatsAppOrderMessage(order: WhatsAppOrderMessageData) {
  const itemLines = order.items.flatMap((item) => [
    `- ${item.quantity}x ${item.name} — ${currency.format(item.total)}`,
    ...(item.personalizations?.length ? item.personalizations.map((personalization) => `  - Personalização: ${personalization}`) : []),
    ...(item.observation?.trim() ? [`  - Observação: ${item.observation.trim()}`] : []),
  ])

  return [
    '*NOVO PEDIDO — LA BRASA BURGER*',
    '--------------------',
    '',
    `PEDIDO Nº ${order.orderNumber}`,
    '',
    '*DADOS DO CLIENTE*',
    `Nome: ${order.customerName}`,
    `Telefone: ${order.customerPhone}`,
    '',
    '*ITENS DO PEDIDO*',
    itemLines.length ? itemLines.join('\n') : '- Nenhum item informado.',
    '',
    '--------------------',
    '',
    '*RESUMO DO PAGAMENTO*',
    `Subtotal: ${currency.format(order.subtotal)}`,
    ...(order.discount && order.discount > 0 ? [`Cupom ${order.couponCode ?? ''}: -${currency.format(order.discount)}`] : []),
    `Taxa de entrega: ${currency.format(order.deliveryFee)}`,
    `*TOTAL: ${currency.format(order.total)}*`,
    '',
    '*ENTREGA / RETIRADA*',
    `Modalidade: ${order.fulfillment === 'pickup' ? 'Retirada no local' : 'Entrega'}`,
    `Endereço: ${order.address}`,
    `Referência: ${order.reference?.trim() || 'Não informada'}`,
    '',
    '*FORMA DE PAGAMENTO*',
    `Pagamento: ${order.paymentMethod}`,
    `Troco para: ${order.changeFor?.trim() || 'Não se aplica'}`,
    '',
    '*OBSERVAÇÕES*',
    order.observations?.trim() || 'Sem observações.',
    '',
    '--------------------',
    `Horário do pedido: ${order.orderedAt}`,
    '',
    '*ATENÇÃO: CONFIRMAR O RECEBIMENTO DO PEDIDO COM O CLIENTE.*',
    '',
    'La Brasa Burger — Unidade Barreiro',
  ].join('\n')
}

export function buildWhatsAppShareUrl(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '')
  const recipient = digits ? (digits.startsWith('55') ? digits : `55${digits}`) : ''
  const url = new URL(`https://wa.me/${recipient}`)
  url.searchParams.set('text', message)
  return url.toString()
}
