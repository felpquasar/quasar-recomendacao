# 📊 RASTREADOR DE PROGRESSO TCC
## Sistema de Recomendação - Quasar Barber

**Projeto:** TCC Ciência da Computação  
**Aluno:** Felipe  
**Instituição:** [Sua Universidade]  
**Período:** Maio-Julho 2026 (12 semanas)  
**Data Início:** 26 de Maio de 2026

---

## 🎯 VISÃO GERAL DO PROJETO

```
┌─────────────────────────────────────────────────────────────┐
│                    FASES DO TCC                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  FASE 1: DESENVOLVIMENTO (Semanas 1-8)                       │
│  Backend ✅ | Frontend ✅ | Testes ✅                         │
│                                                               │
│  FASE 2: DOCUMENTAÇÃO (Semanas 9-11)                         │
│  TCC ⏳ (em andamento)                                        │
│                                                               │
│  FASE 3: DEFESA (Semana 12)                                  │
│  Apresentação ⏳ (próxima)                                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘

                  TIMELINE GERAL (72 HORAS)

   Semana 1-2    Semana 3-5    Semana 6-7    Semana 8
   Prep & Setup  Algoritmo     Frontend      Testes
   ████░░░░░░    ████░░░░░░    ████░░░░░░    ████░░░░░░
   12h            18h            12h           6h
   
   Semana 9-11                   Semana 12
   Escrita TCC                   Apresentação
   ██████░░░░░░░░░░░░░░░░░░░░░  ██░░░░░░░░
   18h                            6h
```

---

## 📈 PROGRESSO ATUAL (SEMANA-A-SEMANA)

### SEMANA 1: FUNDAMENTAÇÃO & PESQUISA
**Data:** 26 Mai - 01 Jun 2026  
**Objetivo:** Fundamentação teórica + coleta de dados  
**Status:** ⏳ Não iniciado

```
Tarefas:
[ ] Pesquisa sobre sistemas de recomendação
[ ] Exportar dados históricos de Quasar Barber
[ ] Desenhar arquitetura do sistema
[ ] Criar repositório GitHub
[ ] Estruturar pastas do projeto

Progresso: ░░░░░░░░░░ 0%
Horas: 0/6 ⏳

Entregas Esperadas:
- Fundamentação documentada
- Dados históricos em CSV
- Arquitetura em diagrama
- Repositório inicializado
```

---

### SEMANA 2: SETUP DO AMBIENTE
**Data:** 02 Jun - 08 Jun 2026  
**Objetivo:** Ambiente 100% funcional  
**Status:** ⏳ Não iniciado

```
Tarefas:
[ ] Setup Node.js + Express
[ ] Configurar PostgreSQL/Supabase
[ ] Criar estrutura React + Vite
[ ] Cliente HTTP configurado
[ ] Ambiente validado (sem erros)

Progresso: ░░░░░░░░░░ 0%
Horas: 0/6 ⏳

Entregas Esperadas:
- Backend rodando localhost:3000
- Frontend rodando localhost:5173
- 487+ transações no BD
- .env configurado
- Sem erros de CORS

Dependências Anteriores:
✓ Semana 1 completa
```

---

### SEMANA 3: ALGORITMO DE RECOMENDAÇÃO
**Data:** 09 Jun - 15 Jun 2026  
**Objetivo:** Implementar Association Rules funcional  
**Status:** ⏳ Não iniciado

```
Tarefas:
[ ] Implementar calculateAssociation()
[ ] Criar testes unitários (6+)
[ ] Endpoint GET /api/recomendacoes/:produtoId
[ ] Testes de integração
[ ] Documentar algoritmo

Progresso: ░░░░░░░░░░ 0%
Horas: 0/6 ⏳

Entregas Esperadas:
- Módulo recomendacao.js
- 7+ testes (100% passando)
- API respondendo corretamente
- Documentação do algoritmo

Dependências Anteriores:
✓ Semana 2 completa
```

---

### SEMANA 4: PERFORMANCE & CACHING
**Data:** 16 Jun - 22 Jun 2026  
**Objetivo:** Otimizar com Redis, criar /api/estatisticas  
**Status:** ⏳ Não iniciado

```
Tarefas:
[ ] Configurar Redis
[ ] Implementar cache layer
[ ] Endpoint /api/estatisticas
[ ] Testes de cache
[ ] Documentação OpenAPI (início)

Progresso: ░░░░░░░░░░ 0%
Horas: 0/6 ⏳

Entregas Esperadas:
- Redis funcionando
- Latência reduzida 10x (<50ms com cache)
- Endpoint de stats
- Cache hit/miss logged

Dependências Anteriores:
✓ Semana 3 completa

MÉTRICAS ESPERADAS:
├── Latência sem cache: ~500ms
├── Latência com cache: <50ms
└── Cache hit rate: ~98%
```

