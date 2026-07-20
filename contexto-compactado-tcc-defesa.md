# Contexto Compactado — TCC Quasar Barber: fase de defesa

**Data da compactação:** 2026-06-22
**Chat original:** ~14 mensagens (sessão de retomada das atividades)

---

## 1. Objetivo

Finalizar a fase de preparação da defesa do TCC (Sistema de Recomendação B2B com Regras de Associação, estudo de caso Quasar Barber). Os 6 capítulos já estavam escritos; esta sessão focou em verificação de citações, commit/push da Semana 11, e produção do material de apresentação (roteiro de fala + banco de perguntas da banca).

## 2. Decisões Tomadas

- **Verificação de citações = fechada:** 23 citadas / 23 listadas, consistência bidirecional perfeita. Forma ABNT in-text correta (parênteses caixa alta, narrativa caixa-título, "et al." só para 4+ autores: Brin/Hevner/Peffers/Sarwar).
- **Correção Sarwar [11]:** paginação errada `285-299` → `285-295` (confirmado em SciRP, IR Anthology, www10 archive). Corrigido em DOIS lugares: `tcc/REFERENCIAS.md` (commitado) e `apresentacao/gerar_slides.py:411` (NÃO commitado).
- **Commit/push Semana 11:** feito. Commit `8bf02e1` "Semana 11: Cap 5 + Cap 6 + slides", pushado para origin/master. Repo segue fluxo direto-no-master (sem branch por commit), padrão histórico do projeto.
- **Roteiro e perguntas escritos via /humanizer:** português falado natural, sem travessão, sem AI-tells. Mesmo padrão do Cap 6.
- **Placeholders capa slides:** decisão de NÃO preencher agora (faltam dados: instituição + nome orientador). Regenerou o .pptx só com o fix Sarwar.

## 3. Estado Atual

- **Escrita:** 6 capítulos completos e consistentes (`tcc/01` a `tcc/06` + REFERENCIAS). Números canônicos batem entre Cap 5 e Cap 6.
- **Slides:** `apresentacao/slides.pptx` regenerado (18 slides), já com Sarwar 285-295. Capa ainda com placeholders.
- **Material de defesa:** roteiro de fala por slide e banco de ~45 perguntas da banca — ambos criados nesta sessão.
- **Git:** 4 arquivos em `apresentacao/` NÃO commitados (ver tabela). Tudo de Semana 11 já está no origin.

## 4. Arquivos e Artefatos Relevantes

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `apresentacao/gerar_slides.py` | Editado (não commitado) | Fix Sarwar 285-295 na linha 411. Gera slides.pptx via python-pptx |
| `apresentacao/slides.pptx` | Regenerado (não commitado) | 18 slides, tema dark navy+dourado, 16:9, com fix |
| `apresentacao/roteiro-apresentacao.md` | Criado (não commitado) | Fala por slide, ~15min, deixas de palco, perguntas prováveis, lembretes de ensaio |
| `apresentacao/perguntas-banca.md` | Criado (não commitado) | ~45 Q&A em 11 blocos, inclui pegadinhas |
| `tcc/REFERENCIAS.md` | Commitado (8bf02e1) | Fix Sarwar já dentro do commit Semana 11 |
| `tcc/05-resultados.md`, `tcc/06-conclusao.md` | Commitados (8bf02e1) | Caps 5 e 6 |

## 5. Números canônicos do TCC (não alterar, já verificados rodando o algoritmo)

- Dataset: **30 transações / 26 clientes / 29 produtos / 52 itens / 14 multi-item** (29/04→18/06/2026)
- Regras: **44**; confiança média **76,51%**; suporte médio **4,39%**; lift médio **12,41**
- Top rule: After Shave ↔ Café Verde Shampoo (QOD), conf 1,0, lift 30,0
- LOOCV: Precision **26,39%** / Recall **44,44%** (16 de 36 sub-testes) / F1 **31,94%** (14 tx avaliáveis)
- Holdout 80/20 (descartado, só contraste): **22,22%** (3 tx)
- Teto estrutural da Precision = 1/N ≈ **0,33** (esconde 1 item, recomenda 3)
- Validação = **LOOCV** sempre. Nunca reintroduzir 80/20 exceto §3.6.1 como descartado.

## 6. Próximos Passos (amanhã)

- [ ] Decidir e commitar os 4 arquivos pendentes de `apresentacao/` (gerar_slides.py, slides.pptx, roteiro, perguntas-banca)
- [ ] Preencher placeholders da capa dos slides: `[UNIVERSIDADE / INSTITUIÇÃO]` e `Orientador(a): [Nome]`, depois regenerar (`python apresentacao/gerar_slides.py` — fechar PowerPoint antes, lock no Windows)
- [ ] Revisão ABNT final contra `MANUAL-DE-NORMALIZACAO-DE-TRABALHOS-ACADEMICOS-IFMA-CAXIAS-2020.pdf` (sumário, numeração de figuras/quadros/tabelas, margens, formatação)
- [ ] (Opcional) passar Cap 1-5 pelo /humanizer (usam travessão pesado; Cap 6, roteiro e perguntas já feitos)
- [ ] Ensaio cronometrado ~15 min (alvo), teto provável da banca ~20 min
- [ ] Conferência manual na fonte original: DOI/edição/volume das demais referências; contagens "ordem de grandeza" do ranking em REFERENCIAS.md linha 13

## 7. Informações Pendentes

- Instituição e nome do orientador (necessários para a capa dos slides e elementos pré-textuais)
- Prazo banca: **17 ago 2026**

---

> **Instrução para o próximo chat:** Este arquivo contém o contexto compactado de um chat anterior. Use-o como base para continuar o trabalho. Não peça ao usuário para repetir informações que já estão aqui. Comece confirmando brevemente que entendeu o contexto e pergunte por onde o usuário quer continuar.
