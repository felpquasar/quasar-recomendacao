# 2 FUNDAMENTAÇÃO TEÓRICA

Este capítulo reúne os fundamentos teóricos que sustentam o desenvolvimento e a avaliação do sistema proposto. Inicia-se pela definição e taxonomia dos sistemas de recomendação (Seção 2.1), passando às regras de associação e ao algoritmo Apriori (Seção 2.2). Em seguida, discute-se o problema do *cold start* e da esparsidade (Seção 2.3) — central para justificar a escolha metodológica deste trabalho —, o *cross-sell* no comércio B2B (Seção 2.4) e as métricas de avaliação de recomendações (Seção 2.5). O capítulo encerra com a discussão dos trabalhos relacionados (Seção 2.6).

## 2.1 Sistemas de recomendação

### 2.1.1 Definição e taxonomia

Sistemas de recomendação são ferramentas de software e técnicas que fornecem sugestões de itens potencialmente úteis a um usuário (RICCI; ROKACH; SHAPIRA, 2015). O termo foi cunhado por Resnick e Varian (1997), que descreveram esses sistemas como mecanismos capazes de auxiliar e ampliar o processo social natural de recomendação, no qual as pessoas se apoiam em sugestões de terceiros para tomar decisões diante de um excesso de opções.

Adomavicius e Tuzhilin (2005), em survey de referência, formalizam o problema de recomendação como a estimativa de uma função de utilidade que, dado um usuário e um item ainda não avaliado, prevê o quão relevante aquele item será para aquele usuário. A partir dessa formulação, os autores consolidam uma taxonomia hoje canônica, que distingue três grandes abordagens: a filtragem colaborativa, a filtragem baseada em conteúdo e os métodos híbridos.

### 2.1.2 Filtragem colaborativa

A filtragem colaborativa (*collaborative filtering*) recomenda itens com base nas preferências de usuários semelhantes, partindo da premissa de que pessoas que concordaram no passado tenderão a concordar no futuro (SARWAR et al., 2001). Seu insumo fundamental é uma **matriz usuário-item**, na qual cada célula registra a avaliação (explícita) ou a interação (implícita) de um usuário com um item.

Duas vertentes principais se destacam. A filtragem colaborativa baseada em usuários busca vizinhos semelhantes ao usuário-alvo; a baseada em itens, proposta por Sarwar et al. (2001) e popularizada pela Amazon (LINDEN; SMITH; YORK, 2003), calcula similaridades entre itens e mostrou-se mais escalável. Mais recentemente, técnicas de **fatoração de matrizes** (*matrix factorization*) tornaram-se o padrão da indústria após o Prêmio Netflix, ao decompor a matriz usuário-item em fatores latentes que capturam preferências não observáveis diretamente (KOREN; BELL; VOLINSKY, 2009).

O ponto crítico — e diretamente relevante para este trabalho — é que toda filtragem colaborativa pressupõe uma matriz usuário-item suficientemente **densa**. Quando há poucos usuários, poucos itens avaliados por usuário, ou ausência completa de avaliações, a similaridade entre usuários ou itens torna-se estatisticamente frágil ou impossível de calcular (SARWAR et al., 2001). É precisamente essa a condição do cenário B2B de baixo volume investigado nesta monografia.

### 2.1.3 Filtragem baseada em conteúdo

A filtragem baseada em conteúdo (*content-based filtering*) recomenda itens semelhantes àqueles que o usuário apreciou no passado, apoiando-se nos **atributos dos próprios itens** — categoria, marca, descrição textual, características técnicas (ADOMAVICIUS; TUZHILIN, 2005). Constrói-se um perfil do usuário a partir dos atributos dos itens com os quais ele interagiu e recomendam-se novos itens cujo conteúdo seja próximo a esse perfil.

Essa abordagem dispensa dados de outros usuários, o que a torna resistente à esparsidade interusuário. Em contrapartida, tende à **superespecialização**: recomenda apenas o "mais do mesmo", limitando a descoberta de itens complementares de categorias distintas — justamente o tipo de associação que interessa ao *cross-sell* (AGGARWAL, 2016). Além disso, exige uma representação rica e estruturada dos atributos dos produtos, nem sempre disponível em catálogos de pequenas distribuidoras.