---

### SEMANA 5: VALIDAÇÃO DO ALGORITMO
**Data:** 23 Jun - 29 Jun 2026  
**Objetivo:** Validar com dados reais + calcular métricas  
**Status:** ⏳ Não iniciado

```
Tarefas:
[ ] Implementar validação (Precision, Recall, F1)
[ ] Executar validação com Train/Test Split
[ ] Criar endpoint /api/validacao
[ ] Testes de validação
[ ] Documentação de validação

Progresso: ░░░░░░░░░░ 0%
Horas: 0/6 ⏳

Entregas Esperadas:
- Métricas calculadas:
  ├── Precision: 72% ✅
  ├── Recall: 58% ⚠️
  └── F1-Score: 0.64 ✅
- Endpoint de validação
- Relatório em JSON

Dependências Anteriores:
✓ Semana 4 completa

METAS DE QUALIDADE:
├── Precision: ≥70% ✓
├── Recall: ≥50% ✓
└── F1-Score: ≥0.60 ✓
```

---

### SEMANA 6: DASHBOARD FRONTEND
**Data:** 30 Jun - 06 Jul 2026  
**Objetivo:** Criar Dashboard interativo  
**Status:** ⏳ Não iniciado

```
Tarefas:
[ ] Componentes React (3+)
[ ] Página Dashboard
[ ] Estilos CSS
[ ] Testes de componentes
[ ] Design responsivo

Progresso: ░░░░░░░░░░ 0%
Horas: 0/6 ⏳

Entregas Esperadas:
- BuscadorProduto.jsx
- CardRecomendacao.jsx
- ResultadosBusca.jsx
- Dashboard responsivo (mobile-friendly)
- Sem erros de console

Dependências Anteriores:
✓ Semana 5 completa

BREAKPOINTS:
├── Desktop (≥1024px): Grid 3-coluna
├── Tablet (768-1023px): Grid 2-coluna
└── Mobile (<768px): Grid 1-coluna
```

---

### SEMANA 7: GRÁFICOS & VISUALIZAÇÕES
**Data:** 07 Jul - 13 Jul 2026  
**Objetivo:** Adicionar Chart.js + página de análise  
**Status:** ⏳ Não iniciado

```
Tarefas:
[ ] Instalar Chart.js
[ ] Componente GraficoRecomendacoes
[ ] Página Analise com múltiplos gráficos
[ ] Navegação entre páginas
[ ] Testes de gráficos

Progresso: ░░░░░░░░░░ 0%
Horas: 0/6 ⏳

Entregas Esperadas:
- GraficoRecomendacoes.jsx
- Página /analise funcional
- 3+ gráficos (Bar, Pie)
- Navbar com links
- Responsivo

Dependências Anteriores:
✓ Semana 6 completa

GRÁFICOS A IMPLEMENTAR:
├── Bar Chart: Confiança das recomendações
├── Pie Chart: Distribuição de produtos
└── Pie Chart: Distribuição de métricas
```

---

### SEMANA 8: TESTES COMPLETOS & DOCUMENTAÇÃO
**Data:** 14 Jul - 20 Jul 2026  
**Objetivo:** Cobertura 80%+ de testes + documentação  
**Status:** ⏳ Não iniciado

```
Tarefas:
[ ] Testes de integração end-to-end
[ ] Coverage report (>80%)
[ ] Documentação OpenAPI completa
[ ] README de testes
[ ] Build validado

Progresso: ░░░░░░░░░░ 0%
Horas: 0/6 ⏳

Entregas Esperadas:
- 25+ testes (unit + integration)
- Cobertura 82%+
- OpenAPI.yaml completo
- Build sem erros
- Deployment local testado

Dependências Anteriores:
✓ Semana 7 completa

MÉTRICAS DE TESTE:
├── Unit Tests: 17 ✅
├── Integration Tests: 8 ✅
├── Total: 25 testes
└── Cobertura: 82.4% ✅

ESTADO APÓS SEMANA 8: ✅ DESENVOLVIMENTO FINALIZADO
├── Backend: 95% ✅
├── Frontend: 100% ✅
└── Testes: 85% ✅
```

---

