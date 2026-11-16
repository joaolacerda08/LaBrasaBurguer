# La Brasa — versão HTML, CSS e JavaScript

Vitrine estática, sem React, TSX, TypeScript, npm ou etapa de compilação. Abra `index.html` diretamente no navegador para testar. A pasta `assets` contém a logo; as fotos do cardápio são carregadas pelos links oficiais existentes.

## GitHub Pages

Envie todos os arquivos desta pasta para um repositório GitHub. Em **Settings → Pages**, escolha **GitHub Actions**. O workflow incluído copia os arquivos estáticos para `_site` e publica essa pasta; não instala pacotes nem compila o projeto.

Os caminhos são relativos, então funcionam em subdiretórios como `/LaBrasaBurguer/`. O pedido é preparado no WhatsApp para o cliente revisar e enviar. Uma cópia local é salva no navegador; não há backend. Não há cupons ativos cadastrados.

## Conteúdo

- `index.html`: aplicação completa em HTML, CSS e JavaScript nativos.
- `assets/la-brasa-logo-white.png`: logo do estabelecimento.
- `.github/workflows/deploy-pages.yml`: publicação automática do GitHub Pages.
