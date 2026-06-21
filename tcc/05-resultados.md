# 5 RESULTADOS E DISCUSSÃO

Este capítulo apresenta e discute os resultados obtidos com a aplicação do sistema descrito no Capítulo 4 sobre os dados reais de venda da Quasar Barber. Inicia-se pela caracterização do conjunto de dados (Seção 5.1), seguindo-se a análise das regras de associação descobertas e seu ordenamento por *lift* (Seção 5.2) e a síntese das métricas globais do conjunto de regras (Seção 5.3). A Seção 5.4 reporta a avaliação por Precision, Recall e F1-Score sob o protocolo de validação cruzada *Leave-One-Out* (LOOCV) e discute suas limitações. As Seções 5.5 e 5.6 examinam, respectivamente, a aderência das regras ao conhecimento de domínio e o confronto dos resultados com a hipótese de pesquisa. A Seção 5.7 encerra com as limitações do estudo.

## 5.1 Caracterização do conjunto de dados

Após o pré-processamento descrito na Seção 3.4, o conjunto de dados consolidado é composto por **30 transações**, **26 clientes** e **29 produtos únicos**, totalizando **52 itens de venda**, referentes ao período de 29 de abril a 18 de junho de 2026. Desse total de transações, **14 contêm dois ou mais produtos** — as cestas efetivamente úteis à descoberta de regras de coocorrência —, ao passo que as 16 restantes, de item único, contribuem apenas para o cálculo do suporte individual dos produtos. O Quadro 5 sintetiza os indicadores do conjunto.

**Quadro 5 — Caracterização do conjunto de dados**

| Indicador | Valor |
|---|---|
| Transações (cestas) | 30 |
| Clientes distintos | 26 |
| Produtos únicos | 29 |
| Itens de venda | 52 |
| Transações multi-item (k ≥ 2) | 14 |
| Período de referência | 29/04/2026 a 18/06/2026 |

Fonte: elaborado pelo autor (2026).

A média de itens por transação é de aproximadamente 1,73 produto por cesta, valor coerente com a natureza do comércio B2B de reposição investigado, em que parte expressiva dos pedidos visa a reposição de um único produto. Essa esparsidade é a característica central do cenário e condiciona toda a análise subsequente: por um lado, restringe o número de regras passíveis de extração; por outro, é justamente a circunstância em que a filtragem colaborativa clássica falha e em que a pertinência das regras de associação é posta à prova (Seções 1.2 e 2.3).

## 5.2 Regras descobertas e análise por *lift*

Submetido o conjunto ao algoritmo de extração (Seção 4.4), com confiança mínima de 0,30 e suporte mínimo de 0,02, foram geradas **44 regras de associação** do tipo $A \Rightarrow B$. A Tabela 1 apresenta as dez regras de maior *lift*, indicador que mede o quanto a coocorrência de dois produtos excede o esperado sob a hipótese de independência (Seção 2.2.3).

**Tabela 1 — Dez regras de maior *lift***

| # | Antecedente (A) | Consequente (B) | Conf. | Sup. | Lift |
|---|---|---|---|---|---|
| 1 | After Shave 100g – Loção Pós Barba (QOD) | Café Verde Shampoo 220ml (QOD) | 1,00 | 0,033 | 30,0 |
| 2 | Café Verde Shampoo 220ml (QOD) | After Shave 100g – Loção Pós Barba (QOD) | 1,00 | 0,033 | 30,0 |
| 3 | Silver Boost Shampoo 220ml (QOD) | Bálsamo Fortalecedor de Barba 100g (QOD) | 1,00 | 0,033 | 30,0 |
| 4 | Bálsamo Fortalecedor de Barba 100g (QOD) | Silver Boost Shampoo 220ml (QOD) | 1,00 | 0,033 | 30,0 |
| 5 | Escova de Disfarce Barber Pro (madeira) | Escovinha de Disfarce Annie 2073 | 1,00 | 0,033 | 15,0 |
| 6 | Shampoo para Barba 120ml (Fox for Men) | Óleo para Barba Spray 60ml (Fox for Men) | 1,00 | 0,067 | 15,0 |
| 7 | Óleo para Barba Spray 60ml (Fox for Men) | Shampoo para Barba 120ml (Fox for Men) | 1,00 | 0,067 | 15,0 |
| 8 | Pente de Madeira Bambu Meia-Lua 9,5 | Shampoo para Barba 120ml (Fox for Men) | 1,00 | 0,033 | 15,0 |
| 9 | Pente de Madeira Bambu Meia-Lua 9,5 | Óleo para Barba Spray 60ml (Fox for Men) | 1,00 | 0,033 | 15,0 |
| 10 | Maquiagem Capilar Preto 25g (Fox for Men) | Aplicador de Fibra Capilar (Fox for Men) | 1,00 | 0,067 | 15,0 |

Fonte: elaborado pelo autor (2026).

