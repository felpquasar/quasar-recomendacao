# 1 INTRODUÇÃO

## 1.1 Contextualização

O crescimento do volume de dados transacionais gerados pelo comércio tornou a mineração de dados uma ferramenta estratégica para a tomada de decisão. Entre suas aplicações, os sistemas de recomendação destacam-se por transformar registros históricos de vendas em sugestões úteis, capazes de orientar o consumidor e ampliar o resultado comercial das empresas (RESNICK; VARIAN, 1997). Tais sistemas tornaram-se onipresentes no comércio eletrônico de massa — casos como o da Amazon, que atribui parcela significativa de suas vendas a recomendações item-a-item, ilustram o impacto econômico da técnica (LINDEN; SMITH; YORK, 2003).

A literatura de sistemas de recomendação consolidou três grandes abordagens: a filtragem colaborativa, a filtragem baseada em conteúdo e os métodos híbridos (ADOMAVICIUS; TUZHILIN, 2005). A filtragem colaborativa, predominante na indústria, depende de uma matriz usuário-item densa, povoada por avaliações ou interações de um grande número de usuários (SARWAR et al., 2001; KOREN; BELL; VOLINSKY, 2009). Esse pressuposto, contudo, raramente se sustenta fora do varejo de massa.

No comércio business-to-business (B2B) de pequeno e médio porte, o cenário é substancialmente distinto. Uma distribuidora atende a um número reduzido de clientes — outras empresas, não consumidores finais —, não coleta avaliações de produtos e movimenta um volume transacional modesto quando comparado ao varejo B2C. Nesse contexto, as condições que viabilizam a filtragem colaborativa simplesmente não existem: a matriz usuário-item é severamente esparsa, e o problema do *cold start* é a regra, não a exceção.

É nesse recorte que se insere a Quasar Barber, distribuidora de produtos para barbearias situada em Codó, Maranhão, e empresa do próprio autor. Como ocorre na maioria das distribuidoras desse porte, as decisões de venda casada (*cross-sell*) e de sugestão de reposição são tomadas de forma intuitiva, apoiadas na memória e na experiência da equipe de vendas. Esse conhecimento, embora valioso, é tácito, não escalável e impossível de auditar. Ao mesmo tempo, a empresa acumula um histórico de pedidos que, devidamente analisado, poderia revelar padrões de compra conjunta hoje invisíveis ao olhar humano.

A técnica de regras de associação, ou *Market Basket Analysis*, oferece um caminho promissor para esse problema. Originalmente concebida para descobrir produtos frequentemente comprados juntos em transações de supermercado (AGRAWAL; IMIELIŃSKI; SWAMI, 1993), ela extrai padrões de coocorrência diretamente do histórico transacional, sem depender de avaliações de usuários nem de matrizes densas. Por operar sobre as próprias transações, é particularmente adequada a cenários esparsos — exatamente a condição encontrada no B2B de baixo volume.

## 1.2 Problema de pesquisa

Distribuidoras B2B de pequeno e médio porte operam com um catálogo amplo, mas conduzem decisões de *cross-sell* e de sugestão de reposição de forma intuitiva. Diferentemente do varejo B2C, esse cenário caracteriza-se por **poucos clientes**, **ausência de avaliações ou notas de produto** e **volume transacional reduzido** — condições que inviabilizam a filtragem colaborativa clássica, dependente de uma matriz usuário-item densa (SARWAR et al., 2001).

Diante desse quadro, formula-se a seguinte pergunta de pesquisa:

> **É possível gerar recomendações de produtos úteis e estatisticamente relevantes para uma distribuidora B2B de pequeno porte utilizando apenas regras de associação extraídas do histórico transacional, mesmo diante de um volume reduzido de transações?**

Desdobram-se, a partir dela, três sub-perguntas:

1. Quais limiares de *support* e *confidence* produzem regras relevantes (não triviais) em um conjunto de dados esparso, da ordem de dezenas de transações?
2. Como a métrica de *lift* distingue associações causalmente úteis de coocorrências por mero acaso nesse cenário?
3. Quais são as limitações de validação (Precision, Recall e F1-Score) quando o conjunto de teste contém poucas transações multi-item?

## 1.3 Hipótese

Em resposta à pergunta de pesquisa, propõe-se a seguinte hipótese de trabalho:

**H1 —** Regras de associação com `confidence ≥ 0,30` e `support ≥ 0,02`, ranqueadas por `lift`, produzem recomendações de *cross-sell* coerentes com o conhecimento de domínio da distribuidora, mesmo em um conjunto de dados reduzido.

A ela contrapõe-se a hipótese nula:

**H0 —** Em volume transacional reduzido, as regras geradas são indistinguíveis de coocorrências aleatórias e não superam uma recomendação baseada apenas nos produtos mais vendidos (*baseline* de popularidade).

