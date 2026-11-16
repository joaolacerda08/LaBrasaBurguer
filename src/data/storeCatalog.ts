import type { Category, Product } from '../types/domain'

export const storeCategories: Category[] = [
  { id: 'smash-em-dobro', name: 'Promoção Smash em Dobro', description: 'Smash de costela em uma, duas ou três camadas.' },
  { id: 'smash-burguer', name: 'Lançamento: Smash Burguer', description: 'A novidade da casa, feita na brasa.' },
  { id: 'burgers', name: "Burger's", description: 'Os burgers clássicos da La Brasa.' },
]

function ingredients(...names: string[]) {
  return names.map((name, index) => ({ id: `${index}-${name.toLocaleLowerCase('pt-BR').replace(/[^a-z0-9]+/g, '-')}`, name }))
}

const smashOne = ['Pão de Brioche', 'Maionese Gourmet', 'Blend de Costela 70 g', 'Cheddar', 'Cebola Caramelizada', 'Bacon']
const smashTwo = ['Pão de Brioche', 'Maionese Gourmet', 'Blend de Costela 70 g', '2× Cheddar', '2× Cebola Caramelizada', '2× Bacon']
const smashThree = ['Pão de Brioche', 'Maionese Gourmet', 'Blend de Costela 70 g', '3× Cheddar', '3× Cebola Caramelizada', '3× Bacon']

