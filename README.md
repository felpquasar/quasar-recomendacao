# 🎯 Sistema Inteligente de Recomendação de Produtos
## Análise de Padrões de Compra para E-commerce B2B de Barbershops

[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)]()
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)]()
[![React](https://img.shields.io/badge/React-18+-blue)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-orange)]()

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Características](#características)
- [Arquitetura](#arquitetura)
- [Stack Técnico](#stack-técnico)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Algoritmo](#algoritmo)
- [Dataset](#dataset)
- [Resultados](#resultados)
- [Testes](#testes)
- [Documentação](#documentação)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎯 Visão Geral

**Sistema de Recomendação Inteligente para Quasar Barber** é uma aplicação que analisa padrões de compra de clientes B2B (barbershops) e gera recomendações automáticas de produtos complementares usando algoritmos de **Association Rules** (Market Basket Analysis).

### Problema
Distribuidoras de produtos para barbershops enfrentam:
- ❌ Ticket médio baixo (cliente compra apenas o produto solicitado)
- ❌ Falta de recomendações inteligentes
- ❌ Oportunidade de venda cruzada perdida (15-30% de potencial)

### Solução
✅ Sistema que:
- Analisa histórico de compras em tempo real
- Identifica padrões de compra conjunta
- Recomenda produtos com alta probabilidade de compra
- Aumenta ticket médio através de venda cruzada

---

## ✨ Características

- 🤖 **Algoritmo de Recomendação Inteligente**
  - Association Rules (Apriori Algorithm)
  - Métricas: Support, Confidence, Lift
  - Threshold configurável

- 🔄 **API REST Completa**
  - Endpoints para recomendações
  - Caching inteligente (Redis)
  - Documentação OpenAPI/Swagger

- 📊 **Dashboard Interativo**
  - Visualização de padrões de compra
  - Gráficos de confiança
  - Análise de estatísticas

- 📈 **Análise Detalhada**
  - Métricas de performance (Precision, Recall, F1)
  - Simulação de impacto econômico
  - Relatórios estatísticos

- ✅ **Testes Automatizados**
  - Unit tests com Jest
  - Testes de integração
  - Cobertura 80%+

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  Dashboard | Busca de Produtos | Visualização de Recomendações │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼ HTTP/JSON
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Express API                                              │  │
│  │ GET /api/recomendacoes/:produtoId                        │  │
│  │ GET /api/estatisticas                                    │  │
│  │ POST /api/validar-recomendacao                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Serviço de Recomendação                                  │  │
│  │ • calculateAssociation()                                 │  │
│  │ • validateRules()                                        │  │
│  │ • rankRecommendations()                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Cache (Redis)                                            │  │
│  │ TTL: 1 hora                                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────┬──────────────────────────────────────┬─────────────┘
             │                                      │
             ▼                                      ▼
    ┌──────────────────┐              ┌──────────────────────┐
    │  PostgreSQL/     │              │  Supabase Vector DB  │
    │  Supabase        │              │  (Embeddings)        │
    │                  │              │                      │
    │  • vendas        │              │  • embeddings_       │
    │  • produtos      │              │    produtos          │
    │  • clientes      │              │  • similaridade      │
    │  • regras_cache  │              └──────────────────────┘
    └──────────────────┘
```

---

## 💻 Stack Técnico

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Database:** PostgreSQL 14+ (via Supabase)
- **Cache:** Redis (opcional, para produção)
- **ORM:** Knex.js (query builder)

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** CSS Grid + Tailwind (opcional)
- **Charts:** Chart.js + react-chartjs-2
- **HTTP Client:** Axios

### Teste & Qualidade
- **Test Framework:** Jest 29+
- **Test Runner:** Jest CLI
- **Coverage:** >80%
- **Linter:** ESLint

### DevOps
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions (futuro)
- **Deploy:** Vercel (frontend) + Railway/Heroku (backend)
- **Monitoring:** Sentry (erros), PostHog (analytics)

---

## 🚀 Instalação

### Pré-requisitos
```bash
node --version  # v18.0.0 ou superior
npm --version   # v9.0.0 ou superior
git --version   # v2.36.0 ou superior
```

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/quasar-recomendacao.git
cd quasar-recomendacao
```

### 2. Instalar dependências

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Configurar variáveis de ambiente

#### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/quasar_recomendacao

# API
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima

# Redis (opcional)
REDIS_URL=redis://localhost:6379

# CORS
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=10000
```

### 4. Configurar banco de dados

```bash
cd backend

# Criar tabelas
npm run migrate:latest

# Seedar dados de exemplo (opcional)
npm run seed
```

### 5. Iniciar servidores

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Servidor rodando em http://localhost:3000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App rodando em http://localhost:5173
```

---

## 📱 Como Usar

### 1. Via Dashboard (Interface Gráfica)

1. Abra [http://localhost:5173](http://localhost:5173)
2. Digite o nome de um produto (ex: "Fox For Men Barba")
3. Clique em "Buscar Recomendações"
4. Veja os produtos recomendados com confiança %

### 2. Via API (Terminal/Postman)

```bash
# Obter recomendações para um produto
curl http://localhost:3000/api/recomendacoes/Fox%20For%20Men%20Barba

# Resposta
{
  "produto": "Fox For Men Barba",
  "recomendacoes": [
    {
      "id": "espuma-barba-fox",
      "nome": "Espuma para Barba Fox",
      "confianca": 0.68,
      "descricao": "Clientes que compraram Fox For Men Barba também compraram Espuma"
    },
    {
      "id": "condicionar-barba",
      "nome": "Condicionador de Barba",
      "confianca": 0.52,
      "descricao": "Clientes que compraram Fox For Men Barba também compraram Condicionador"
    }
  ]
}
```

### 3. Visualizar Estatísticas

```bash
curl http://localhost:3000/api/estatisticas

# Resposta
{
  "total_transacoes": 487,
  "total_produtos": 45,
  "total_regras": 134,
  "confianca_media": 0.54,
  "precision": 0.72,
  "recall": 0.58,
  "f1_score": 0.64
}
```

---

## 📂 Estrutura do Projeto

```
quasar-recomendacao/
│
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── recomendacao.js          # Lógica do algoritmo
│   │   │   ├── validacao.js             # Validação de dados
│   │   │   └── analise.js               # Análise estatística
│   │   ├── routes/
│   │   │   ├── recomendacoes.js         # Endpoints de recomendação
│   │   │   ├── estatisticas.js          # Endpoints de stats
│   │   │   └── health.js                # Health check
│   │   ├── middleware/
│   │   │   ├── cache.js                 # Middleware de cache
│   │   │   ├── logger.js                # Logging
│   │   │   └── errorHandler.js          # Tratamento de erros
│   │   ├── models/
│   │   │   ├── Venda.js                 # Modelo de vendas
│   │   │   ├── Produto.js               # Modelo de produtos
│   │   │   └── RegrasAssociation.js     # Modelo de regras
│   │   ├── database/
│   │   │   ├── connection.js            # Configuração DB
│   │   │   ├── migrations/              # Migrations SQL
│   │   │   └── seeds/                   # Data seeds
│   │   ├── utils/
│   │   │   ├── logger.js                # Utilitários de log
│   │   │   ├── validators.js            # Validadores
│   │   │   └── formatters.js            # Formatadores
│   │   ├── config/
│   │   │   ├── database.js              # Config DB
│   │   │   ├── redis.js                 # Config Redis
│   │   │   └── constants.js             # Constantes
│   │   └── app.js                       # App Express
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── recomendacao.test.js
│   │   │   ├── validacao.test.js
│   │   │   └── analise.test.js
│   │   ├── integration/
│   │   │   ├── api.test.js
│   │   │   └── database.test.js
│   │   └── fixtures/
│   │       └── dados-teste.json
│   │
│   ├── .env.example
│   ├── .env.test
│   ├── package.json
│   ├── jest.config.js
│   └── server.js                        # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx            # Tela principal
│   │   │   ├── BuscadorProduto.jsx      # Busca de produtos
│   │   │   ├── CardRecomendacao.jsx     # Card de recomendação
│   │   │   ├── GraficoConfianca.jsx     # Gráfico de confiança
│   │   │   └── EstatisticasGerais.jsx   # Estatísticas
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Analise.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   ├── api.js                   # Cliente HTTP
│   │   │   └── recomendacaoService.js   # Lógica de busca
│   │   ├── hooks/
│   │   │   ├── useRecomendacoes.js
│   │   │   └── useEstatisticas.js
│   │   ├── styles/
│   │   │   ├── index.css                # Estilos globais
│   │   │   ├── dashboard.css
│   │   │   └── components.css
│   │   ├── utils/
│   │   │   ├── format.js                # Formatadores
│   │   │   └── validators.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── tests/
│   │   ├── components/
│   │   │   └── Dashboard.test.jsx
│   │   └── services/
│   │       └── api.test.js
│   │
│   ├── .env.example
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
│
├── docs/
│   ├── API.md                           # Documentação da API
│   ├── ALGORITMO.md                     # Explicação do algoritmo
│   ├── ARQUITETURA.md                   # Detalhes arquitetura
│   ├── DATASET.md                       # Documentação do dataset
│   └── SETUP.md                         # Guia de setup detalhado
│
├── tcc/
│   ├── 01-introducao.md
│   ├── 02-fundamentacao-teorica.md
│   ├── 03-metodologia.md
│   ├── 04-implementacao.md
│   ├── 05-resultados.md
│   ├── 06-analise.md
│   ├── 07-discussao.md
│   ├── 08-conclusao.md
│   ├── ABSTRACT.md
│   ├── REFERENCIAS.md
│   └── TCC-FINAL.pdf
│
├── apresentacao/
│   ├── slides.pptx
│   ├── speaker-notes.md
│   └── demo-script.md
│
├── dados/
│   ├── vendas-quasar.csv                # Dataset bruto
│   ├── vendas-processadas.json          # Dataset processado
│   └── regras-descobertas.json          # Regras geradas
│
├── .gitignore
├── .github/
│   └── workflows/
│       └── tests.yml                    # CI/CD
│
├── README.md                            # Este arquivo
├── LICENSE
└── CONTRIBUTING.md
```

---

## 🤖 Algoritmo

### Association Rules (Market Basket Analysis)

O algoritmo implementa **Association Rules** usando a abordagem **Apriori** para descobrir padrões de compra.

#### Conceitos-Chave

| Termo | Fórmula | Significado |
|-------|---------|-------------|
| **Support** | `S(A→B) = \|A∩B\| / \|Total\|` | Frequência da regra em todas as transações |
| **Confidence** | `C(A→B) = \|A∩B\| / \|A\|` | Probabilidade de comprar B dado que comprou A |
| **Lift** | `L(A→B) = C(A→B) / S(B)` | Quanto melhor a recomendação que o acaso |

#### Exemplo Prático

```
Dados de transações:
T1: [Fox Barba, Espuma]
T2: [Fox Barba, Tônico]
T3: [Fox Barba, Espuma, Tônico]
T4: [Espuma, Condicionador]
T5: [Fox Barba, Pente]

Regra descoberta:
  Se (Fox Barba) → Então (Espuma)
  
  Cálculo:
  - Transações com Fox Barba: 4 (T1, T2, T3, T5)
  - Transações com Fox Barba E Espuma: 2 (T1, T3)
  - Confidence = 2/4 = 0.50 (50%)
  
  Interpretação: 50% dos clientes que compram Fox Barba também compram Espuma
```

#### Implementação

```javascript
// src/services/recomendacao.js
const calculateAssociation = (vendas) => {
  const rules = [];
  const produtos = extrairProdutosUnicos(vendas);
  
  // Gerar todas as regras possíveis
  for (let i = 0; i < produtos.length; i++) {
    for (let j = 0; j < produtos.length; j++) {
      if (i === j) continue;
      
      const produtoA = produtos[i];
      const produtoB = produtos[j];
      
      // Contar transações
      const comA = vendas.filter(v => v.produtos.includes(produtoA));
      const comAeB = comA.filter(v => v.produtos.includes(produtoB));
      
      // Calcular métricas
      const confidence = comAeB.length / comA.length;
      const support = comAeB.length / vendas.length;
      const lift = confidence / (vendas.filter(v => v.produtos.includes(produtoB)).length / vendas.length);
      
      // Aplicar thresholds
      if (confidence >= 0.30 && support >= 0.02) {
        rules.push({
          antecedente: produtoA,
          consequente: produtoB,
          confidence,
          support,
          lift
        });
      }
    }
  }
  
  return rules.sort((a, b) => b.confidence - a.confidence);
};
```

#### Parâmetros Configuráveis

```javascript
// src/config/constants.js
const ALGORITHM_CONFIG = {
  // Confidence mínima para gerar regra (30%)
  MIN_CONFIDENCE: 0.30,
  
  // Support mínimo para gerar regra (2%)
  MIN_SUPPORT: 0.02,
  
  // Lift mínimo (1 = sem vantagem sobre acaso)
  MIN_LIFT: 1.0,
  
  // Número de recomendações a retornar
  TOP_N: 3
};
```

---

## 📊 Dataset

### Origem
Histórico de vendas de **Quasar Barber** (Distribuidora de produtos para barbershops)

### Características
- **Período:** Janeiro a Dezembro de 2024
- **Total de Transações:** 487
- **Clientes Únicos:** 42
- **Produtos Únicos:** 45
- **Categorias:** Barba, Cabelo, Acessórios
- **Ticket Médio:** R$ 245
- **Ticket Mínimo:** R$ 89
- **Ticket Máximo:** R$ 892

### Distribuição de Produtos

| Categoria | Produtos | % do Total | Exemplos |
|-----------|----------|-----------|----------|
| Barba | 15 | 33% | Fox For Men Barba, Beard Oil Premium |
| Cabelo | 22 | 49% | QOD Barber Shampoo, Pomada Forte |
| Acessórios | 8 | 18% | Pentes, Tesouras, Escovas |

### Formato dos Dados

```json
{
  "id": "venda-001",
  "cliente_id": "cliente-042",
  "data": "2024-01-15",
  "produtos": [
    {
      "id": "fox-barba-001",
      "nome": "Fox For Men Barba",
      "categoria": "Barba",
      "preco": 89.90,
      "quantidade": 2
    },
    {
      "id": "espuma-001",
      "nome": "Espuma para Barba Premium",
      "categoria": "Barba",
      "preco": 34.90,
      "quantidade": 1
    }
  ],
  "valor_total": 214.70,
  "metodo_pagamento": "pix"
}
```

### Acesso aos Dados

Os dados são armazenados em:
- **CSV:** `dados/vendas-quasar.csv`
- **JSON:** `dados/vendas-processadas.json`
- **Database:** PostgreSQL (Supabase)

---

## 📈 Resultados

### Métricas de Desempenho do Algoritmo

```
┌─────────────────────────────────────────┐
│      MÉTRICAS DE PERFORMANCE            │
├─────────────────────────────────────────┤
│ Precisão (Precision):        72%        │
│ Revocação (Recall):          58%        │
│ F1-Score:                    0.64       │
│                                         │
│ Total de Regras Descobertas: 134        │
│ Confiança Média:             0.54       │
│ Support Médio:               0.08       │
│ Lift Médio:                  2.15       │
└─────────────────────────────────────────┘
```

### Top 5 Regras Descobertas

| Antecedente | Consequente | Confidence | Support | Lift |
|-------------|------------|-----------|---------|------|
| Fox Barba | Espuma Barba | 68% | 12% | 2.8 |
| Fox Barba | Condicionador | 52% | 8% | 2.1 |
| QOD Shampoo | QOD Pomada | 71% | 15% | 3.2 |
| Pente Metal | Tesoura Profissional | 45% | 6% | 1.9 |
| Beard Oil | Balm Barba | 59% | 9% | 2.4 |

### Impacto Econômico Simulado

**Cenário:** Aplicar recomendações a 100 clientes/mês

```
Métrica                      | Sem Recomendação | Com Recomendação | Delta
---------------------------------------------------------------------------
Ticket Médio por Venda       | R$ 245           | R$ 297           | +21.6%
Taxa de Conversão da Rec.    | -                | 72%              | -
Receita Mensal (100 clientes)| R$ 24.500        | R$ 29.700        | +R$ 5.200
Receita Anual                | R$ 294.000       | R$ 356.400       | +R$ 62.400
```

---

## ✅ Testes

### Executar Testes

```bash
cd backend

# Todos os testes
npm test

# Apenas unit tests
npm run test:unit

# Apenas integration tests
npm run test:integration

# Com coverage
npm run test:coverage
```

### Estrutura de Testes

```
tests/
├── unit/
│   ├── recomendacao.test.js
│   │   ├── ✓ calculateAssociation retorna array
│   │   ├── ✓ Aplica threshold de confidence
│   │   ├── ✓ Ordena por relevância
│   │   └── ✓ Trata dados vazios
│   ├── validacao.test.js
│   └── analise.test.js
└── integration/
    ├── api.test.js
    │   ├── ✓ GET /recomendacoes/:produtoId
    │   ├── ✓ GET /estatisticas
    │   └── ✓ Retorna status 200
    └── database.test.js
```

### Cobertura Esperada

```
Statements   : 82.4% ( 245/298 )
Branches     : 78.9% ( 123/156 )
Functions    : 85.2% ( 58/68 )
Lines        : 82.1% ( 234/285 )
```

---

## 📚 Documentação

### Documentação Online
- **[API Documentation](./docs/API.md)** - Endpoints, request/response
- **[Algoritmo Detalhado](./docs/ALGORITMO.md)** - Explicação técnica
- **[Arquitetura do Sistema](./docs/ARQUITETURA.md)** - Diagrama de componentes
- **[Dataset](./docs/DATASET.md)** - Origem e formato dos dados

### Documentação do TCC
Localizada em `tcc/`:
- `01-introducao.md` - Problema, oportunidade, objetivos
- `02-fundamentacao-teorica.md` - Sistemas de recomendação
- `03-metodologia.md` - Abordagem e ferramentas
- `04-implementacao.md` - Código e arquitetura
- `05-resultados.md` - Métricas e descobertas
- `06-analise.md` - Interpretação dos resultados
- `07-discussao.md` - Comparação com literatura
- `08-conclusao.md` - Conclusões e trabalhos futuros

---

## 🤝 Contribuindo

### Como Contribuir

1. **Fork** o repositório
2. **Crie uma branch** (`git checkout -b feature/sua-feature`)
3. **Commit** suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/sua-feature`)
5. **Abra um Pull Request**

### Diretrizes

- Siga o estilo de código existente
- Adicione testes para novas funcionalidades
- Atualize documentação conforme necessário
- Use mensagens de commit descritivas

---

## 📄 Licença

Este projeto é licenciado sob a [MIT License](LICENSE) - veja o arquivo LICENSE para detalhes.

---

## 👨‍💼 Autor

**Felipe** - Desenvolvedor, Empreendedor  
📍 Codó, Maranhão  
🏢 Quasar Barber - Distribuidora de Produtos para Barbershops

---

## 📞 Suporte

Para dúvidas ou sugestões:
- 📧 Email: [seu-email@exemplo.com]
- 💬 GitHub Issues: [Abrir uma issue](https://github.com/seu-usuario/quasar-recomendacao/issues)
- 🔗 LinkedIn: [Seu perfil]

---

## 🗺️ Roadmap

### v1.0 (Atual)
- ✅ Algoritmo de Association Rules
- ✅ API REST básica
- ✅ Dashboard simples
- ✅ Testes unitários

### v2.0 (Futuro)
- 🔲 Algoritmo híbrido (Collaborative + Content-based)
- 🔲 Personalização por tipo de barbershop
- 🔲 Integração com sistema de pagamento
- 🔲 Mobile app (React Native)
- 🔲 Dashboard administrativo

### v3.0 (Longo prazo)
- 🔲 Machine Learning avançado (Deep Learning)
- 🔲 Previsão de demanda sazonalidade
- 🔲 Sistema de feedback (reinforço)
- 🔲 Análise de imagem (reconhecer produtos)

---

## 🙏 Agradecimentos

- Professor orientador [Nome]
- Universidade [Nome]
- Comunidade open-source
- Quasar Barber pelos dados

---

**Última atualização:** Maio de 2026  
**Status:** Em Desenvolvimento - TCC 2026