### 2.1.4 Abordagens híbridas

Os métodos híbridos combinam duas ou mais técnicas para mitigar as limitações individuais de cada uma — por exemplo, usando conteúdo para contornar o *cold start* da filtragem colaborativa (ADOMAVICIUS; TUZHILIN, 2005; RICCI; ROKACH; SHAPIRA, 2015). Embora frequentemente alcancem desempenho superior, ampliam a complexidade de implementação e os requisitos de dados, o que os torna pouco adequados ao escopo deste trabalho. Registra-se, ainda, que as regras de associação — núcleo desta monografia — constituem uma abordagem distinta das três anteriores: não dependem de perfis de usuário individuais, mas de padrões de coocorrência no conjunto das transações (AGGARWAL, 2016).

## 2.2 Regras de associação (Market Basket Analysis)

### 2.2.1 Conceito e itemsets

As regras de associação foram introduzidas por Agrawal, Imieliński e Swami (1993) com o propósito de descobrir relações entre itens em grandes bases de dados transacionais — problema popularizado sob o nome de *Market Basket Analysis* (análise da cesta de compras). A questão original era direta: quais produtos os clientes de um supermercado tendem a comprar em conjunto?

Formalmente, seja $I = \{i_1, i_2, \ldots, i_m\}$ um conjunto de itens e $D$ um conjunto de transações, em que cada transação $T$ é um subconjunto de itens, $T \subseteq I$. Um **itemset** é qualquer conjunto de itens; um itemset com $k$ elementos é chamado *k-itemset*. Uma **regra de associação** é uma implicação da forma $X \Rightarrow Y$, em que $X \subset I$, $Y \subset I$ e $X \cap Y = \emptyset$. O itemset $X$ é o **antecedente** e $Y$, o **consequente** da regra (AGRAWAL; IMIELIŃSKI; SWAMI, 1993). Lê-se: "transações que contêm $X$ tendem a conter também $Y$" — por exemplo, $\{\text{Leite}\} \Rightarrow \{\text{Pão}\}$.

### 2.2.2 Algoritmo Apriori

O número de itemsets candidatos cresce exponencialmente com a quantidade de itens, tornando inviável a contagem por força bruta. O algoritmo **Apriori**, proposto por Agrawal e Srikant (1994), resolve esse problema explorando uma propriedade de antimonotonicidade conhecida como **princípio Apriori**: *se um itemset é frequente, todos os seus subconjuntos também o são; inversamente, se um itemset é infrequente, todos os seus superconjuntos também serão infrequentes*.

Esse princípio permite **podar** o espaço de busca: tão logo um itemset não atinja o suporte mínimo, todas as suas extensões podem ser descartadas sem contagem. O algoritmo procede iterativamente (TAN; STEINBACH; KUMAR, 2005; HAN; KAMBER; PEI, 2011):

1. **Definir os limiares** de suporte mínimo e confiança mínima.
2. **Encontrar itemsets frequentes**: inicia-se com itens individuais, calculando seu suporte; a seguir combinam-se pares, trios e assim por diante, mantendo apenas os itemsets que superam o suporte mínimo.
3. **Gerar regras**: a partir dos itemsets frequentes, derivam-se regras $X \Rightarrow Y$.
4. **Avaliar as regras** pelas métricas de suporte, confiança e *lift*, retendo apenas as que excedem os limiares definidos.

O resultado é um conjunto de **regras fortes**, que revelam padrões de compra úteis e descartam combinações fracas ou triviais. O Apriori tornou-se o algoritmo mais citado da área, tendo recebido o *VLDB 10-Year Award* em 2004 pelo seu impacto duradouro.

Apesar de sua eficiência relativa, o Apriori realiza múltiplas varreduras da base e gera grande número de candidatos. Han, Pei e Yin (2000) propuseram o **FP-Growth**, que minera padrões frequentes sem geração de candidatos, por meio de uma estrutura compacta em árvore (*FP-tree*), alcançando desempenho até uma ordem de grandeza superior. Para o conjunto de dados reduzido deste trabalho, contudo, a eficiência assintótica não é restritiva — discussão retomada no Capítulo 4, ao justificar a estratégia de extração par-a-par adotada.

