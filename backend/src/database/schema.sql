-- Schema: Sistema de Recomendação Quasar Barber
-- Prefixo qb_ para evitar conflito com outras tabelas no mesmo projeto Supabase

CREATE TABLE IF NOT EXISTS qb_clientes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome_loja VARCHAR(255) NOT NULL,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qb_produtos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('Barba', 'Cabelo', 'Acessórios')),
  preco DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qb_vendas (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cliente_id BIGINT NOT NULL REFERENCES qb_clientes(id),
  data DATE NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  metodo_pagamento VARCHAR(30),
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qb_itens_venda (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  venda_id BIGINT NOT NULL REFERENCES qb_vendas(id) ON DELETE CASCADE,
  produto_id BIGINT NOT NULL REFERENCES qb_produtos(id),
  quantidade INTEGER NOT NULL DEFAULT 1,
  valor_unitario DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS qb_regras_associacao (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  produto_antecedente_id BIGINT NOT NULL REFERENCES qb_produtos(id),
  produto_consequente_id BIGINT NOT NULL REFERENCES qb_produtos(id),
  support DECIMAL(6,4) NOT NULL,
  confidence DECIMAL(6,4) NOT NULL,
  lift DECIMAL(8,4) NOT NULL,
  calculado_em TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_qb_itens_produto ON qb_itens_venda(produto_id);
CREATE INDEX IF NOT EXISTS idx_qb_itens_venda ON qb_itens_venda(venda_id);
CREATE INDEX IF NOT EXISTS idx_qb_regras_antecedente ON qb_regras_associacao(produto_antecedente_id);
CREATE INDEX IF NOT EXISTS idx_qb_vendas_cliente ON qb_vendas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_qb_vendas_data ON qb_vendas(data);