### SEMANA 9: INTRODUÇÃO + FUNDAMENTAÇÃO TEÓRICA
**Data:** 21 Jul - 27 Jul 2026  
**Objetivo:** Escrever Capítulos 1-2 do TCC  
**Status:** ⏳ Não iniciado

```
Tarefas:
[ ] Escrever Capítulo 1: Introdução (4 pág)
[ ] Escrever Capítulo 2: Fundamentação Teórica (8 pág)
[ ] Revisar ortografia e gramática
[ ] Verificar citações
[ ] Commit do TCC

Progresso: ░░░░░░░░░░ 0%
Horas: 0/6 ⏳
Páginas: 0/12 ⏳

Entregas Esperadas:
- 01-introducao.md (4-5 páginas)
- 02-fundamentacao-teorica.md (8-10 páginas)
- Total: 12-15 páginas
- Sem erros gramaticais
- Citações formatadas (Autor, Ano)

Dependências Anteriores:
✓ Semana 8 completa (DESENVOLVIMENTO)

CHECKLIST CAPÍTULO 1:
├── Contexto claro ✓
├── Problema bem definido ✓
├── Oportunidade articulada ✓
├── Objetivos SMART ✓
└── Escopo delimitado ✓

CHECKLIST CAPÍTULO 2:
├── Sistemas de Recomendação ✓
├── Association Rules fundamentado ✓
├── Algoritmo Apriori explicado ✓
├── Métricas definidas ✓
└── Estado da arte contextualizado ✓
```

---

### SEMANA 10: METODOLOGIA + IMPLEMENTAÇÃO
**Data:** 28 Jul - 03 Ago 2026  
**Objetivo:** Escrever Capítulos 3-5 (início)  
**Status:** ⏳ Não iniciado

```
Tarefas:
[ ] Capítulo 3: Metodologia (5 pág)
[ ] Capítulo 4: Implementação (8 pág)
[ ] Capítulo 5: Resultados (3 pág inicial)
[ ] Revisar e refinar
[ ] Commit do TCC

Progresso: ░░░░░░░░░░ 0%
Horas: 0/6 ⏳
Páginas: 0/16 ⏳

Entregas Esperadas:
- 03-metodologia.md (5-6 páginas)
- 04-implementacao.md (8-10 páginas)
- 05-resultados.md (3-4 páginas iniciais)
- Total acumulado: 28 páginas
- ~47% do documento final

Dependências Anteriores:
✓ Semana 9 completa

CHECKLIST CAPÍTULO 3:
├── Abordagem justificada ✓
├── Dataset descrito ✓
├── Ferramentas listadas ✓
├── Processo claro ✓
└── Métricas definidas ✓

CHECKLIST CAPÍTULO 4:
├── Arquitetura visual ✓
├── Algoritmo com pseudocódigo ✓
├── Endpoints documentados ✓
├── Schema do BD ✓
└── Fluxo de dados end-to-end ✓
```

---

### SEMANA 11: ANÁLISE + DISCUSSÃO + CONCLUSÃO
**Data:** 04 Ago - 10 Ago 2026  
**Objetivo:** Completar TCC (capítulos 5-8 + Abstract + Referências)  
**Status:** ⏳ Não iniciado

```
Tarefas:
[ ] Capítulo 5: Resultados (completo)
[ ] Capítulo 6: Análise
[ ] Capítulo 7: Discussão
[ ] Capítulo 8: Conclusão
[ ] Abstract (PT + EN)
[ ] Referências formatadas
[ ] Revisão final completa

Progresso: ░░░░░░░░░░ 0%
Horas: 0/6 ⏳
Páginas: 0/18 ⏳

Entregas Esperadas:
- 05-resultados.md (5 pág completo)
- 06-analise.md (5 pág)
- 07-discussao.md (4 pág)
- 08-conclusao.md (3 pág)
- ABSTRACT.md (1 pág)
- REFERENCIAS.md (2 pág)
- Total acumulado: 55-60 páginas
- TCC 100% COMPLETO ✅

Dependências Anteriores:
✓ Semana 10 completa

CHECKLIST FINAL:
├── Ortografia ✓
├── Gramática ✓
├── Citações corretas ✓
├── Numeração páginas ✓
├── Índice de conteúdo ✓
├── Figuras referenciadas ✓
├── Referências formatadas (ABNT) ✓
└── PDF gerado ✓
```

---

### SEMANA 12: APRESENTAÇÃO & DEFESA
**Data:** 11 Ago - 17 Ago 2026  
**Objetivo:** Apresentar e defender o TCC  
**Status:** ⏳ Não iniciado

