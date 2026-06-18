# 3 METODOLOGIA

Este capítulo descreve o percurso metodológico adotado para desenvolver e avaliar o sistema de recomendação proposto. Apresenta-se a classificação da pesquisa (Seção 3.1), o método de *Design Science Research* que estrutura o trabalho (Seção 3.2), a origem e a coleta dos dados (Seção 3.3), as etapas de pré-processamento (Seção 3.4), as ferramentas e tecnologias empregadas (Seção 3.5) e, por fim, o protocolo de validação das recomendações (Seção 3.6).

## 3.1 Classificação da pesquisa

Quanto à natureza, esta pesquisa classifica-se como **aplicada**, pois visa gerar conhecimento dirigido à solução de um problema concreto e específico — o apoio à decisão de venda casada em uma distribuidora B2B real (GIL, 2017). Quanto à abordagem, é predominantemente **quantitativa**: tanto a extração das regras de associação quanto a avaliação das recomendações apoiam-se em métricas numéricas (*support*, *confidence*, *lift*, *Precision*, *Recall* e *F1-Score*).

Quanto aos objetivos, a pesquisa é **exploratória e descritiva**, na medida em que investiga a viabilidade de uma técnica em um cenário pouco estudado — o B2B de baixo volume transacional — e descreve os padrões de coocorrência encontrados nos dados. Quanto aos procedimentos técnicos, adota-se o **estudo de caso único** (YIN, 2015), tendo a Quasar Barber como unidade de análise, combinado ao desenvolvimento de um artefato de software conforme o paradigma de *Design Science Research* (MARCONI; LAKATOS, 2017; HEVNER et al., 2004).

## 3.2 Design Science Research como método

Diferentemente das ciências naturais, que buscam explicar fenômenos existentes, a *Design Science Research* (DSR) orienta-se à construção e à avaliação de artefatos que resolvem problemas reais, produzindo conhecimento por meio do próprio ato de projetar (HEVNER et al., 2004). Por se tratar do desenvolvimento de um sistema computacional destinado a uma necessidade organizacional concreta, a DSR mostra-se o método mais aderente a este trabalho.

Adota-se a operacionalização proposta por Peffers et al. (2007), que organiza a DSR em seis atividades. O Quadro 1 relaciona cada atividade à sua concretização nesta monografia.

**Quadro 1 — Atividades da DSR aplicadas ao trabalho**

| Atividade (PEFFERS et al., 2007) | Concretização neste trabalho |
|---|---|
| 1. Identificação do problema e motivação | Decisões de *cross-sell* tomadas de forma intuitiva em distribuidora B2B de baixo volume (Capítulo 1). |
| 2. Definição dos objetivos da solução | Gerar recomendações Top-N estatisticamente relevantes a partir do histórico transacional (Seção 1.4). |
| 3. Projeto e desenvolvimento | Sistema completo — banco de dados, algoritmo de regras de associação, API REST e interface web (Capítulo 4). |
| 4. Demonstração | Execução do sistema sobre os dados reais de vendas de 2026 da Quasar Barber. |
| 5. Avaliação | Cálculo de Precision, Recall e F1-Score por validação cruzada, além da análise das regras por *lift* (Capítulo 5). |
| 6. Comunicação | Esta monografia e a sua defesa perante a banca. |

Fonte: elaborado pelo autor (2026).

## 3.3 Coleta e origem dos dados

Os dados utilizados são **transações reais de venda** da Quasar Barber, distribuidora de produtos para barbearias situada em Codó, Maranhão. O conjunto corresponde aos pedidos registrados entre **29 de abril e 18 de junho de 2026**, exportados do sistema de gestão da empresa para um arquivo no formato CSV (*comma-separated values*, com ponto e vírgula como separador).

Cada linha do arquivo bruto representa um **item de pedido** e contém os campos: número do pedido, data, cliente, produto, quantidade e valor unitário. Pedidos com mais de um produto ocupam, portanto, múltiplas linhas que compartilham o mesmo número de pedido. Essa estrutura é precisamente a exigida pela *Market Basket Analysis*, em que cada pedido constitui uma transação (cesta) e os produtos nela contidos formam o itemset observado (AGRAWAL; IMIELIŃSKI; SWAMI, 1993).