## 1.4 Objetivos

### 1.4.1 Objetivo geral

Desenvolver e validar um sistema de recomendação de produtos B2B baseado em regras de associação (*Market Basket Analysis*), aplicado ao histórico de vendas da Quasar Barber, capaz de sugerir produtos complementares com relevância estatística mensurável.

### 1.4.2 Objetivos específicos

1. **Revisar** a literatura sobre sistemas de recomendação, regras de associação (Apriori) e as métricas *support*, *confidence* e *lift*.
2. **Modelar** uma base de dados transacional (PostgreSQL/Supabase) que represente clientes, produtos, vendas e itens de venda da distribuidora.
3. **Implementar** o algoritmo de extração de regras de associação e a geração de recomendações Top-N em uma API REST (Node.js/Express).
4. **Construir** uma interface web (React) que permita consultar recomendações por produto e visualizar métricas e gráficos das regras descobertas.
5. **Validar** a qualidade das recomendações por meio de *train/test split* (80/20), calculando Precision, Recall e F1-Score, e discutir as limitações impostas pelo tamanho do conjunto de dados.
6. **Analisar** as regras de maior *lift* sob a ótica de negócio, verificando sua aderência ao conhecimento de domínio.

## 1.5 Justificativa

A relevância deste trabalho se sustenta em três planos complementares.

**Acadêmico.** A maior parte dos estudos sobre sistemas de recomendação concentra-se em cenários B2C de grande volume — Amazon, Netflix e congêneres (LINDEN; SMITH; YORK, 2003; KOREN; BELL; VOLINSKY, 2009). Há, contudo, uma lacuna em aplicações B2B de baixo volume, nas quais a escolha do algoritmo é restringida pela esparsidade dos dados. Este trabalho documenta empiricamente por que as regras de associação se mostram adequadas justamente onde a filtragem colaborativa falha, contribuindo para um recorte pouco explorado da literatura.

**Prático e econômico.** A Quasar Barber é uma empresa real, do próprio autor. O sistema endereça uma dor concreta: apoiar a equipe de vendas com sugestões de venda casada fundamentadas em dados, e não em intuição. Há potencial direto de aumento do ticket médio e de redução da dependência do conhecimento tácito de vendedores específicos.

**Técnico.** O trabalho demonstra uma arquitetura completa e reprodutível — *backend*, *frontend*, cache, testes e validação — de baixo custo, viável para pequenas empresas que não dispõem de infraestrutura de *Big Data*. Diferentemente de abordagens que pressupõem processamento distribuído (MORAES, 2023), esta proposta opera sobre recursos modestos, ampliando seu alcance prático.

## 1.6 Delimitação do escopo

O estudo restringe-se a um sistema de recomendação baseado **exclusivamente** em regras de associação extraídas do histórico transacional da Quasar Barber. Não abrange filtragem colaborativa, modelos de aprendizado profundo, nem recomendação em tempo real durante o *checkout*. O recorte de dados é o conjunto de pedidos de 2026, composto por 33 transações e 33 produtos únicos — escala deliberadamente reduzida, que constitui tanto a limitação quanto o objeto central de investigação do trabalho.

A escolha por uma extração de regras par-a-par (e não pelo algoritmo Apriori multi-item em sua forma completa) é igualmente parte da delimitação, justificada no Capítulo 4 pelo porte do conjunto de dados e pelo objetivo de gerar recomendações Top-N de produtos individuais.

## 1.7 Organização do trabalho

Além desta introdução, a monografia organiza-se em mais cinco capítulos:

- O **Capítulo 2 — Fundamentação Teórica** revisa os sistemas de recomendação e sua taxonomia, as regras de associação e o algoritmo Apriori, as métricas *support*, *confidence* e *lift*, o problema do *cold start* e da esparsidade, o *cross-sell* no comércio B2B, as métricas de avaliação e os trabalhos relacionados.
- O **Capítulo 3 — Metodologia** classifica a pesquisa, apresenta o método *Design Science Research*, descreve a coleta e o pré-processamento dos dados, as ferramentas adotadas e o protocolo de validação.
- O **Capítulo 4 — Desenvolvimento do Sistema** detalha a arquitetura, a modelagem de dados, a implementação do algoritmo, a geração de recomendações, a API REST, a camada de cache e a interface web.
- O **Capítulo 5 — Resultados e Discussão** caracteriza o conjunto de dados, analisa as regras descobertas, apresenta as métricas globais e de avaliação, confronta a hipótese e discute as limitações.
- O **Capítulo 6 — Conclusão** sintetiza as contribuições, responde à pergunta de pesquisa e aponta trabalhos futuros.
