# Referências — TCC Sistema de Recomendação B2B (Quasar Barber)

Formatação: **ABNT NBR 6023:2018**. Agrupadas por tema apenas para organização do estudo — na versão final do TCC a lista de Referências é **única e em ordem alfabética** pelo sobrenome do primeiro autor.

> ⚠️ **Verificar antes de submeter:** confira número de página, volume, edição e DOI de cada obra na fonte original (Google Scholar, DOI, ACM/IEEE Digital Library). Dados bibliográficos abaixo conferidos no melhor conhecimento, mas paginação/edição podem variar por reimpressão.

Total: **23 referências** (mín. exigido: 15, com 5+ artigos científicos). ✅ Artigos peer-reviewed: 13. 🇧🇷 Fontes nacionais: 2.

---

## ★ Ranking por impacto (artigos mais citados do tema)

Levantamento via Google Scholar / ACM / IEEE (jun 2026). Contagens são **ordem de grandeza** — confirmar o número exato no Scholar antes de citar como dado.

| # | Obra | ~Citações | Por que é incontornável |
|---|---|---|---|
| 1 | AGRAWAL; SRIKANT (1994) — *Fast algorithms for mining association rules* (**Apriori**) | ~40.000 | Artigo mais citado do tema; venceu o VLDB 10-Year Award (2004). Base do Cap. 2.2.2. |
| 2 | AGRAWAL; IMIELIŃSKI; SWAMI (1993) — *Mining association rules…* | ~25.000 | Funda o campo; define support e confidence. Cap. 2.2.1. |
| 3 | HAN; PEI; YIN (2000) — *Mining frequent patterns without candidate generation* (**FP-Growth**) | ~17.000 | Alternativa ao Apriori, ~10× mais rápida. Citar como evolução do algoritmo (Cap. 2.2.2 / trabalhos futuros). |
| 4 | KOREN; BELL; VOLINSKY (2009) — *Matrix factorization techniques for recommender systems* | ~16.000 | Artigo de recomendação mais citado da era pós-Netflix Prize. Contraponto moderno à abordagem por regras (Cap. 2.1.2). |
| 5 | SARWAR et al. (2001) — *Item-based collaborative filtering* | ~12.000 | Justifica por que CF exige matriz densa — base da escolha por Association Rules em B2B esparso. |
| 6 | ADOMAVICIUS; TUZHILIN (2005) — *Toward the next generation of recommender systems* | ~12.000 | Survey-taxonomia mais citado de RS. Cap. 2.1.1. |
| 7 | LINDEN; SMITH; YORK (2003) — *Amazon.com recommendations* | ~8.000 | Caso de e-commerce mais citado. Cap. 2.4. |

> As 7 obras acima já estão na lista consolidada (FP-Growth e Koren adicionados como **[20]** e **[21]**). Priorizar Apriori, FP-Growth e Adomavicius como referências centrais — alta densidade de citação reforça o rigor da banca.

---

## A. Regras de Associação / Market Basket Analysis (núcleo do trabalho)

**[1]** AGRAWAL, R.; IMIELIŃSKI, T.; SWAMI, A. Mining association rules between sets of items in large databases. In: ACM SIGMOD INTERNATIONAL CONFERENCE ON MANAGEMENT OF DATA, 1993, Washington, D.C. **Proceedings** [...]. New York: ACM, 1993. p. 207-216.
> *Artigo seminal — define o problema de regras de associação e as métricas support e confidence. Cap. 2.2.1.*

**[2]** AGRAWAL, R.; SRIKANT, R. Fast algorithms for mining association rules. In: INTERNATIONAL CONFERENCE ON VERY LARGE DATA BASES (VLDB), 20., 1994, Santiago, Chile. **Proceedings** [...]. San Francisco: Morgan Kaufmann, 1994. p. 487-499.
> *Introduz o algoritmo **Apriori**. Referência central do Cap. 2.2.2.*

