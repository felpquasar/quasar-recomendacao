-- Seed: Dados iniciais para Sistema de Recomendação Quasar Barber
-- Execute no Supabase SQL Editor

-- Clientes
INSERT INTO qb_clientes (nome_loja, cidade, estado) VALUES
  ('Barbearia do João', 'Codó', 'MA'),
  ('Studio Corte & Barba', 'São Luís', 'MA'),
  ('Barbearia Clássica', 'Imperatriz', 'MA'),
  ('Barber Shop Premium', 'Teresina', 'PI');

-- Produtos
INSERT INTO qb_produtos (nome, categoria, preco) VALUES
  ('Fox For Men Barba', 'Barba', 89.90),
  ('Espuma para Barba Premium', 'Barba', 34.90),
  ('Tônico de Barba', 'Barba', 49.90),
  ('Condicionador de Barba', 'Barba', 39.90),
  ('Pente de Metal Profissional', 'Acessórios', 29.90),
  ('QOD Barber Shampoo', 'Cabelo', 59.90),
  ('QOD Pomada Forte', 'Cabelo', 69.90),
  ('Beard Oil Premium', 'Barba', 55.90),
  ('Balm para Barba', 'Barba', 44.90),
  ('Tesoura Profissional', 'Acessórios', 89.90);

-- Vendas
INSERT INTO qb_vendas (cliente_id, data, valor_total, metodo_pagamento) VALUES
  (1, '2024-01-15', 124.80, 'pix'),
  (2, '2024-01-16', 139.80, 'cartao'),
  (1, '2024-01-20', 174.70, 'pix'),
  (3, '2024-01-22',  74.80, 'dinheiro'),
  (2, '2024-01-25', 119.80, 'pix'),
  (4, '2024-02-01', 129.80, 'cartao'),
  (3, '2024-02-05', 159.70, 'pix'),
  (1, '2024-02-10', 100.80, 'dinheiro'),
  (2, '2024-02-15', 190.70, 'pix'),
  (4, '2024-02-20', 119.80, 'cartao'),
  (3, '2024-03-01', 180.70, 'pix'),
  (1, '2024-03-05', 129.80, 'cartao'),
  (2, '2024-03-10',  74.80, 'dinheiro'),
  (4, '2024-03-15', 184.70, 'pix');

-- Itens de Venda
INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (1, 1, 1, 89.90), (1, 2, 1, 34.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (2, 1, 1, 89.90), (2, 3, 1, 49.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (3, 1, 1, 89.90), (3, 2, 1, 34.90), (3, 3, 1, 49.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (4, 2, 1, 34.90), (4, 4, 1, 39.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (5, 1, 1, 89.90), (5, 5, 1, 29.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (6, 6, 1, 59.90), (6, 7, 1, 69.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (7, 6, 1, 59.90), (7, 7, 1, 69.90), (7, 5, 1, 29.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (8, 8, 1, 55.90), (8, 9, 1, 44.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (9, 8, 1, 55.90), (9, 9, 1, 44.90), (9, 1, 1, 89.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (10, 5, 1, 29.90), (10, 10, 1, 89.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (11, 1, 1, 89.90), (11, 2, 1, 34.90), (11, 8, 1, 55.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (12, 6, 1, 59.90), (12, 7, 1, 69.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (13, 4, 1, 39.90), (13, 2, 1, 34.90);

INSERT INTO qb_itens_venda (venda_id, produto_id, quantidade, valor_unitario) VALUES
  (14, 1, 1, 89.90), (14, 3, 1, 49.90), (14, 9, 1, 44.90);

-- Verificar inserção
SELECT 'qb_clientes' as tabela, COUNT(*) as total FROM qb_clientes
UNION ALL
SELECT 'qb_produtos', COUNT(*) FROM qb_produtos
UNION ALL
SELECT 'qb_vendas', COUNT(*) FROM qb_vendas
UNION ALL
SELECT 'qb_itens_venda', COUNT(*) FROM qb_itens_venda;
