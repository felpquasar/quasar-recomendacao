# Roteiro de apresentação da defesa

Sistema de Recomendação B2B com Regras de Associação — Quasar Barber
Felipe Pereira · 18 slides · tempo alvo ~15 min

Como usar: o que está entre aspas é fala. O resto são deixas. Não leia palavra por palavra, fale olhando para a banca. Os tempos são guia, não cronômetro rígido.

---

## Slide 1 — Capa (~30s)

"Bom dia. Meu nome é Felipe Pereira e vou apresentar meu trabalho de conclusão de curso: um sistema de recomendação de produtos para distribuição B2B usando regras de associação. O estudo de caso é a Quasar Barber, uma distribuidora de produtos de barbearia que eu mesmo administro, em Codó, no Maranhão."

Deixa: respire, não comece correndo. Olhe para a banca antes de avançar.

---

## Slide 2 — Roteiro (~30s)

"Para começar, este é o caminho que vou seguir. Primeiro o contexto e o problema. Depois a pergunta de pesquisa, a hipótese e os objetivos. Passo rápido pela fundamentação, falo da metodologia e dos dados reais, mostro a arquitetura do sistema, explico como validei, apresento os resultados e fecho com a conclusão e o que dá para fazer adiante."

Deixa: não detalhe cada item, é só o mapa. Avance.

---

## Slide 3 — Contexto e problema (~70s)

"A Quasar Barber é uma distribuidora pequena. Catálogo grande, mas poucos clientes. E aí mora o problema: a decisão de oferecer um produto junto com outro, a venda casada, é tomada no feeling do vendedor. Quem lembra, sugere. Quem não lembra, deixa de vender."

"Esse cenário B2B é bem diferente do varejo que a gente conhece, tipo Amazon ou Netflix. Lá tem milhões de clientes e nota de produto. Aqui não. São poucos clientes, volume baixo e nenhuma avaliação. A matriz de cliente por produto fica vazia na maior parte. Isso derruba a filtragem colaborativa, que é a técnica mais comum de recomendação, porque ela precisa de muita gente avaliando muito item."

"A oportunidade é olhar para o que eu já tenho: o histórico de vendas. Dá para minerar esse histórico e descobrir quais produtos costumam sair juntos."

Deixa: este slide vende o problema. Fale com convicção, é a sua empresa.

---

## Slide 4 — Pergunta de pesquisa e hipótese (~60s)

"A pergunta que guia tudo está nessa caixa: é possível gerar recomendações úteis e estatisticamente relevantes para uma distribuidora pequena usando só regras de associação, mesmo com poucas transações?"

"A minha hipótese, a H1, é que sim. Regras com confiança a partir de 0,30 e suporte a partir de 0,02, ordenadas por lift, produzem sugestões de venda casada que fazem sentido para o negócio. A hipótese nula, a H0, é o contrário: que as regras seriam indistinguíveis do acaso e não passariam de um simples ranking dos produtos mais vendidos."

Deixa: leia a pergunta com calma, é o coração do trabalho. Guarde os termos confiança, suporte e lift, eles voltam no próximo bloco.

---

## Slide 5 — Objetivos (~45s)

"O objetivo geral foi desenvolver e validar um sistema de recomendação baseado em Market Basket Analysis, com relevância estatística que dá para medir."

"Para chegar lá, foram seis objetivos específicos: revisar a literatura, modelar a base de dados, implementar a extração de regras numa API, construir a interface web, validar com as métricas e, por fim, analisar as regras do ponto de vista comercial."

Deixa: não leia os seis um por um devagar. Agrupe: "da teoria até a análise de negócio". Avance.

---

## Slide 6 — Justificativa (~45s)

"A justificativa tem três lados. No lado acadêmico, quase tudo que se estuda é B2C de grande volume. B2B esparso é uma lacuna, e é justo onde a filtragem colaborativa não funciona. No lado prático, é uma empresa real, com uma dor real, e o sistema ajuda a equipe a vender com base em dado, não em memória. E no lado técnico, é uma arquitetura completa, reproduzível e barata, que cabe numa empresa pequena sem nenhuma estrutura de Big Data."

Deixa: este é o argumento de relevância. A banca gosta de ver o "por que importa".

---

## Slide 7 — Regras de associação (~70s)

"Entrando na teoria de forma bem direta. Cada pedido é uma cesta de compras. O que eu procuro é um padrão do tipo: quem compra A tende a comprar B. E eu meço isso com três números."

"O suporte é o quão comum o par é no total de vendas. Serve para descartar coisa muito rara. A confiança responde: dado que o cliente comprou A, qual a chance de ele levar B também. É a força da regra. E o lift compara o que aconteceu com o que aconteceria por acaso. Lift acima de 1 quer dizer que existe associação de verdade, não foi coincidência."