**[3]** BRIN, S.; MOTWANI, R.; ULLMAN, J. D.; TSUR, S. Dynamic itemset counting and implication rules for market basket data. In: ACM SIGMOD INTERNATIONAL CONFERENCE ON MANAGEMENT OF DATA, 1997, Tucson. **Proceedings** [...]. New York: ACM, 1997. p. 255-264.
> *Origem da métrica de interesse/**lift**. Citar no Cap. 2.2.3 ao justificar o ranqueamento por lift.*

**[4]** HAHSLER, M.; GRÜN, B.; HORNIK, K. arules — a computational environment for mining association rules and frequent item sets. **Journal of Statistical Software**, v. 14, n. 15, p. 1-25, 2005.
> *Formaliza definições de support/confidence/lift e implementação de referência. Útil no Cap. 4.4 (implementação do algoritmo).*

**[20]** HAN, J.; PEI, J.; YIN, Y. Mining frequent patterns without candidate generation. In: ACM SIGMOD INTERNATIONAL CONFERENCE ON MANAGEMENT OF DATA, 2000, Dallas. **Proceedings** [...]. New York: ACM, 2000. p. 1-12.
> *Algoritmo **FP-Growth** — alternativa ao Apriori, sem geração de candidatos. ~17 mil citações. Cap. 2.2.2 e trabalhos futuros (escalar para multi-item).*

---

## B. Mineração de Dados (livros-texto de base)

**[5]** HAN, J.; KAMBER, M.; PEI, J. **Data mining**: concepts and techniques. 3. ed. Waltham: Morgan Kaufmann, 2011.
> *Livro-texto canônico. Base teórica geral do Cap. 2.2.*

**[6]** TAN, P.-N.; STEINBACH, M.; KUMAR, V. **Introduction to data mining**. Boston: Pearson Addison-Wesley, 2005.
> *Capítulo de Association Analysis muito didático — bom para definições formais e exemplos.*

---

## C. Sistemas de Recomendação

**[7]** RESNICK, P.; VARIAN, H. R. Recommender systems. **Communications of the ACM**, v. 40, n. 3, p. 56-58, 1997.
> *Artigo que cunha o termo "recommender systems". Abertura do Cap. 2.1.*

**[8]** ADOMAVICIUS, G.; TUZHILIN, A. Toward the next generation of recommender systems: a survey of the state-of-the-art and possible extensions. **IEEE Transactions on Knowledge and Data Engineering**, v. 17, n. 6, p. 734-749, 2005.
> *Survey-base da taxonomia (colaborativo / conteúdo / híbrido). Cap. 2.1.1.*

**[9]** RICCI, F.; ROKACH, L.; SHAPIRA, B. (Eds.). **Recommender systems handbook**. 2. ed. New York: Springer, 2015.
> *Obra de referência abrangente. Sustenta toda a seção 2.1.*

**[10]** AGGARWAL, C. C. **Recommender systems**: the textbook. Cham: Springer, 2016.
> *Livro-texto moderno; capítulo dedicado a métodos baseados em regras de associação — conecta os temas A e C.*

**[11]** SARWAR, B.; KARYPIS, G.; KONSTAN, J.; RIEDL, J. Item-based collaborative filtering recommendation algorithms. In: INTERNATIONAL CONFERENCE ON WORLD WIDE WEB (WWW), 10., 2001, Hong Kong. **Proceedings** [...]. New York: ACM, 2001. p. 285-295.
> *Contraponto: por que filtragem colaborativa exige matriz densa. Cap. 2.1.2 e justificativa da escolha por Association Rules.*

**[21]** KOREN, Y.; BELL, R.; VOLINSKY, C. Matrix factorization techniques for recommender systems. **Computer**, v. 42, n. 8, p. 30-37, 2009.
> *Artigo de recomendação mais citado da era pós-Netflix Prize (~16 mil). Contraponto moderno baseado em fatoração de matrizes — usar para delimitar o que o trabalho NÃO faz. Cap. 2.1.2.*

---

## D. Recomendação em E-commerce (aplicação)

**[12]** LINDEN, G.; SMITH, B.; YORK, J. Amazon.com recommendations: item-to-item collaborative filtering. **IEEE Internet Computing**, v. 7, n. 1, p. 76-80, 2003.
> *Caso clássico de recomendação em e-commerce. Contextualiza B2C vs. o B2B do trabalho.*

**[13]** SCHAFER, J. B.; KONSTAN, J. A.; RIEDL, J. E-commerce recommendation applications. **Data Mining and Knowledge Discovery**, v. 5, n. 1-2, p. 115-153, 2001.
> *Taxonomia de aplicações de recomendação em comércio eletrônico. Cap. 2.4 (cross-sell).*

**[22]** SCHONHORST, Gustavo Bonnard. **Mineração de regras de associação aplicada à modelagem dos dados transacionais de um supermercado**. 2010. Dissertação (Mestrado) — Universidade Federal de Itajubá, Itajubá, 2010.
> *🇧🇷 Fonte nacional. Aplicação de regras de associação a dados transacionais de varejo brasileiro — paralelo direto com este trabalho. Usar no Cap. 2.6 (trabalhos relacionados) como aplicação nacional histórica de MBA em varejo.*

**[23]** MORAES, Francine Machado. **Recomendação de produtos através do método de Market Basket Analysis aplicado ao cenário de Big Data**. Orientador: Tiago Thompsen Primo. 2023. 66 f. Dissertação (Mestrado em Ciência da Computação) — Centro de Desenvolvimento Tecnológico, Universidade Federal de Pelotas, Pelotas, 2023.
> *🇧🇷 Fonte nacional recente (2023). Aplica MBA a sistema de recomendação adaptável para canal digital e lojas físicas de grande rede varejista, com processamento distribuído. **Contraponto direto de escala** ao presente trabalho: enquanto Moraes (2023) endereça desafios de Big Data, este trabalho investiga MBA sob esparsidade severa em B2B de baixo volume — moldura central para o Cap. 2.6 (trabalhos relacionados). Reporta precision de 22,53% (canal digital) e 31,28% (lojas físicas) em dez/2023; referência útil no Cap. 5.4 ao contextualizar as métricas próprias e demonstrar que precision moderada é resultado esperado na literatura, mesmo com dados abundantes.*

---

## E. Avaliação / Métricas

**[14]** POWERS, D. M. W. Evaluation: from precision, recall and F-measure to ROC, informedness, markedness and correlation. **Journal of Machine Learning Technologies**, v. 2, n. 1, p. 37-63, 2011.
> *Fundamenta Precision, Recall e F1-Score. Cap. 2.5 e protocolo de validação (Cap. 3.6 / 5.4).*

---

## F. Metodologia Científica e Design Science Research

**[15]** HEVNER, A. R.; MARCH, S. T.; PARK, J.; RAM, S. Design science in information systems research. **MIS Quarterly**, v. 28, n. 1, p. 75-105, 2004.
> *Fundamento do método DSR adotado. Cap. 3.2.*

**[16]** PEFFERS, K.; TUUNANEN, T.; ROTHENBERGER, M. A.; CHATTERJEE, S. A design science research methodology for information systems research. **Journal of Management Information Systems**, v. 24, n. 3, p. 45-77, 2007.
> *Define as 6 etapas do DSR usadas no Cap. 3 (identificação → comunicação).*

**[17]** GIL, A. C. **Como elaborar projetos de pesquisa**. 6. ed. São Paulo: Atlas, 2017.
> *Classificação da pesquisa (aplicada, quantitativa). Cap. 3.1.*

**[18]** YIN, R. K. **Estudo de caso**: planejamento e métodos. 5. ed. Porto Alegre: Bookman, 2015.
> *Sustenta o procedimento de estudo de caso único (Quasar Barber).*

**[19]** MARCONI, M. de A.; LAKATOS, E. M. **Fundamentos de metodologia científica**. 8. ed. São Paulo: Atlas, 2017.
> *Apoio geral de metodologia e normalização. Cap. 3.*

---

## Lista final consolidada (ordem alfabética — copiar para o capítulo Referências)

```
ADOMAVICIUS, G.; TUZHILIN, A. Toward the next generation of recommender systems: a survey of the state-of-the-art and possible extensions. IEEE Transactions on Knowledge and Data Engineering, v. 17, n. 6, p. 734-749, 2005.

AGGARWAL, C. C. Recommender systems: the textbook. Cham: Springer, 2016.

AGRAWAL, R.; IMIELIŃSKI, T.; SWAMI, A. Mining association rules between sets of items in large databases. In: ACM SIGMOD INTERNATIONAL CONFERENCE ON MANAGEMENT OF DATA, 1993, Washington, D.C. Proceedings [...]. New York: ACM, 1993. p. 207-216.

AGRAWAL, R.; SRIKANT, R. Fast algorithms for mining association rules. In: INTERNATIONAL CONFERENCE ON VERY LARGE DATA BASES (VLDB), 20., 1994, Santiago, Chile. Proceedings [...]. San Francisco: Morgan Kaufmann, 1994. p. 487-499.

BRIN, S.; MOTWANI, R.; ULLMAN, J. D.; TSUR, S. Dynamic itemset counting and implication rules for market basket data. In: ACM SIGMOD INTERNATIONAL CONFERENCE ON MANAGEMENT OF DATA, 1997, Tucson. Proceedings [...]. New York: ACM, 1997. p. 255-264.

GIL, A. C. Como elaborar projetos de pesquisa. 6. ed. São Paulo: Atlas, 2017.

HAHSLER, M.; GRÜN, B.; HORNIK, K. arules — a computational environment for mining association rules and frequent item sets. Journal of Statistical Software, v. 14, n. 15, p. 1-25, 2005.

HAN, J.; KAMBER, M.; PEI, J. Data mining: concepts and techniques. 3. ed. Waltham: Morgan Kaufmann, 2011.

HAN, J.; PEI, J.; YIN, Y. Mining frequent patterns without candidate generation. In: ACM SIGMOD INTERNATIONAL CONFERENCE ON MANAGEMENT OF DATA, 2000, Dallas. Proceedings [...]. New York: ACM, 2000. p. 1-12.

HEVNER, A. R.; MARCH, S. T.; PARK, J.; RAM, S. Design science in information systems research. MIS Quarterly, v. 28, n. 1, p. 75-105, 2004.

KOREN, Y.; BELL, R.; VOLINSKY, C. Matrix factorization techniques for recommender systems. Computer, v. 42, n. 8, p. 30-37, 2009.

LINDEN, G.; SMITH, B.; YORK, J. Amazon.com recommendations: item-to-item collaborative filtering. IEEE Internet Computing, v. 7, n. 1, p. 76-80, 2003.

MARCONI, M. de A.; LAKATOS, E. M. Fundamentos de metodologia científica. 8. ed. São Paulo: Atlas, 2017.

MORAES, Francine Machado. Recomendação de produtos através do método de Market Basket Analysis aplicado ao cenário de Big Data. Orientador: Tiago Thompsen Primo. 2023. 66 f. Dissertação (Mestrado em Ciência da Computação) — Centro de Desenvolvimento Tecnológico, Universidade Federal de Pelotas, Pelotas, 2023.

PEFFERS, K.; TUUNANEN, T.; ROTHENBERGER, M. A.; CHATTERJEE, S. A design science research methodology for information systems research. Journal of Management Information Systems, v. 24, n. 3, p. 45-77, 2007.

POWERS, D. M. W. Evaluation: from precision, recall and F-measure to ROC, informedness, markedness and correlation. Journal of Machine Learning Technologies, v. 2, n. 1, p. 37-63, 2011.

RESNICK, P.; VARIAN, H. R. Recommender systems. Communications of the ACM, v. 40, n. 3, p. 56-58, 1997.

RICCI, F.; ROKACH, L.; SHAPIRA, B. (Eds.). Recommender systems handbook. 2. ed. New York: Springer, 2015.

SARWAR, B.; KARYPIS, G.; KONSTAN, J.; RIEDL, J. Item-based collaborative filtering recommendation algorithms. In: INTERNATIONAL CONFERENCE ON WORLD WIDE WEB (WWW), 10., 2001, Hong Kong. Proceedings [...]. New York: ACM, 2001. p. 285-295.

SCHAFER, J. B.; KONSTAN, J. A.; RIEDL, J. E-commerce recommendation applications. Data Mining and Knowledge Discovery, v. 5, n. 1-2, p. 115-153, 2001.

SCHONHORST, Gustavo Bonnard. Mineração de regras de associação aplicada à modelagem dos dados transacionais de um supermercado. 2010. Dissertação (Mestrado) — Universidade Federal de Itajubá, Itajubá, 2010.

TAN, P.-N.; STEINBACH, M.; KUMAR, V. Introduction to data mining. Boston: Pearson Addison-Wesley, 2005.

YIN, R. K. Estudo de caso: planejamento e métodos. 5. ed. Porto Alegre: Bookman, 2015.
```