### 2.2.3 Métricas: support, confidence e lift

Três métricas quantificam a relevância de uma regra de associação (AGRAWAL; IMIELIŃSKI; SWAMI, 1993; HAHSLER; GRÜN; HORNIK, 2005).

**Suporte (*support*)** mede a frequência com que o itemset aparece no conjunto de transações. Para uma regra $X \Rightarrow Y$:

$$
\text{support}(X \Rightarrow Y) = \frac{|\{T \in D : X \cup Y \subseteq T\}|}{|D|}
$$

Indica o quão comum é a combinação. Um suporte de 20% significa que 20% de todas as transações contêm, simultaneamente, $X$ e $Y$.

**Confiança (*confidence*)** mede a probabilidade condicional de o consequente ocorrer dado que o antecedente ocorreu:

$$
\text{confidence}(X \Rightarrow Y) = \frac{\text{support}(X \cup Y)}{\text{support}(X)} = P(Y \mid X)
$$

Uma confiança de 70% para $\{\text{Leite}\} \Rightarrow \{\text{Pão}\}$ indica que, entre as transações que contêm leite, 70% também contêm pão.

**Lift (elevação)** mede a força da associação em relação ao que se esperaria caso $X$ e $Y$ fossem independentes:

$$
\text{lift}(X \Rightarrow Y) = \frac{\text{confidence}(X \Rightarrow Y)}{\text{support}(Y)} = \frac{P(X \cap Y)}{P(X)\,P(Y)}
$$

A interpretação do *lift* é decisiva para distinguir associações úteis de coincidências (BRIN et al., 1997):

- $\text{lift} = 1$: $X$ e $Y$ são independentes — a coocorrência é fruto do acaso;
- $\text{lift} > 1$: associação **positiva** — a presença de $X$ aumenta a probabilidade de $Y$;
- $\text{lift} < 1$: associação **negativa** — a presença de $X$ reduz a probabilidade de $Y$.

A confiança, isoladamente, pode enganar: um consequente muito popular gera alta confiança mesmo sem relação real com o antecedente. O *lift* corrige esse viés ao normalizar pela popularidade do consequente, razão pela qual é adotado como critério de ranqueamento neste trabalho.

## 2.3 O problema do *cold start* e da esparsidade

O *cold start* designa a incapacidade de um sistema de recomendação gerar sugestões confiáveis quando há informação insuficiente — sobre um novo usuário, um novo item, ou todo um sistema recém-implantado (ADOMAVICIUS; TUZHILIN, 2005). É um problema endêmico da filtragem colaborativa: sem histórico de avaliações, não há base para calcular similaridades.

A **esparsidade** é fenômeno correlato e ainda mais estrutural. Em sistemas reais, a matriz usuário-item costuma ser preenchida em fração mínima — cada usuário interage com pequena parcela do catálogo —, o que enfraquece as estimativas de similaridade (SARWAR et al., 2001). Em cenários B2B de baixo volume, a esparsidade atinge nível extremo: poucos clientes, ausência de avaliações e dezenas — não milhões — de transações.

É nesse ponto que as regras de associação revelam sua vantagem. Por operarem sobre os padrões de coocorrência do **conjunto** das transações, e não sobre perfis individuais de usuário, dispensam a matriz usuário-item densa e contornam parcela significativa do problema de esparsidade interusuário (AGGARWAL, 2016). Essa característica fundamenta a escolha metodológica central desta monografia, detalhada no Capítulo 3.

## 2.4 Comércio B2B e venda casada (cross-sell)

O comércio *business-to-business* (B2B) caracteriza-se por transações entre empresas — no caso deste trabalho, entre uma distribuidora e barbearias clientes. Distingue-se do B2C por relacionamentos de longo prazo, número reduzido de clientes, compras recorrentes e ausência das avaliações de produto típicas do varejo eletrônico.