Todas as regras do topo apresentam confiança de 100%, indicando que, sempre que o antecedente foi comprado, o consequente também esteve presente na mesma cesta. Os valores de *lift* — de 15,0 a 30,0 — são, em termos absolutos, bastante elevados, sinalizando associações muito mais fortes do que o acaso. Cabe, porém, uma leitura cautelosa: nesse desenho, o *lift* de uma regra com confiança 1,0 é igual a $1/\text{support}(B)$. Os consequentes do topo ocorrem em apenas uma ou duas das 30 transações, de modo que seu suporte isolado é mínimo (0,033 ou 0,067) e o *lift* resultante é, por construção, alto. Em outras palavras, **os maiores valores de *lift* coincidem com os pares de menor suporte** — produtos que apareceram juntos em pouquíssimas cestas. Esse fenômeno não invalida as regras, mas exige que o *lift* seja interpretado em conjunto com o suporte e com o conhecimento de domínio (Seção 5.5), sob pena de superestimar a robustez estatística de coocorrências raras. É precisamente a distinção que a segunda sub-pergunta de pesquisa (Capítulo 1) propõe investigar.

## 5.3 Métricas globais do conjunto de regras

Considerado o conjunto completo das 44 regras, os indicadores agregados são apresentados no Quadro 6.

**Quadro 6 — Métricas globais do conjunto de regras**

| Métrica | Valor médio |
|---|---|
| Total de regras geradas | 44 |
| Confiança média | 0,7651 (76,51%) |
| Suporte médio | 0,0439 (4,39%) |
| *Lift* médio | 12,41 |

Fonte: elaborado pelo autor (2026).

A confiança média de 76,51% indica que, em média, a presença do antecedente é forte preditora da presença do consequente entre as regras retidas — efeito esperado, dado que o filtro de confiança mínima (0,30) descarta as associações fracas. O suporte médio de apenas 4,39% reflete diretamente a esparsidade do conjunto: as regras descrevem padrões reais, porém pouco frequentes em termos absolutos. O *lift* médio de 12,41, muito superior a 1,0, confirma que as associações retidas estão longe da independência estatística — ainda que, conforme discutido na Seção 5.2, esse valor seja parcialmente inflado pelo baixo suporte dos consequentes.

## 5.4 Avaliação por Precision, Recall e F1-Score

A qualidade preditiva das recomendações foi estimada pelo protocolo de validação cruzada *Leave-One-Out* (LOOCV), descrito na Seção 3.6.2, com o esquema de ocultação de um item e $N = 3$ recomendações por sub-teste. Das 30 transações, as 14 multi-item foram efetivamente avaliáveis, gerando, no total, **36 sub-testes**. O Quadro 7 apresenta os resultados.

**Quadro 7 — Resultados da validação cruzada *Leave-One-Out* (LOOCV)**

| Métrica | Valor |
|---|---|
| Transações avaliadas | 14 |
| Sub-testes acumulados | 36 |
| Precision média | 0,2639 (26,39%) |
| Recall médio | 0,4444 (44,44%) |
| F1-Score médio | 0,3194 (31,94%) |

Fonte: elaborado pelo autor (2026).

A interpretação desses valores deve partir do teto estrutural da Precision discutido na Seção 3.6.3. Como cada sub-teste oculta **um único** produto e o sistema sugere até **três**, o valor máximo da Precision em um acerto é $1/3 \approx 0{,}33$. A Precision média obtida (0,2639) situa-se, portanto, próxima do seu limite superior teórico, e não deve ser lida como "73% de erro": ela é uma consequência aritmética do desenho de avaliação, não de baixa qualidade das sugestões. Por essa razão, o **Recall** e o **F1-Score** são, neste estudo, os indicadores mais informativos.

O Recall médio de 44,44% significa que, em 16 dos 36 sub-testes, o produto deliberadamente ocultado da cesta foi recuperado entre as três recomendações — isto é, em quase metade dos casos o sistema "completou a cesta" corretamente a partir dos produtos restantes. Para um conjunto de apenas 14 transações avaliáveis, sem qualquer sinal de avaliação ou nota de produto e dependente exclusivamente da coocorrência, esse desempenho é expressivo. O F1-Score de 31,94%, média harmônica entre as duas métricas, sintetiza esse comportamento, sendo naturalmente puxado para baixo pelo teto da Precision.

### 5.4.1 Confronto com o *holdout* simples

A título de contraste, registra-se o resultado do *holdout* por divisão treino/teste 80/20, implementado apenas como referência e descartado como protocolo principal pelos motivos expostos na Seção 3.6.1. Sob essa abordagem, das 6 transações reservadas ao teste somente **3** eram multi-item e, portanto, avaliáveis, resultando em Precision, Recall e F1-Score todos iguais a **0,2222 (22,22%)**. A fragilidade desse número ilustra exatamente o problema antecipado: uma estimativa apoiada em três casos é instável e pouco confiável, ao passo que a LOOCV, ao percorrer todas as transações e acumular 36 sub-testes, oferece uma medida substancialmente mais robusta sobre o mesmo conjunto de dados. A superioridade metodológica da LOOCV em conjuntos pequenos fica, assim, evidenciada empiricamente.

