# Estrutura do TCC — Sistema de Recomendação B2B com Association Rules

**Autor:** Felipe Pereira
**Curso:** Ciência da Computação
**Título provisório:** *Sistema de Recomendação de Produtos para Distribuição B2B Utilizando Regras de Associação: Estudo de Caso na Quasar Barber*
**Tipo:** Monografia / Trabalho de Conclusão de Curso (ABNT)
**Extensão alvo:** 55–60 páginas
**Prazo de entrega:** 17 ago 2026

---

## 1. Tema e Delimitação

**Tema:** Aplicação de técnicas de mineração de dados (Association Rules / Market Basket Analysis) para recomendação de produtos em comércio atacadista B2B.

**Delimitação:** O estudo se restringe a um sistema de recomendação baseado exclusivamente em regras de associação extraídas do histórico transacional da Quasar Barber (distribuidora de produtos de barbearia em Codó-MA). Não abrange filtragem colaborativa, modelos de deep learning, nem recomendação em tempo real durante o checkout. O recorte de dados é o conjunto de pedidos de 2026 (33 transações, 33 produtos únicos).

---

## 2. Problema de Pesquisa

### Contextualização do problema

Distribuidoras B2B de pequeno e médio porte operam com um catálogo amplo, mas tomam decisões de venda casada (cross-sell) e de sugestão de reposição de forma intuitiva, baseadas na memória do vendedor. Diferentemente do varejo B2C, esse cenário tem **poucos clientes**, **sem avaliações/notas de produto** e **volume transacional reduzido** — o que inviabiliza filtragem colaborativa clássica, que depende de matriz usuário-item densa.

### Pergunta de pesquisa

> **É possível gerar recomendações de produtos úteis e estatisticamente relevantes para uma distribuidora B2B de pequeno porte utilizando apenas regras de associação extraídas do histórico transacional, mesmo diante de um volume reduzido de transações?**

### Sub-perguntas

1. Quais limiares de *support* e *confidence* produzem regras relevantes (não triviais) em um dataset esparso de dezenas de transações?
2. Como o *lift* distingue associações causalmente úteis de coocorrências por mero acaso nesse cenário?
3. Quais são as limitações de validação (Precision/Recall/F1) quando o conjunto de teste tem poucas transações multi-item?

---

## 3. Hipótese

**H1 —** Regras de associação com `confidence ≥ 0,30` e `support ≥ 0,02`, ranqueadas por `lift`, produzem recomendações de cross-sell coerentes com o conhecimento de domínio da distribuidora, mesmo em dataset reduzido.

**H0 (nula) —** Em volume transacional reduzido, as regras geradas são indistinguíveis de coocorrências aleatórias e não superam uma recomendação baseada apenas em produtos mais vendidos (baseline de popularidade).

---

## 4. Objetivos

### Objetivo Geral

Desenvolver e validar um sistema de recomendação de produtos B2B baseado em regras de associação (Market Basket Analysis), aplicado ao histórico de vendas da Quasar Barber, capaz de sugerir produtos complementares com relevância estatística mensurável.

### Objetivos Específicos

1. **Revisar** a literatura sobre sistemas de recomendação, regras de associação (Apriori) e as métricas support, confidence e lift.
2. **Modelar** uma base de dados transacional (PostgreSQL/Supabase) que represente clientes, produtos, vendas e itens de venda da distribuidora.
3. **Implementar** o algoritmo de extração de regras de associação e a geração de recomendações Top-N em uma API REST (Node.js/Express).
4. **Construir** uma interface web (React) que permita consultar recomendações por produto e visualizar métricas e gráficos das regras descobertas.
5. **Validar** a qualidade das recomendações via train/test split (80/20), calculando Precision, Recall e F1-Score, e discutir as limitações impostas pelo tamanho do dataset.
6. **Analisar** as regras de maior lift do ponto de vista de negócio, verificando aderência ao conhecimento de domínio.

---

## 5. Justificativa

- **Acadêmica:** A maioria dos estudos de sistemas de recomendação foca em B2C com grandes volumes (Amazon, Netflix). Há lacuna em aplicações B2B de baixo volume, onde a escolha do algoritmo é restringida pela esparsidade dos dados. O trabalho documenta empiricamente por que Association Rules é adequada onde Collaborative Filtering falha.
- **Prática/Econômica:** A Quasar Barber é empresa real do autor. O sistema endereça uma dor concreta — apoiar a equipe de vendas com sugestões de venda casada baseadas em dados, não em intuição —, com potencial de aumento de ticket médio.
- **Técnica:** Demonstra uma arquitetura completa e reproduzível (backend, frontend, cache, testes, validação) de baixo custo, viável para pequenas empresas sem infraestrutura de Big Data.

---

## 6. Metodologia

**Natureza:** Pesquisa aplicada, de abordagem quantitativa, com procedimento de **estudo de caso único** (Quasar Barber) e desenvolvimento de artefato (Design Science Research — DSR).

**Etapas (DSR):**
1. Identificação do problema (cross-sell intuitivo em B2B de baixo volume).
2. Definição dos objetivos da solução (recomendação Top-N relevante).
3. Projeto e desenvolvimento do artefato (sistema completo descrito no Cap. 4).
4. Demonstração (sistema rodando sobre dados reais de 2026).
5. Avaliação (métricas Precision/Recall/F1 + análise de regras por lift).
6. Comunicação (esta monografia).