export const storeProducts: Product[] = [
  {
    id: 'smash-dobro-1-camada', name: 'Smash em Dobro 1 Camada', description: 'Brioche, costela 70 g, cheddar, cebola caramelizada e bacon.', price: 23.90,
    image: { src: 'https://site.labrasaburger.com.br/wp-content/uploads/2022/02/SMASH-1-CAMADA.png', alt: 'Smash em Dobro de uma camada da La Brasa', credit: 'La Brasa Burger' },
    categoryId: 'smash-em-dobro', ingredients: ingredients(...smashOne), addons: [], available: true, badge: 'Promoção',
  },
  {
    id: 'smash-dobro-2-camadas', name: 'Smash em Dobro 2 Camadas', description: 'Brioche, costela 70 g e duas camadas de cheddar, cebola caramelizada e bacon.', price: 33.90,
    image: { src: 'https://site.labrasaburger.com.br/wp-content/uploads/2022/02/SMASH-2-CAMDAS.png', alt: 'Smash em Dobro de duas camadas da La Brasa', credit: 'La Brasa Burger' },
    categoryId: 'smash-em-dobro', ingredients: ingredients(...smashTwo), addons: [], available: true, badge: 'Promoção',
  },
  {
    id: 'smash-dobro-3-camadas', name: 'Smash em Dobro 3 Camadas', description: 'Brioche, costela 70 g e três camadas de cheddar, cebola caramelizada e bacon.', price: 44.90,
    image: { src: 'https://site.labrasaburger.com.br/wp-content/uploads/2022/02/SMASH-2-CAMDAS.png', alt: 'Imagem provisória do Smash em Dobro 3 Camadas, baseada no Smash Burguer de duas camadas', credit: 'La Brasa Burger' },
    categoryId: 'smash-em-dobro', ingredients: ingredients(...smashThree), addons: [], available: true, badge: 'Foto provisória',
  },
  {
    id: 'smash-burguer-1-camada', name: 'Smash Burguer 1 Camada', description: 'Brioche, costela 70 g, cheddar, cebola caramelizada e bacon.', price: 23.90,
    image: { src: 'https://site.labrasaburger.com.br/wp-content/uploads/2022/02/SMASH-1-CAMADA-CHEDDAR.png', alt: 'Smash Burguer de uma camada da La Brasa', credit: 'La Brasa Burger' },
    categoryId: 'smash-burguer', ingredients: ingredients(...smashOne), addons: [], available: true, badge: 'Lançamento',
  },
  {
    id: 'smash-burguer-2-camadas', name: 'Smash Burguer 2 Camadas', description: 'Brioche, costela 70 g e duas camadas de cheddar, cebola caramelizada e bacon.', price: 33.90,
    image: { src: 'https://site.labrasaburger.com.br/wp-content/uploads/2022/02/SMASH-2-CAMDAS.png', alt: 'Smash Burguer de duas camadas da La Brasa', credit: 'La Brasa Burger' },
    categoryId: 'smash-burguer', ingredients: ingredients(...smashTwo), addons: [], available: true, badge: 'Lançamento',
  },
  {
    id: 'smash-burguer-3-camadas', name: 'Smash Burguer 3 Camadas', description: 'Brioche, costela 70 g e três camadas de cheddar, cebola caramelizada e bacon.', price: 44.90,
    image: { src: 'https://site.labrasaburger.com.br/wp-content/uploads/2022/02/SMASH-2-CAMDAS.png', alt: 'Imagem provisória do Smash Burguer 3 Camadas, baseada na referência de duas camadas', credit: 'La Brasa Burger' },
    categoryId: 'smash-burguer', ingredients: ingredients(...smashThree), addons: [], available: true, badge: 'Foto provisória',
  },
  {
    id: 'chicken-burger', name: 'Chicken Burger', description: 'Pão de gergelim, burger de frango 200 g, molho de 4 queijos e bacon em tiras.', price: 29.90,
    image: { src: 'https://site.labrasaburger.com.br/wp-content/uploads/2022/02/CHICKEN-scaled-e1784233703288.png', alt: 'Chicken Burger da La Brasa com molho de quatro queijos e bacon', credit: 'La Brasa Burger' },
    categoryId: 'burgers', ingredients: ingredients('Pão de gergelim', 'Burger de frango 200 g', 'Molho de 4 queijos', 'Bacon em tiras'), addons: [], available: true,
  },
  {
    id: 'veg-burger', name: 'Veg Burger', description: 'Burger de grão-de-bico 200 g, gouda, cebola caramelizada, alface e tomate.', price: 29.90,
    image: { src: 'https://site.labrasaburger.com.br/wp-content/uploads/2022/02/VEGEBURGER.png', alt: 'Veg Burger da La Brasa', credit: 'La Brasa Burger' },
    categoryId: 'burgers', ingredients: ingredients('Pão Australiano', 'Maionese da Casa', 'Alface', 'Tomate', 'Burger de grão-de-bico 200 g', 'Queijo gouda', 'Cebola caramelizada'), addons: [], available: true,
  },
  {
    id: 'la-brasa-picante', name: 'La Brasa Picante', description: 'Fraldinha, queijo gouda e geleia de pimenta no pão de batata.', price: 37.90,
    image: { src: 'https://site.labrasaburger.com.br/wp-content/uploads/2022/02/LA-BRASA-PICANTE-1.png', alt: 'La Brasa Picante com geleia de pimenta', credit: 'La Brasa Burger' },
    categoryId: 'burgers', ingredients: ingredients('Pão de batata', 'Maionese gourmet', 'Alface', 'Burger de fraldinha', 'Queijo gouda', 'Geleia de pimenta'), addons: [], available: true,
  },
  {
    id: 'costelao', name: 'Costelão', description: 'Burger de costela 200 g com queijo prato, bacon, ovo, cebola roxa, alface e tomate. A foto representa o Double Costelão; esta versão leva apenas um burger.', price: 42.90,
    image: { src: 'https://site.labrasaburger.com.br/wp-content/uploads/2022/02/COSTELAO.png', alt: 'Foto do Double Costelão; produto cadastrado com apenas um burger de costela 200 g', credit: 'La Brasa Burger' },
    categoryId: 'burgers', ingredients: ingredients('Pão italianinho', 'Maionese verde', 'Burger de costela 200 g', 'Queijo prato', 'Bacon em tiras', 'Ovo', 'Cebola roxa', 'Alface', 'Tomate'), addons: [], available: true, badge: 'Burger único',
  },
  {
    id: 'baconese', name: 'Baconese', description: 'Fraldinha 200 g, mussarela, baconese, bacon, cebola roxa, alface e tomate.', price: 39.90,
    image: { src: 'https://site.labrasaburger.com.br/wp-content/uploads/2021/09/5e5e48b22938a_baconeseBACONESE.png', alt: 'Baconese da La Brasa', credit: 'La Brasa Burger' },
    categoryId: 'burgers', ingredients: ingredients('Pão de gergelim', 'Baconese', 'Burger de fraldinha 200 g', 'Queijo mussarela', 'Bacon em tiras', 'Cebola roxa', 'Alface', 'Tomate'), addons: [], available: true,
  },
]