## 5.5 Aderência ao conhecimento de domínio

Para além das métricas quantitativas, a avaliação de um sistema de recomendação exige verificar se as regras descobertas fazem sentido para o especialista do negócio — neste caso, o próprio autor, na condição de proprietário da distribuidora. O exame das regras de maior *lift* (Tabela 1) revela três padrões coerentes com a prática comercial:

1. **Complementaridade funcional dentro da rotina de barba.** As regras que associam *shampoo para barba*, *óleo para barba*, *bálsamo* e *loção pós-barba* (regras 1 a 4, 6 a 9) correspondem a produtos de uma mesma rotina de cuidado, frequentemente vendidos em conjunto às barbearias. São associações que um vendedor experiente faria intuitivamente — e que o sistema recuperou a partir apenas dos dados.

2. **Coerência de marca e linha de produto.** Observa-se forte coocorrência entre produtos de uma mesma marca, com destaque para as linhas *QOD* (regras 1 a 4) e *Fox for Men* (regras 6 a 10). Isso reflete o comportamento real de compra das barbearias, que tendem a padronizar fornecedores e adquirir kits de uma mesma linha.

3. **Associação por categoria de acessório.** A regra que liga a *Escova de Disfarce Barber Pro* à *Escovinha de Disfarce Annie* (regra 5) capta a compra conjunta de acessórios de função equivalente, padrão típico de reposição de estoque.

A aderência observada sustenta que as regras não são artefatos espúrios do algoritmo, mas refletem relações comerciais verossímeis — condição necessária para que a ferramenta seja útil à equipe de vendas. Ressalva-se, contudo, que a baixa frequência absoluta dessas coocorrências (Seção 5.2) impõe que as recomendações sejam tratadas como sugestões de apoio à decisão, e não como prescrições automáticas.

## 5.6 Confronto com a hipótese de pesquisa

Retoma-se aqui a hipótese formulada na Seção 1.3:

> **H1 —** Regras de associação com `confidence ≥ 0,30` e `support ≥ 0,02`, ranqueadas por *lift*, produzem recomendações de *cross-sell* coerentes com o conhecimento de domínio da distribuidora, mesmo em dataset reduzido.
>
> **H0 (nula) —** Em volume transacional reduzido, as regras geradas são indistinguíveis de coocorrências aleatórias e não superam uma recomendação baseada apenas em produtos mais vendidos (*baseline* de popularidade).

Os resultados favorecem a **não rejeição de H1**. As 44 regras extraídas, sob os limiares definidos, apresentaram *lift* médio de 12,41 — muito acima de 1,0, valor que caracterizaria coocorrências aleatórias —, e as regras de maior destaque mostraram aderência clara ao conhecimento de domínio (Seção 5.5). Quanto à hipótese nula, o desempenho do sistema sob LOOCV (Recall de 44,44%) demonstra capacidade preditiva real: um *baseline* de popularidade, que recomendasse sempre os produtos mais vendidos independentemente do antecedente, não recuperaria os pares específicos de complementaridade observados, dado que os produtos das regras de maior *lift* não são, em geral, os de maior volume individual. Há, portanto, evidência de que as regras carregam informação além da mera frequência, o que contraria H0.

Essa conclusão deve ser qualificada pela escala do estudo: trata-se de evidência obtida sobre 14 transações avaliáveis, suficiente para sustentar a viabilidade da abordagem no cenário investigado, mas não para generalização estatística ampla — limitação tratada na seção seguinte.

## 5.7 Limitações do estudo

O principal condicionante dos resultados é o **volume reduzido de dados**: 30 transações, das quais apenas 14 multi-item. Embora esse tamanho seja realista para o recorte temporal e o porte da empresa, ele restringe o número de regras extraíveis, eleva a sensibilidade das métricas a casos individuais e infla os valores de *lift* das coocorrências raras (Seção 5.2). À medida que o histórico da distribuidora crescer, espera-se maior estabilidade das estimativas e suporte mais robusto para as regras.

Uma segunda limitação decorre de uma decisão de projeto deliberada (Seção 4.9): a restrição a **regras de um item no antecedente e um no consequente**. Padrões legítimos envolvendo três ou mais produtos comprados em conjunto não são capturados. A generalização para itemsets de maior cardinalidade, via Apriori ou FP-Growth completos, fica registrada como trabalho futuro, a ser justificada quando o volume de dados a tornar estatisticamente viável.

Por fim, o **teto estrutural da Precision** imposto pelo esquema de ocultação de um único item (Seção 3.6.3) limita a comparabilidade direta dos números absolutos deste trabalho com os de estudos que adotam outros protocolos de avaliação. A interpretação privilegiou, por isso, o Recall e o F1-Score, e contextualizou a Precision à luz de seu limite teórico. Essas limitações, longe de invalidarem o estudo, delimitam com honestidade o seu alcance e apontam direções concretas de continuidade, retomadas na conclusão (Capítulo 6).