A **venda casada** ou *cross-sell* consiste em sugerir, no momento da compra, produtos complementares àquele que o cliente já adquire (SCHAFER; KONSTAN; RIEDL, 2001). É exatamente o tipo de recomendação que as regras de associação produzem: a descoberta de que clientes que compram o produto $X$ tendem a comprar também $Y$ traduz-se diretamente em uma sugestão de *cross-sell*. Linden, Smith e York (2003) demonstraram, no contexto da Amazon, o impacto econômico dessa estratégia no varejo de massa; este trabalho investiga sua transposição para o B2B de pequeno porte, onde o conhecimento sobre quais produtos vendem juntos hoje reside apenas na intuição da equipe de vendas.

## 2.5 Métricas de avaliação: Precision, Recall e F1-Score

Para além das métricas internas das regras (suporte, confiança, *lift*), é necessário avaliar a **qualidade preditiva** das recomendações geradas. Adotam-se, para tanto, as métricas clássicas de recuperação de informação, formalizadas por Powers (2011).

Dado um conjunto de recomendações, classificam-se os resultados em verdadeiros positivos (VP — recomendações corretas), falsos positivos (FP — recomendações incorretas) e falsos negativos (FN — itens relevantes não recomendados). Define-se:

$$
\text{Precision} = \frac{VP}{VP + FP}
\qquad
\text{Recall} = \frac{VP}{VP + FN}
$$

A **Precision** (precisão) responde: das recomendações feitas, quantas estavam corretas? O **Recall** (revocação) responde: dos itens que deveriam ser recomendados, quantos o sistema acertou? Há tensão entre as duas: maximizar uma tende a degradar a outra.

O **F1-Score** equilibra ambas por meio da média harmônica:

$$
\text{F1} = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}
$$

A média harmônica penaliza desequilíbrios: o F1 só é alto quando Precision e Recall são, ambos, razoavelmente altos. Powers (2011) alerta, contudo, que essas métricas devem ser interpretadas à luz do tamanho e da composição do conjunto de teste — ressalva especialmente pertinente a este trabalho, cujo conjunto de validação é reduzido e contém poucas transações multi-item, conforme discutido no Capítulo 5.

## 2.6 Trabalhos relacionados

A aplicação de regras de associação a dados transacionais de varejo possui tradição consolidada na literatura nacional e internacional. Schonhorst (2010) aplicou mineração de regras de associação à modelagem de dados transacionais de um supermercado brasileiro, demonstrando a viabilidade da técnica para descoberta de padrões de compra em varejo de médio porte — paralelo metodológico direto com o presente trabalho, ainda que em contexto B2C.

Mais recentemente, Moraes (2023) aplicou *Market Basket Analysis* a um sistema de recomendação adaptável para canal digital e lojas físicas de uma grande rede varejista, em cenário de *Big Data* com processamento distribuído. O trabalho reporta Precision de 22,53% no canal digital e 31,28% nas lojas físicas (dezembro de 2023). Esses resultados oferecem um **contraponto de escala** elucidativo: enquanto Moraes (2023) endereça os desafios de volume massivo de dados, esta monografia investiga o extremo oposto — a aplicação de MBA sob esparsidade severa, em um B2B de baixo volume. A comparação também contextualiza as métricas próprias: valores moderados de Precision são resultado esperado na literatura de MBA, **mesmo diante de dados abundantes**, o que ajuda a calibrar as expectativas sobre o desempenho do sistema proposto (discussão retomada na Seção 5.4).

No plano internacional, Schafer, Konstan e Riedl (2001) sistematizam as aplicações de recomendação em comércio eletrônico, situando o *cross-sell* baseado em coocorrência entre as estratégias clássicas, ao passo que Linden, Smith e York (2003) documentam o caso emblemático da Amazon. O conjunto desses trabalhos evidencia a maturidade da técnica em cenários de grande volume e, por contraste, expõe a lacuna que esta monografia se propõe a investigar: o desempenho das regras de associação em distribuição B2B de baixo volume — recorte ainda pouco explorado na literatura.