**Instrumentos e materiais:**
- Dados: pedidos reais de 2026 (`Pedidos_2026.csv`), importados para Supabase.
- Stack: Node.js + Express + Supabase (PostgreSQL) + Redis (cache opcional); React 18 + Vite; Chart.js.
- Algoritmo: extração de regras de associação par-a-par com cálculo de support, confidence e lift; ranqueamento Top-N.
- Parâmetros: `MIN_CONFIDENCE = 0,30`, `MIN_SUPPORT = 0,02`, `TOP_N = 3`.
- Validação: train/test split 80/20 com Precision, Recall e F1-Score.

---

## 7. Estrutura dos Capítulos (sumário)

> Ordem ABNT. Páginas são estimativas para o alvo de 55–60 págs.

### Elementos pré-textuais
- Capa, folha de rosto, folha de aprovação
- Dedicatória / agradecimentos (opcional)
- Resumo (PT) + palavras-chave
- Abstract (EN) + keywords
- Listas de figuras, tabelas, quadros e abreviaturas
- Sumário

### 1. INTRODUÇÃO *(≈4 págs)*
- 1.1 Contextualização
- 1.2 Problema de pesquisa
- 1.3 Hipótese
- 1.4 Objetivos (geral e específicos)
- 1.5 Justificativa
- 1.6 Delimitação do escopo
- 1.7 Organização do trabalho

### 2. FUNDAMENTAÇÃO TEÓRICA *(≈12 págs)*
- 2.1 Sistemas de recomendação
  - 2.1.1 Definição e taxonomia
  - 2.1.2 Filtragem colaborativa
  - 2.1.3 Filtragem baseada em conteúdo
  - 2.1.4 Abordagens híbridas
- 2.2 Regras de associação (Market Basket Analysis)
  - 2.2.1 Conceito e itemsets
  - 2.2.2 Algoritmo Apriori
  - 2.2.3 Métricas: support, confidence, lift
- 2.3 O problema do *cold start* e da esparsidade
- 2.4 Comércio B2B e venda casada (cross-sell)
- 2.5 Métricas de avaliação: Precision, Recall, F1-Score
- 2.6 Trabalhos relacionados

### 3. METODOLOGIA *(≈8 págs)*
- 3.1 Classificação da pesquisa
- 3.2 Design Science Research como método
- 3.3 Coleta e origem dos dados
- 3.4 Pré-processamento (parse de CSV, agrupamento por pedido, inferência de categoria)
- 3.5 Ferramentas e tecnologias
- 3.6 Protocolo de validação (train/test split 80/20)

### 4. DESENVOLVIMENTO DO SISTEMA *(≈14 págs)*
- 4.1 Arquitetura geral (cliente → API → serviços → banco)
- 4.2 Modelagem de dados (tabelas `qb_*`, diagrama ER)
- 4.3 Camada de dados e integração com Supabase (PostgREST)
- 4.4 Algoritmo de regras de associação (implementação)
- 4.5 Geração de recomendações Top-N
- 4.6 API REST (endpoints: recomendações, estatísticas, validação, produtos)
- 4.7 Cache (Redis graceful)
- 4.8 Interface web: dashboard, busca com autocomplete, gráficos
- 4.9 Decisões de projeto e *trade-offs*

### 5. RESULTADOS E DISCUSSÃO *(≈10 págs)*
- 5.1 Caracterização do dataset (33 transações, 33 produtos, 57 regras)
- 5.2 Regras descobertas e análise por lift (ex.: QOD Shampoo → QOD Pomada, 100% conf., lift 11,0)
- 5.3 Métricas globais (confiança média 71,09%; support médio 4,73%)
- 5.4 Avaliação Precision/Recall/F1 e suas limitações
- 5.5 Aderência ao conhecimento de domínio
- 5.6 Confronto com a hipótese (H1 vs H0)
- 5.7 Limitações do estudo

### 6. CONCLUSÃO *(≈4 págs)*
- 6.1 Síntese das contribuições
- 6.2 Resposta à pergunta de pesquisa
- 6.3 Trabalhos futuros (dataset maior, Apriori multi-item, deploy em produção, A/B test de ticket médio)

### Elementos pós-textuais
- Referências (ABNT, mín. 15 fontes; 5+ artigos científicos)
- Apêndices (trechos de código, schema SQL, prints do sistema)
- Anexos (se houver)

---

## 8. Cronograma de Escrita (Semanas 9–12)

| Semana | Entrega |
|---|---|
| 9 | Capítulos 1 (Introdução) e 2 (Fundamentação Teórica) |
| 10 | Capítulos 3 (Metodologia) e 4 (Desenvolvimento) |
| 11 | Capítulos 5 (Resultados) e 6 (Conclusão) + revisão ABNT |
| 12 | Apresentação (10–15 slides), ensaio e submissão à banca |

---

## 9. Palavras-chave (provisórias)

Sistemas de recomendação; Regras de associação; Market Basket Analysis; Comércio B2B; Mineração de dados; Cross-sell.

## 10. Keywords

Recommender systems; Association rules; Market basket analysis; B2B commerce; Data mining; Cross-selling.
