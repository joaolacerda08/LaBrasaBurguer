import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

async function loadTypeScriptModule(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  })
  const url = `data:text/javascript;base64,${Buffer.from(outputText, 'utf8').toString('base64')}`
  return import(url)
}

const { buildWhatsAppOrderMessage, buildWhatsAppShareUrl } = await loadTypeScriptModule('../src/features/orders/whatsappMessage.ts')
const { recordOrderBeforeWhatsApp } = await loadTypeScriptModule('../src/services/repositories/localOrderRepository.ts')

const sampleOrder = {
  orderNumber: '1024',
  customerName: 'João',
  customerPhone: '(31) 99999-9999',
  items: [{ name: 'Smash Burguer 2 Camadas', quantity: 2, total: 67.8, personalizations: ['Catupiry'], observation: 'Sem cebola' }],
  subtotal: 67.8,
  discount: 0,
  deliveryFee: 0,
  total: 67.8,
  fulfillment: 'pickup',
  address: 'Avenida Sinfrônio Brochado, 864 - Barreiro, Belo Horizonte',
  reference: 'Não se aplica',
  paymentMethod: 'Pix',
  changeFor: 'Não se aplica',
  observations: 'Pedido recebido.',
  orderedAt: '16/11/2026 18:45',
}

function encodeAndRead(text) {
  return new URL(buildWhatsAppShareUrl('(31) 98484-4721', text)).searchParams.get('text')
}

test('preserves simple text in the WhatsApp URL payload', () => {
  assert.equal(encodeAndRead('Pedido recebido.'), 'Pedido recebido.')
})

test('preserves Portuguese accents and cedilla', () => {
  const original = 'Pão, maionese, promoção, coração; calabresa, açúcar.'
  assert.equal(encodeAndRead(original), original)
})

test('preserves line breaks, WhatsApp formatting, special characters, and currency', () => {
  const message = buildWhatsAppOrderMessage(sampleOrder)
  const payload = encodeAndRead(message)
  assert.equal(payload, message)
  assert.match(payload, /\*NOVO PEDIDO — LA BRASA BURGER\*/)
  assert.match(payload, /2x Smash Burguer 2 Camadas — R\$ 67,80|2x Smash Burguer 2 Camadas — R\$ 67,80/)
  assert.match(payload, /  - Personalização: Catupiry\n  - Observação: Sem cebola/)
  assert.match(payload, /\n\n/)
  assert.match(payload, /Avenida Sinfrônio Brochado/)
  assert.doesNotMatch(payload, /[🔥🍔📍💰]/u)
})

test('preserves common emojis and URL-significant characters without HTML entities', () => {
  const original = '🔥 🍔 📍 💰 | & # ? % < >'
  const payload = encodeAndRead(original)
  assert.equal(payload, original)
  assert.ok(buildWhatsAppShareUrl('31984844721', original).includes('%F0%9F%94%A5'))
  assert.doesNotMatch(payload, /&#\d+;|&amp;/)
})

test('uses the official click-to-chat URL with a normalized Brazilian phone', () => {
  const url = new URL(buildWhatsAppShareUrl('(31) 98484-4721', 'Pedido recebido.'))
  assert.equal(url.origin, 'https://wa.me')
  assert.equal(url.pathname, '/5531984844721')
  assert.equal(url.searchParams.get('text'), 'Pedido recebido.')
})

test('persists a local order before attempting WhatsApp and retains it when the handoff fails', () => {
  const values = new Map()
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
  const order = { id: 'LB-1024', status: 'awaiting-whatsapp', message: buildWhatsAppOrderMessage(sampleOrder) }
  let openerSawSavedOrder = false
  const result = recordOrderBeforeWhatsApp(order, storage, () => {
    openerSawSavedOrder = JSON.parse(values.get('la-brasa-orders-v1')).some((entry) => entry.id === order.id)
    return false
  })

  assert.deepEqual(result, { recorded: true, opened: false })
  assert.equal(openerSawSavedOrder, true)
  assert.equal(JSON.parse(values.get('la-brasa-orders-v1'))[0].message, order.message)
})

test('contains a WhatsApp opener exception without losing the saved order', () => {
  const values = new Map()
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
  const result = recordOrderBeforeWhatsApp({ id: 'LB-1025' }, storage, () => { throw new Error('popup blocked') })

  assert.deepEqual(result, { recorded: true, opened: false })
  assert.equal(JSON.parse(values.get('la-brasa-orders-v1'))[0].id, 'LB-1025')
})

test('reports when local persistence is unavailable while still attempting WhatsApp', () => {
  let attempted = false
  const result = recordOrderBeforeWhatsApp({ id: 'LB-1026' }, {
    getItem: () => null,
    setItem: () => { throw new Error('storage unavailable') },
  }, () => { attempted = true; return true })

  assert.deepEqual(result, { recorded: false, opened: true })
  assert.equal(attempted, true)
})