Deixa: aponte para cada card ao falar. Estes três conceitos são a base de tudo que vem depois.

---

## Slide 8 — Por que regras de associação (~50s)

"Por que essa técnica e não outra. A filtragem colaborativa precisa de uma matriz cheia de clientes e avaliações, e isso simplesmente não existe aqui. Os problemas de cold start e de esparsidade, que em outros cenários são exceção, no meu caso são a regra."

"As regras de associação trabalham direto na coocorrência dentro das transações. Não precisam de nota nem de muita gente. O resultado é interpretável, o vendedor entende. E o custo de processar é baixo no volume que eu tenho. Some a isso a lacuna acadêmica, já que quase todo estudo foca em grande volume, e a escolha se justifica."

Deixa: este slide conversa com o slide 3. É o fechamento do "por que essa abordagem".

---

## Slide 9 — Metodologia e dados reais (~70s)

"Sobre o método: é uma pesquisa aplicada, quantitativa, um estudo de caso único. O método de condução foi o Design Science Research, que basicamente diz: você constrói um artefato e avalia esse artefato. Foi o que fiz."

"E são dados reais, não simulados. São as vendas da Quasar Barber entre 29 de abril e 18 de junho de 2026. Olhem os números: 30 transações, 26 clientes, 29 produtos, 52 itens vendidos. E o número que mais importa: só 14 cestas têm dois ou mais produtos. São essas 14 que geram regra. As outras 16 são compra de um item só."

"Eu quero ser honesto com a banca aqui: essa esparsidade não é um defeito do meu recorte, é a cara do B2B pequeno. O trabalho todo é sobre fazer recomendação funcionar nessa condição difícil."

Deixa: pause nos números, deixe a banca ler. O "14 multi-item" é o gancho para entender as limitações depois.

---

## Slide 10 — Arquitetura do sistema (~60s)

"Esta é a arquitetura, em camadas. Na frente, a interface em React, onde o usuário busca um produto e vê as recomendações. Essa interface conversa com uma API REST em Node com Express. A API tem a camada de serviço, que é onde roda o algoritmo de regras e a geração do Top-N, com um cache opcional em Redis para acelerar consultas repetidas. E no fim, o banco no Supabase, que é PostgreSQL, guardando clientes, produtos, vendas e itens."

"O ponto que eu destaco é que tudo isso usa ferramenta gratuita ou de baixo custo. Roda numa máquina modesta."

Deixa: percorra o diagrama com a mão, de cima para baixo ou da frente para o banco. Não decore nome de biblioteca, conte o fluxo.

---

## Slide 11 — Protocolo de validação (~75s)

"Antes dos resultados, preciso explicar como eu validei, porque essa foi uma decisão importante do trabalho."

"A primeira ideia seria separar 80% para treino e 20% para teste. Eu testei e descartei. Com 30 transações, esse teste sobra com só 3 cestas avaliáveis. Tirar conclusão de 3 casos é instável, não dá."

"Então adotei a validação cruzada Leave-One-Out, a LOOCV. A ideia é girar por todas as transações: a cada rodada eu treino com todas menos uma e testo naquela que sobrou. Assim eu aproveito todos os dados. O esquema é esconder um item: eu tiro um produto da cesta e vejo se o sistema consegue trazer ele de volta nas três recomendações."

"E tem um detalhe que muda a leitura dos números. Como eu escondo só um produto e o sistema sugere até três, a precisão máxima possível já é um terço, mais ou menos 0,33. Por isso, neste trabalho, o Recall e o F1 são os indicadores que mais dizem alguma coisa."

Deixa: este é o slide mais técnico. Vá devagar. Se a banca for cobrar metodologia, é aqui que você mostra rigor. O teto de 0,33 antecipa a defesa da precisão baixa no próximo slide.

---

## Slide 12 — Resultados: regras descobertas (~70s)

"Agora os resultados. O algoritmo gerou 44 regras. A confiança média ficou em 76,51% e o lift médio em 12,41, ou seja, bem acima de 1."

"Na tabela estão as regras de maior lift. Por exemplo, quem compra o After Shave da QOD levou junto o Café Verde Shampoo da mesma marca, com confiança de 100%. O mesmo padrão aparece na linha Fox for Men, com shampoo e óleo de barba saindo juntos."

"E aqui eu faço uma ressalva honesta, que está embaixo da tabela: o lift mais alto costuma cair justamente nos pares mais raros, os de suporte baixo. Por isso eu nunca leio o lift sozinho, leio sempre junto com o conhecimento do negócio. À direita está o painel real do sistema, funcionando sobre esses dados."

Deixa: mostre a tabela e depois aponte o print do dashboard à direita, prova de que o sistema existe e roda.

---

## Slide 13 — Resultados: validação LOOCV (~70s)

"Estes são os números da validação. Precisão de 26,39%, Recall de 44,44% e F1 de 31,94%."