```
Tarefas:
[ ] Criar slides (15 slides / 15 min)
[ ] Preparar demo ao vivo (testar 5x)
[ ] Ensaiar apresentação (timing)
[ ] Validar equipamento
[ ] DEFESA (apresentação ao vivo)

Progresso: ░░░░░░░░░░ 0%
Horas: 0/6 ⏳

Entregas Esperadas:
- slides.pptx (15 slides, tema Quasar)
- demo script (execução passo-a-passo)
- speaker notes (anotações)
- Apresentação 15 minutos exatos
- Responder perguntas da banca

Dependências Anteriores:
✓ Semana 11 completa (TCC COMPLETO)

ESTRUTURA DE SLIDES:
├─ Slide 1-2: Título + Problema (1 min)
├─ Slide 3-4: Fundamentação (1.5 min)
├─ Slide 5-7: Metodologia (2 min)
├─ Slide 8-10: Implementação (2 min)
├─ Slide 11-13: DEMO AO VIVO (3 min)
├─ Slide 14-15: Resultados + Conclusão (2.5 min)
└─ Slide 16: Perguntas? (2.5 min adicional)

PREPARE PARA PERGUNTAS:
├─ "Por que Association Rules e não ML?"
├─ "Como escalaria para 10k transações?"
├─ "Qual é o ROI real esperado?"
├─ "Quais são as limitações?"
└─ "Como isso vira produto (SaaS)?"
```

---

## 📊 SUMÁRIO VISUAL DO PROGRESSO

### Por Fase

```
FASE 1: DESENVOLVIMENTO (Semanas 1-8) | 48h
├─ Setup & Fundamentação (Sem 1-2): ░░░░░░░░░░ 0% [ 12h ]
├─ Algoritmo (Sem 3-5):               ░░░░░░░░░░ 0% [ 18h ]
├─ Frontend & Gráficos (Sem 6-7):    ░░░░░░░░░░ 0% [ 12h ]
└─ Testes (Sem 8):                    ░░░░░░░░░░ 0% [  6h ]

FASE 2: DOCUMENTAÇÃO (Semanas 9-11) | 18h
├─ Introdução + Fundamentação (Sem 9):  ░░░░░░░░░░ 0% [  6h ]
├─ Metodologia + Implementação (Sem 10): ░░░░░░░░░░ 0% [  6h ]
└─ Análise + Conclusão (Sem 11):        ░░░░░░░░░░ 0% [  6h ]

FASE 3: DEFESA (Semana 12) | 6h
└─ Apresentação & Defesa (Sem 12):      ░░░░░░░░░░ 0% [  6h ]

TOTAL: 72 horas
```

### Por Componente

```
BACKEND (Node.js + Express)
└─ Status: ░░░░░░░░░░ 0% [ Setup: Sem 1-2 | Algoritmo: Sem 3-5 ]

FRONTEND (React + Vite)
└─ Status: ░░░░░░░░░░ 0% [ Dashboard: Sem 6 | Gráficos: Sem 7 ]

TESTES
└─ Status: ░░░░░░░░░░ 0% [ Unit/Integration: Sem 8 | Cobertura: 80%+ ]

TCC (Documentação)
└─ Status: ░░░░░░░░░░ 0% [ Escrita: Sem 9-11 | Total: 55-60 pág ]

APRESENTAÇÃO
└─ Status: ░░░░░░░░░░ 0% [ Slides + Demo: Sem 12 ]
```

---

## 📅 CALENDÁRIO DE MILESTONES

```
SEMANA 1-2  (26 Mai - 08 Jun)
┌─────────────────────────────┐
│ MILESTONE: Setup Completo   │
│ Backend, Frontend, BD OK     │
│ ⏳ DATA ESPERADA: 08 Jun    │
└─────────────────────────────┘

SEMANA 3-4  (09 Jun - 22 Jun)
┌──────────────────────────────────┐
│ MILESTONE: Algoritmo Funcionando │
│ Recomendações prontas + validadas │
│ ⏳ DATA ESPERADA: 22 Jun         │
└──────────────────────────────────┘

SEMANA 5-8  (23 Jun - 20 Jul)
┌──────────────────────────────────┐
│ MILESTONE: Desenvolvimento 100%  │
│ Backend, Frontend, Testes OK      │
│ ✅ DATA ESPERADA: 20 Jul         │
│ 🏁 PRONTO PARA TCC               │
└──────────────────────────────────┘

SEMANA 9-11  (21 Jul - 10 Ago)
┌──────────────────────────────────┐
│ MILESTONE: TCC Completo          │
│ 55-60 páginas, All Chapters OK   │
│ ✅ DATA ESPERADA: 10 Ago         │
│ 🏁 PRONTO PARA DEFESA            │
└──────────────────────────────────┘

SEMANA 12  (11 Ago - 17 Ago)
┌──────────────────────────────────┐
│ MILESTONE: DIPLOMADO!             │
│ Apresentação + Aprovação banca    │
│ 🎓 DATA ESPERADA: 17 Ago         │
│ 🎉 DIPLOMA CONQUISTADO!          │
└──────────────────────────────────┘
```

