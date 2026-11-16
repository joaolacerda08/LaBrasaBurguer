// Bairros selecionados a partir da relação oficial de bairros da Prefeitura de Belo Horizonte.
export const beloHorizonteNeighborhoods = [
  'Anchieta', 'Barreiro', 'Barro Preto', 'Buritis', 'Carmo', 'Castelo', 'Centro',
  'Cidade Jardim', 'Cruzeiro', 'Floresta', 'Funcionários', 'Gutierrez', 'Lourdes',
  'Mangabeiras', 'Pampulha', 'Prado', 'Santa Efigênia', 'Santa Tereza', 'Santo Agostinho',
  'Santo Antônio', 'São Pedro', 'Savassi', 'Serra', 'Sion', 'Venda Nova',
].sort((a, b) => a.localeCompare(b, 'pt-BR'))