Após o pré-processamento descrito na Seção 3.4, o conjunto final é composto por **30 transações**, **26 clientes** e **29 produtos únicos**, totalizando 52 itens de venda. Desse total, **14 transações contêm dois ou mais produtos** — são essas as cestas efetivamente úteis à descoberta de regras de coocorrência. As demais, de item único, contribuem para o cálculo de suporte individual dos produtos, mas não geram regras por si sós. A modéstia desse volume é característica intrínseca do cenário B2B investigado e tem implicações diretas sobre a validação, discutidas na Seção 3.6 e no Capítulo 5.

Por se tratar de dados da própria empresa do autor, utilizados de forma agregada e sem exposição de informações pessoais sensíveis de consumidores finais, não houve necessidade de submissão a comitê de ética; os nomes de clientes (pessoas jurídicas e compradores) são empregados apenas como identificadores de transação no processamento.

## 3.4 Pré-processamento dos dados

O arquivo bruto exportado não está imediatamente pronto para a mineração: requer limpeza e transformação. As etapas de pré-processamento, implementadas em um *script* de carga (`seed-csv.js`, detalhado na Seção 4.2), são as seguintes:

1. **Normalização de codificação.** O arquivo de origem apresentava codificação inconsistente (mistura de *Latin-1* e UTF-8), o que corrompia caracteres acentuados. Padronizou-se todo o texto em UTF-8, com transliteração dos acentos para ASCII a fim de garantir uniformidade na comparação de nomes de produtos.

2. **Validação de integridade transacional.** Verificou-se que cada número de pedido correspondesse a um único cliente e a uma única data. Inconsistências em que um mesmo número agregava clientes distintos — que produziriam cestas artificiais e regras espúrias — foram corrigidas com a separação dos pedidos.

3. **Agrupamento por pedido.** As múltiplas linhas de item foram agrupadas pelo número do pedido, reconstituindo cada transação como um conjunto de produtos (a cesta).

4. **Deduplicação intratransação.** Quando um mesmo produto aparecia repetido na mesma cesta, as ocorrências foram consolidadas, somando-se as quantidades, de modo que cada produto figure uma única vez por transação — condição necessária para o cálculo correto do suporte.

5. **Inferência de categoria.** Para fins de análise e exibição, cada produto foi classificado em uma de três categorias (*Barba*, *Cabelo* ou *Acessórios*) por meio de regras heurísticas sobre palavras-chave do nome (por exemplo, a presença de "barba", "balm" ou "after shave" indica a categoria *Barba*).

6. **Conversão de formatos.** As datas, originalmente no padrão brasileiro `DD/MM/AAAA`, foram convertidas para o padrão ISO `AAAA-MM-DD` exigido pelo banco de dados, e os valores monetários foram normalizados para ponto decimal.

O produto dessas etapas é um conjunto de transações limpo e consistente, carregado nas tabelas relacionais descritas no Capítulo 4.

## 3.5 Ferramentas e tecnologias

A seleção tecnológica privilegiou ferramentas gratuitas ou de baixo custo, reprodutíveis e adequadas ao porte de uma pequena empresa, em coerência com a justificativa técnica do trabalho (Seção 1.5). O Quadro 2 sintetiza a *stack* adotada.

**Quadro 2 — Ferramentas e tecnologias empregadas**

| Camada | Tecnologia | Função |
|---|---|---|
| Linguagem | JavaScript (Node.js 18) | Lógica do *back-end* e do algoritmo |
| Framework web | Express | Roteamento e exposição da API REST |
| Banco de dados | PostgreSQL via Supabase | Persistência das transações |
| Acesso a dados | Supabase JS / PostgREST | Consultas via API REST sobre o banco |
| Cache | Redis (opcional) | Memoização das regras calculadas |
| Front-end | React 18 + Vite | Interface web e *build* |
| Visualização | Chart.js | Gráficos das regras e métricas |
| Testes | Jest + Supertest | Testes unitários e de integração |