---

## 🎯 METAS DE QUALIDADE

### Backend
- [ ] API responde em <100ms (com cache)
- [ ] Cobertura de testes: ≥80%
- [ ] Precisão do algoritmo: ≥70%
- [ ] Recall do algoritmo: ≥50%
- [ ] F1-Score: ≥0.60

### Frontend
- [ ] Responsivo (desktop, tablet, mobile)
- [ ] Sem erros de console
- [ ] Tempo de carregamento: <2s
- [ ] Gráficos renderizando corretamente

### TCC
- [ ] 55-60 páginas
- [ ] Sem erros gramaticais
- [ ] Todas as referências formatadas (ABNT)
- [ ] Figuras e tabelas referenciadas
- [ ] Fluxo lógico entre capítulos

### Apresentação
- [ ] Exatamente 15 minutos
- [ ] Demo funciona (teste 5x antes)
- [ ] Slides profissionais (tema Quasar)
- [ ] Respostas preparadas para perguntas

---

## 🚨 RISCOS & MITIGAÇÕES

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Dados incompletos | Algoritmo não funciona | Baixa | Validar BD na Sem 2 |
| Algoritmo não atinge 70% precision | Projeto fraco | Média | Testar thresholds na Sem 5 |
| Frontend não fica responsivo | Apresentação ruim | Baixa | Testar mobile na Sem 6 |
| TCC atrasa | Não defende no prazo | Média | Buffer de 3 dias na Sem 11 |
| Demo falha ao vivo | Banca impressionada menos | Alta | Gravar demo com antecedência |

---

## 💡 CHECKLIST CRÍTICO (ANTES DE CADA SEMANA)

### Antes de Começar Semana

- [ ] Semana anterior 100% completa?
- [ ] Todos os deliverables entregues?
- [ ] Commits realizados no GitHub?
- [ ] Documentação atualizada?
- [ ] Nenhum bloqueador pendente?

### Fim de Cada Semana

- [ ] Revisar código/texto
- [ ] Rodar testes
- [ ] Commit final
- [ ] Atualizar PROGRESSO.md
- [ ] Atualizar este rastreador

---

## 📞 CONTATOS & RECURSOS

### Recursos Importantes

- **Repositório GitHub:** [link quando criado]
- **Supabase Project:** [link quando criado]
- **Vercel Deploy:** [link quando deployado]
- **Documentação do Projeto:** `docs/` folder

### Contatos de Suporte

- **Orientador:** [Nome] - [Email]
- **Coordenador TCC:** [Nome] - [Email]
- **Banca:** [Professores] - [Emails]

---

## 🏁 CONCLUSÃO ESPERADA

```
┌──────────────────────────────────────────────┐
│  🎓 DIPLOMA ESPERADO: AGOSTO 2026             │
│                                               │
│  ✅ Projeto: Concluído com 85%+ qualidade    │
│  ✅ TCC: Completo e bem-fundamentado         │
│  ✅ Apresentação: Profissional e pronta      │
│  ✅ Banca: Impressionada com aplicação real  │
│                                               │
│  🚀 PRÓXIMO PASSO: QUASAR SOLUÇÕES (SaaS)   │
│     Comercializar sistema como produto       │
│                                               │
└──────────────────────────────────────────────┘
```

---

## 📝 NOTAS FINAIS

Este rastreador deve ser **atualizado semanalmente** para refletir progresso real. 

**Disciplina é fundamental.** 6 horas/semana é o mínimo necessário para conclusão no prazo.

**Documentação é key.** Manter README, PROGRESSO.md e este rastreador atualizados facilita muito a escrita do TCC.

**Demo ao vivo impressiona.** Testar o sistema funcionando na banca vale muito mais que slides bonitos.

**Você consegue!** 💪 Este é um projeto viável, bem planejado e com escopo controlado. Você vai se formar! 🎓

---

**Última atualização:** 26 de Maio de 2026  
**Próxima revisão:** 01 de Junho de 2026 (fim Semana 1)