"A precisão parece baixa, mas lembrem do teto: o máximo possível era 0,33, e eu cheguei perto disso. Então não é erro de 73%, é consequência do desenho do teste. O número que eu peço para vocês olharem é o Recall. 44,44% quer dizer que, em 16 de 36 sub-testes, o sistema recolocou na cesta exatamente o produto que eu tinha escondido. Quase metade das vezes ele completou a compra certa, sem ter nenhuma nota de produto, só pela coocorrência."

"E para comparar: aquele teste 80/20 que eu descartei dava 22,22% em cima de 3 casos. A LOOCV é mais robusta porque percorre tudo e acumula 36 sub-testes."

Deixa: aponte cada métrica nos cards. Defenda a precisão com calma, não como desculpa. O Recall é a sua vitória, fale com firmeza.

---

## Slide 14 — Aderência ao domínio e hipótese (~65s)

"Número não basta, a regra tem que fazer sentido para quem conhece o negócio, que nesse caso sou eu. E faz. As regras de maior lift batem com a prática: a rotina de barba, shampoo com óleo, bálsamo e pós-barba saindo juntos. A coerência de marca, com as linhas QOD e Fox for Men. E os acessórios de função parecida comprados na mesma cesta."

"Juntando tudo, eu não rejeito a H1. O lift médio de 12,41 está muito acima de 1, o que afasta o acaso. E os pares de maior lift não são os produtos mais vendidos, então eles carregam informação além da simples frequência. Isso é exatamente o que contraria a H0, a ideia de que bastaria recomendar os campeões de venda."

Deixa: este slide amarra resultado com hipótese. Leia a caixa azul com ênfase no "H1 não rejeitada".

---

## Slide 15 — Conclusão (~55s)

"Respondendo a pergunta lá do começo: sim, dá para gerar recomendação relevante em B2B de baixo volume só com regras de associação, com uma ressalva de escala que eu faço questão de manter."

"As contribuições foram três. Um artefato completo e reproduzível, barato, rodando sobre dado real. Uma contribuição de método, a LOOCV com a leitura honesta do teto da precisão. E o entendimento de que essas recomendações são apoio à decisão do vendedor, não uma ordem automática."

Deixa: tom de fechamento. Mais devagar, mais firme. Você está consolidando.

---

## Slide 16 — Trabalhos futuros (~45s)

"O próprio recorte aponta a continuação. Primeiro, mais dados: com histórico maior, as métricas ficam mais estáveis. Segundo, implementar o Apriori ou o FP-Growth completos, para capturar regras com três ou mais produtos juntos. Terceiro, colocar em produção, com a recomendação chegando na hora do pedido. E quarto, fechar o ciclo com um teste A/B, medindo o efeito real no ticket médio."

Deixa: rápido e otimista, mas sem floreio. Mostra que você sabe o tamanho real do que fez e o que vem depois.

---

## Slide 17 — Referências principais (~30s)

"Essas são as referências centrais do trabalho. Os artigos do Agrawal, que fundam as regras de associação e o Apriori, o Han com o FP-Growth, o Adomavicius na taxonomia de recomendação, e o Powers na parte de métricas. A lista completa, com as 23 referências, está no capítulo de Referências da monografia."

Deixa: não leia referência por referência. Cite duas ou três e siga. Slide de apoio.

---

## Slide 18 — Encerramento (~20s)

"Era isso. Obrigado pela atenção. Fico à disposição da banca para as perguntas."

Deixa: pare, respire, sorria. Não saia correndo do slide. Espere a banca.

---

## Perguntas prováveis da banca (prepare antes)

- Por que não testou um baseline de popularidade de fato, com número? Resposta: o argumento está na não coincidência entre pares de maior lift e produtos mais vendidos. Reconheça que medir o baseline lado a lado é um próximo passo.
- 30 transações não é pouco demais para concluir? Resposta: sim, por isso a conclusão é de viabilidade no recorte, não de generalização. A LOOCV foi a resposta metodológica para o tamanho pequeno.
- Por que par a par e não Apriori completo? Resposta: decisão consciente pelo volume atual (Cap 4.9). Apriori e FP-Growth completos estão nos trabalhos futuros.
- O lift alto não é artefato do suporte baixo? Resposta: sim, eu registro isso de forma explícita, e por isso leio o lift junto com suporte e domínio.
- Qual o ganho real para a empresa? Resposta: apoio à venda casada hoje, e o teste A/B de ticket médio mediria o ganho em número.

## Lembretes de ensaio

- Cronometrar pelo menos uma vez. Alvo 15 min, teto provável da banca por volta de 20.
- Slides 9, 11 e 13 são os de maior peso técnico. Ensaie esses até sair natural.
- Antes de imprimir ou exportar, preencher na capa: instituição e nome do orientador.