Fonte: elaborado pelo autor (2026).

A escolha do Supabase como plataforma de banco de dados deve-se à oferta de um PostgreSQL gerenciado em camada gratuita, com acesso via API REST (PostgREST), o que dispensa a manutenção de servidor próprio. O cache em Redis é tratado como dependência opcional: na sua ausência, o sistema recalcula as regras a cada requisição, degradando o desempenho, mas preservando a corretude — decisão de projeto detalhada na Seção 4.7.

## 3.6 Protocolo de validação

A avaliação da qualidade das recomendações emprega as três métricas clássicas de recuperação de informação — **Precision**, **Recall** e **F1-Score** (POWERS, 2011) —, cuja fundamentação consta da Seção 2.5. A estratégia para estimá-las, contudo, precisa acomodar a principal restrição deste estudo: o reduzido número de transações.

### 3.6.1 Limitação do *holdout* simples

A abordagem mais comum, o *holdout* por divisão treino/teste (por exemplo, 80% para treino e 20% para teste), foi inicialmente implementada como referência. Em um conjunto de 30 transações, porém, os 20% reservados ao teste correspondem a apenas seis transações, das quais somente as multi-item permitem avaliação efetiva — na prática, **três transações avaliáveis**. Uma estimativa apoiada em tão poucos casos é altamente instável: a inclusão ou exclusão de uma única transação altera drasticamente o resultado, comprometendo a confiabilidade da métrica.

### 3.6.2 Validação cruzada *Leave-One-Out* (LOOCV)

Para mitigar essa limitação, adota-se como protocolo **principal** a validação cruzada *Leave-One-Out* (LOOCV), recomendada para conjuntos de dados pequenos por aproveitar ao máximo a informação disponível (HAN; KAMBER; PEI, 2011). Em vez de uma única partição, o procedimento executa $N$ rodadas, sendo $N$ o número de transações: em cada rodada, uma transação é separada para teste e o algoritmo é treinado com as $N-1$ restantes. Assim, cada transação é usada como teste exatamente uma vez, e o modelo é sempre treinado com o máximo de dados possível.

Em cada transação de teste, aplica-se o esquema de **ocultação de um item** (*leave-one-out* interno): de uma cesta com $k$ produtos, oculta-se um produto por vez e apresentam-se os $k-1$ restantes como antecedentes. O algoritmo gera as Top-N recomendações a partir das regras de treino, e verifica-se se o produto ocultado figura entre as sugeridas. Uma cesta de $k$ produtos gera, portanto, $k$ subtestes. As métricas são calculadas sobre o conjunto de todos os subtestes acumulados nas $N$ rodadas.

Formalmente, para cada subteste, sendo $R$ o conjunto de produtos recomendados e $\{p\}$ o produto ocultado (a verdade de referência):

$$
\text{Precision} = \frac{|R \cap \{p\}|}{|R|}, \qquad
\text{Recall} = \frac{|R \cap \{p\}|}{|\{p\}|}
$$

### 3.6.3 Considerações sobre o teto da Precision

Cabe registrar uma propriedade do esquema de ocultação de um único item: como há exatamente **um** produto a recuperar e o sistema recomenda até $N$ produtos (com $N = 3$), o valor máximo teórico da Precision em um subteste com acerto é $1/N \approx 0{,}33$. A Precision, neste desenho, é estruturalmente limitada e deve ser interpretada à luz desse teto; o **Recall** e o **F1-Score** tornam-se, assim, os indicadores mais informativos da capacidade de o sistema "completar a cesta". Essa interpretação é retomada na análise dos resultados (Capítulo 5).

Os parâmetros do algoritmo são mantidos constantes em toda a validação, nos valores definidos para o sistema: confiança mínima de 0,30, suporte mínimo de 0,02, *lift* mínimo de 1,0 e $N = 3$ recomendações. A justificativa desses limiares e os resultados obtidos são apresentados no Capítulo 5.
