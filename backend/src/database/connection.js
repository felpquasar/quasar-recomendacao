/**
 * connection.js
 * =============
 * Cria e exporta o cliente Supabase (PostgREST + Auth + Storage) usado
 * em todo o backend para acessar o banco de dados PostgreSQL hospedado
 * no Supabase Cloud (projeto: ylbajgyajkbacsqaphyn).
 *
 * Por que Supabase JS em vez de Knex/pg direto?
 * - Knex exige DATABASE_URL com senha do postgres (não disponível no plano
 *   gratuito do Supabase sem habilitar pgBouncer ou connection pooler pago).
 * - O cliente JS usa a API REST (PostgREST) com a anon key, que é suficiente
 *   para as operações de leitura que o algoritmo precisa.
 * - RLS (Row Level Security) foi desabilitado nas tabelas qb_* para permitir
 *   leitura com a anon key sem políticas de acesso complexas.
 *
 * Variáveis de ambiente necessárias (ver backend/.env):
 *   SUPABASE_URL     - URL do projeto Supabase (ex: https://xxx.supabase.co)
 *   SUPABASE_ANON_KEY - Chave pública anon JWT do projeto
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Instancia o cliente uma única vez e exporta para todo o backend.
// O createClient é leve e thread-safe — não precisa de pool de conexões
// pois o PostgREST gerencia isso internamente.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = { supabase };
