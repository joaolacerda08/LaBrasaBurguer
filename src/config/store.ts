import { storeCategories, storeProducts } from '../data/storeCatalog'
import type { StoreConfig } from '../types/domain'

export const storeConfig: StoreConfig = {
  id: 'la-brasa-barreiro',
  name: 'La Brasa',
  tagline: 'A brasa acesa. O sabor no ponto.',
  description: 'Burgers, fogo e bons momentos à mesa.',
  logo: { src: '/la-brasa-logo-white.png', alt: 'Logotipo La Brasa', fallbackText: 'L' },
  contact: {
    address: 'Avenida Sinfrônio Brochado, 864 — Barreiro',
    city: 'Belo Horizonte, MG',
    whatsapp: '31984844721',
  },
  theme: { background: '#10100f', surface: '#1b1b19', accent: '#ee7c36', fontFamily: "'DM Sans', sans-serif" },
  hours: {
    timeZone: 'America/Sao_Paulo',
    weekly: {
      monday: null,
      tuesday: { open: '18:00', close: '23:30' },
      wednesday: { open: '18:00', close: '23:30' },
      thursday: { open: '18:00', close: '23:30' },
      friday: { open: '06:30', close: '24:00' },
      saturday: { open: '06:30', close: '24:00' },
      sunday: { open: '18:00', close: '23:30' },
    },
  },
  // Os cupons comerciais devem ser cadastrados aqui pelo estabelecimento.
  coupons: [],
  categories: storeCategories,
  products: storeProducts,
}
