# La Brasa · FoodFlow v0.3

Vitrine de pedidos da La Brasa, construída com React, TypeScript e Vite. A identidade usa a logo fornecida pelo estabelecimento e uma paleta preta e laranja.

## Requisitos e execução

- Node.js 20.19+ ou 22.12+
- npm

```bash
npm install
npm run dev
```

Build de produção e prévia local:

```bash
npm run build
npm run preview
```

## Publicação no GitHub Pages

O pacote inclui `.github/workflows/deploy-pages.yml`. Para publicar:

1. Crie um repositório no GitHub e envie todos os arquivos deste projeto.
2. Em **Settings → Pages**, selecione **GitHub Actions** como fonte de publicação.
3. Faça push na branch `main` (ou execute o workflow manualmente em **Actions**).

O workflow instala as dependências com `npm ci`, executa `npm run build` e publica `dist`. O Vite usa caminhos relativos, então o site funciona tanto em um repositório de projeto quanto em um domínio personalizado.

## Funcionalidades

- Vitrine responsiva com filtros, detalhes, ingredientes ilustrados flutuantes no hero e parallax por ponteiro.
- Situação aberto/fechado calculada a cada 30 segundos pelo horário de Belo Horizonte.
- Horários: segunda fechado; terça, quarta, quinta e domingo, 18h–23h30; sexta e sábado, 6h30–meia-noite.
- Sacola local com escolha de retirada ou entrega, taxa fixa de R$ 5,90, bairros de Belo Horizonte e campos de endereço e referência.
- Pagamento por Pix, cartões ou dinheiro, valor de troco opcional e campo de observações.
- Campo de cupom com validação por configuração.
- Mensagem operacional de WhatsApp sem emojis fixos, com pedido, cliente, itens, valores, entrega, pagamento, observações e horário; o cliente revisa e envia.
- Snapshot local do pedido gravado antes de tentar abrir o WhatsApp, para preservar os dados caso a abertura falhe.

## Onde personalizar

- Identidade, endereço, WhatsApp, horário e cupons: `src/config/store.ts`.
- Produtos, preços, categorias e fotos: `src/data/storeCatalog.ts`.
- Bairros oferecidos para entrega: `src/data/beloHorizonteNeighborhoods.ts`.
- Contratos: `src/types/domain.ts`.
- Camada de catálogo: `src/services/repositories/`.

## Limites atuais

- O endereço da loja e o WhatsApp oficial da unidade Barreiro estão configurados em `src/config/store.ts`.
- Nenhum cupom ativo foi informado. Cadastre códigos e descontos em `coupons` na configuração da loja.
- O pedido abre em uma conversa `wa.me` preenchida; o cliente ainda confirma o envio. O texto é serializado uma vez como parâmetro de URL. Não existe chamada de API HTTP/JSON, resposta do provedor ou confirmação de recebimento.
- Os snapshots são armazenados apenas no navegador do cliente (`localStorage`); não existe backend nem registro do lado da loja. A gravação local acontece antes da tentativa de abrir o WhatsApp.
- Os dois produtos Smash de três camadas usam temporariamente a imagem do Smash de duas camadas. A foto do Costelão representa o Double Costelão, enquanto o cadastro descreve um burger de 200 g.
- As fotos dos produtos são referenciadas diretamente no site da La Brasa, sem upload local. A logo em branco e com transparência está em `public/la-brasa-logo-white.png`.

Os bairros iniciais foram selecionados da relação municipal de bairros; ajuste a lista conforme a área de entrega da loja. Consulte também o [BH em Números da Prefeitura de Belo Horizonte](https://prefeitura.pbh.gov.br/bhgeo/bh-em-numeros).
