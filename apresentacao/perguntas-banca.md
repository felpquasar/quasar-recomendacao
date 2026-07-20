# Banco de perguntas e respostas para a defesa

Sistema de Recomendação B2B com Regras de Associação — Quasar Barber
Felipe Pereira · material de preparação para a arguição

Como usar: para cada pergunta tem uma resposta curta (o que falar na hora) e, quando vale a pena, uma nota com o detalhe de reserva caso a banca puxe mais. Não decore. Entenda o raciocínio e fale com suas palavras. Se não souber algo, seja honesto e mostre por onde investigaria.

---

## 1. Problema, motivação e escopo

**Por que escolheu esse tema?**
É a minha empresa. A Quasar Barber decide venda casada no feeling do vendedor, e eu queria ver se dava para apoiar isso com dado. Junta uma dor real com uma lacuna acadêmica, já que quase tudo na literatura é B2C de grande volume.

**Qual exatamente é o problema de pesquisa?**
Saber se regras de associação, sozinhas, conseguem gerar recomendação útil e estatisticamente relevante num B2B pequeno, mesmo com poucas transações. O foco está nessa condição difícil: pouco dado, sem nota de produto, poucos clientes.

**Por que B2B e não B2C?**
No B2C você tem muito cliente e muita avaliação, então a filtragem colaborativa funciona. No B2B pequeno é o oposto. É justo o cenário onde as técnicas populares falham, e é aí que está a contribuição.

**O escopo não ficou pequeno demais?**
O escopo é proposital. Eu delimitei para uma técnica, regras de associação, num caso real, para responder uma pergunta específica com profundidade. Ampliar para deep learning ou tempo real fugiria do que dá para validar com honestidade nesse volume de dado.

---

## 2. Fundamentação teórica

**O que é uma regra de associação, em uma frase?**
É um padrão do tipo "quem compra A tende a comprar B", extraído da coocorrência de itens nas transações.

**Diferença entre suporte, confiança e lift.**
Suporte é a frequência do par no total, mede o quão comum ele é. Confiança é a probabilidade de B dado A, mede a força da regra. Lift compara o observado com o esperado por acaso. Lift acima de 1 indica associação real.

**O que é o algoritmo Apriori?**
É o algoritmo clássico de mineração de itemsets frequentes. A ideia central é a propriedade de antimonotonicidade: se um conjunto não atinge o suporte mínimo, nenhum superconjunto dele atinge também, então dá para podar a busca cedo.

**Você usou Apriori completo?**
Não. Eu implementei a extração par a par, regra de um item para um item. Foi decisão consciente pelo volume atual de dados. Com 14 cestas multi-item, itemsets de três ou mais produtos quase não aparecem com suporte relevante. Apriori e FP-Growth completos ficaram como trabalho futuro.

**Por que regras de associação e não filtragem colaborativa?**
Filtragem colaborativa precisa de matriz cliente por produto densa, com muita avaliação. Aqui isso não existe. Regras de associação trabalham direto na coocorrência das cestas, não precisam de nota nem de muitos clientes, e o resultado é interpretável pelo vendedor.

**O que é cold start e como ele aparece aqui?**
Cold start é quando o sistema não tem informação suficiente para recomendar, num cliente novo, item novo ou sistema novo. No meu caso a esparsidade é estrutural, então o problema é constante. As regras contornam parte disso porque olham o conjunto das transações, não o perfil individual.

---

## 3. Metodologia

**Qual o método científico do trabalho?**
Pesquisa aplicada, quantitativa, estudo de caso único. A condução seguiu o Design Science Research, que organiza o trabalho em torno de construir um artefato e avaliar esse artefato.

**Por que Design Science Research e não outra abordagem?**
Porque o coração do trabalho é um artefato de software que resolve um problema real. O DSR é feito exatamente para isso: identificar o problema, projetar a solução, demonstrar e avaliar. Encaixa melhor que um survey ou um experimento puro.

**De onde vieram os dados?**
São vendas reais da Quasar Barber, exportadas do sistema de pedidos, do período de 29 de abril a 18 de junho de 2026. Não tem dado simulado.

**Como foi o pré-processamento?**
Cada linha do arquivo bruto é um item de pedido. Eu agrupei pelo número do pedido para formar a cesta, limpei e padronizei os nomes de produto e organizei tudo em transações. É a estrutura que a Market Basket Analysis exige.

**Os parâmetros 0,30 de confiança e 0,02 de suporte, de onde saíram?**
São limiares baixos, escolhidos de propósito pela esparsidade. Suporte muito alto zeraria as regras nesse volume. O 0,30 de confiança garante que a regra tem alguma força preditiva sem ser exigente demais para o tamanho da base. Eu reconheço que com mais dado esses cortes devem ser reavaliados.

---

## 4. Validação (parte mais cobrada)

**Por que LOOCV e não o split 80/20?**
Porque testei o 80/20 e ele deixa só 3 cestas avaliáveis no teste. Concluir a partir de 3 casos é instável. A LOOCV percorre todas as transações, treina com todas menos uma e testa naquela, então aproveita todo o dado e dá uma medida mais estável.

**Explique o esquema de esconder um item.**
Em cada cesta multi-item eu oculto um produto e deixo o resto. O sistema gera as recomendações a partir do que sobrou, e eu verifico se o produto escondido aparece no Top-3. Se aparece, o sistema "completou a cesta" corretamente.

**Por que a precisão é tão baixa, 26%?**
Não é baixa, é o teto do desenho. Como eu escondo um único produto e recomendo até três, o máximo de precisão possível num acerto já é um terço, perto de 0,33. Eu cheguei a 0,2639, ou seja, perto do limite teórico. Por isso eu privilegio o Recall e o F1 na leitura.

**Então a métrica de precisão não serve para nada?**
Serve, mas tem que ser lida com o teto em mente. Ela mostra que, dentro do que o desenho permite, o sistema está perto do máximo. O que ela não pode é ser comparada cruamente com estudos que usam outro protocolo.

**O que o Recall de 44% significa na prática?**
Em 16 de 36 sub-testes o sistema recolocou exatamente o produto que eu tinha escondido. Quase metade das vezes ele acertou o complemento da compra, só pela coocorrência, sem nota de produto. Para esse volume, é um resultado forte.

**LOOCV não tende a superestimar o desempenho com pouco dado?**
LOOCV tem variância maior que k-fold em alguns casos, sim. Mas com 30 transações o problema maior é o oposto: qualquer split fixo desperdiça dado e fica instável. A LOOCV foi a escolha que extrai o máximo de informação do que eu tenho, e eu reporto os números de forma transparente, sem inflar.

---

## 5. Resultados

**Quantas regras e quais os números globais?**
44 regras. Confiança média de 76,51%, suporte médio de 4,39% e lift médio de 12,41.

**O lift de 30 não é alto demais para ser real?**
É alto justamente porque o suporte do consequente é baixo. Numa regra com confiança 1, o lift é igual a 1 sobre o suporte de B. Quando B aparece em pouquíssimas cestas, o lift dispara por construção. Eu registro isso de forma explícita e leio o lift sempre junto com o suporte e com o conhecimento do negócio.

**Como você sabe que as regras fazem sentido e não são coincidência?**
Por dois caminhos. O quantitativo, com lift médio bem acima de 1, que afasta o acaso. E o qualitativo: como dono da distribuidora, eu reconheço os padrões. Rotina de barba com shampoo, óleo e bálsamo juntos, coerência por marca nas linhas QOD e Fox for Men. São compras que um vendedor experiente faria.

**Você comparou com um baseline de popularidade?**
Não medi o baseline lado a lado com número, e isso é uma limitação que eu assumo. O argumento que eu trago é que os pares de maior lift não coincidem com os produtos mais vendidos. Se bastasse recomendar os campeões de venda, esses pares específicos não apareceriam. Medir o baseline de forma direta é um próximo passo claro.

---

## 6. Hipótese

**Você confirmou ou rejeitou a hipótese?**
Eu não rejeito a H1. O lift afasta o acaso e as regras aderem ao domínio. E há evidência contra a H0, porque as regras carregam informação além da simples frequência de venda.

**Não confirmar não é o mesmo que provar. Você tem cuidado com isso?**
Tenho, e por isso falo em "não rejeitar", não em "provar". É evidência a favor no recorte estudado, com 14 cestas avaliáveis. Demonstra viabilidade, não generalização estatística ampla.

---

## 7. Limitações

**A maior limitação do trabalho?**
O volume de dado. São 30 transações, só 14 multi-item. Isso restringe o número de regras, deixa as métricas sensíveis a casos isolados e infla o lift dos pares raros. É realista para o porte da empresa, mas limita a generalização.

**Como você lidou com essas limitações?**
Não escondi nenhuma. Escolhi a LOOCV por causa do tamanho, expliquei o teto da precisão, registrei o efeito do suporte baixo no lift e deixei claro que a recomendação é apoio à decisão, não prescrição automática.

**O resultado se sustenta com mais dado?**
A expectativa é que sim, e que melhore. Com histórico maior, o suporte das regras fica mais sólido e as métricas mais estáveis. Mas isso é hipótese para validar quando o dado crescer, não uma promessa.

---

## 8. Sistema e arquitetura (técnico)

**Descreva a arquitetura.**
Interface em React na frente. Ela chama uma API REST em Node com Express. A API tem a camada de serviço com o algoritmo de regras e a geração do Top-N, mais um cache opcional em Redis. O banco é PostgreSQL no Supabase, guardando clientes, produtos, vendas e itens.

**Por que essa stack?**
Por custo e reprodutibilidade. Tudo gratuito ou barato, rodando em máquina modesta. O objetivo é uma arquitetura viável para empresa pequena, sem estrutura de Big Data.

**Por que o cache é opcional?**
Porque o sistema funciona sem ele. O Redis acelera consultas repetidas, mas se ele cair a aplicação continua respondendo, indo direto ao cálculo. É uma degradação graciosa, não uma dependência rígida.

**O sistema está em produção?**
Ainda não. Ele roda sobre os dados reais e está demonstrado, mas a colocação no fluxo de venda do dia a dia é trabalho futuro, junto com o teste A/B de ticket médio.

**Tem testes?**
Sim, o desenvolvimento incluiu testes, inclusive de integração, com boa cobertura. Isso dá confiança de que o algoritmo e a API se comportam como o esperado.

**Como garante que o cálculo das métricas está correto?**
Os números do trabalho não foram digitados à mão. Eles saem do algoritmo rodando sobre o CSV real e do arquivo de métricas de validação gerado pelo próprio sistema. Dá para reproduzir.

---

## 9. Negócio e aplicação

**Qual o ganho real para a empresa?**
Hoje, apoiar a venda casada com base em dado em vez de memória. O vendedor recebe sugestões coerentes na hora de montar o pedido. O ganho em número, no ticket médio, seria medido pelo teste A/B previsto.

**Como o vendedor usaria isso no dia a dia?**
Ele consulta um produto e o sistema mostra os complementos mais prováveis. A ideia é que isso entre no momento do pedido. Por enquanto é consulta pela interface web.

**E se a recomendação estiver errada?**
Por isso eu trato como apoio à decisão, não como ordem. O vendedor continua decidindo. A baixa frequência de algumas coocorrências reforça que é sugestão, não regra fixa.

---

## 10. Escrita, referências e ABNT

**Quantas referências e de que tipo?**
São 23 referências, sendo a maioria artigos revisados por pares, mais os livros-texto canônicos da área e duas fontes nacionais. Os clássicos do tema estão todos: Agrawal, Han, Adomavicius, Sarwar.

**Você verificou se as referências existem mesmo?**
Sim, conferi. As duas fontes nacionais, Schonhorst e Moraes, foram localizadas nos repositórios das universidades. Inclusive corrigi a paginação de uma referência, a do Sarwar de 2001, depois de checar na fonte.

**Por que não citou dados numéricos de uma das dissertações?**
Porque não consegui confirmar aqueles números específicos na fonte original. Preferi não trazer dado que eu não pudesse verificar, para não correr risco de citação imprecisa. Mantive a referência só na parte que confirmei.

---

## 11. Perguntas difíceis e pegadinhas

**Se eu te der um dataset grande amanhã, seu trabalho ainda vale?**
Vale como ponto de partida e como método. A pergunta dele é exatamente sobre o cenário pequeno. Com dado grande, o caminho natural é o que eu já aponto: Apriori ou FP-Growth completos, regras multi-item, e revisão dos limiares. O trabalho prepara esse próximo passo.

**Isso não é só um SELECT com GROUP BY sofisticado?**
A contagem de coocorrência é simples, sim. A contribuição não está na complexidade do algoritmo, está em mostrar empiricamente que essa abordagem simples funciona onde a filtragem colaborativa falha, e em fazer isso com validação honesta num caso real.

**Por que não usou machine learning ou rede neural?**
Porque não cabe no dado. Modelos pesados precisam de volume que eu não tenho, e perderiam a interpretabilidade que o vendedor precisa. A escolha pela técnica mais simples e adequada é parte do argumento, não uma limitação técnica.

**Seu resultado é generalizável?**
Não para o universo das distribuidoras. É um estudo de caso único. Ele demonstra viabilidade no recorte e oferece um método replicável. A generalização exigiria mais casos e mais dado.

**Qual a originalidade, se a técnica é dos anos 90?**
A técnica é clássica, a aplicação não. A originalidade está em aplicar e validar Market Basket Analysis num B2B pequeno e esparso, documentando por que ela serve ali e enfrentando de frente os problemas de avaliação que o tamanho do dado impõe.

**Se tivesse que refazer, o que mudaria?**
Mediria o baseline de popularidade lado a lado com número, desde o começo, e já deixaria a coleta de dados rodando por mais tempo antes de fechar a análise, para chegar na defesa com uma base maior.

---

## 12. Mais perguntas (rodada extra de treino)

**Qual a complexidade computacional do algoritmo?**
É O(n · p²), n é o número de transações e p o de produtos. Para dezenas de transações e produtos, como no meu caso, o custo é irrelevante. Isso muda de patamar se o volume crescer muito, mas está registrado como ponto de atenção para trabalho futuro.

**Isso escala? O que acontece com 10 mil produtos?**
A extração par-a-par ainda roda, mas o número de pares possíveis cresce quadraticamente e a maioria teria suporte ínfimo. Nesse volume eu partiria para Apriori ou FP-Growth com poda por suporte mínimo, que é exatamente o próximo passo que já aponto no trabalho.

**Você tratou dados pessoais dos clientes? Teve questão de ética ou LGPD?**
Os dados são da própria empresa, usados de forma agregada. Nome de cliente entra só como identificador de transação para montar a cesta, não é analisado nem exposto individualmente. Não é dado de consumidor final sensível, por isso não houve necessidade de submissão a comitê de ética.

**Qual a diferença do seu trabalho para o Schonhorst (2010), que também é regras de associação em varejo brasileiro?**
Ele aplicou em supermercado, B2C, volume de médio porte. Meu recorte é B2B, poucas dezenas de transações, sem nota de produto e sem volume de consumidor final. O paralelo metodológico existe, mas o cenário de esparsidade extrema que eu ataco é diferente do dele.

**O caso Amazon (Linden, Smith e York) prova que a técnica funciona. Por que replicar isso é uma contribuição?**
Porque a Amazon prova a técnica em alto volume. A pergunta que ninguém respondeu ainda é se ela se sustenta no extremo oposto, poucas transações, sem histórico de avaliação. É essa lacuna que o trabalho endereça.

**Como tratou nomes de produto escritos de forma diferente para o mesmo item (erro de digitação, abreviação)?**
Fiz padronização manual dos nomes na etapa de pré-processamento, comparando contra o cadastro de produto da empresa. Como eu conheço o catálogo, consegui validar cada padronização, mas reconheço que é um processo manual, não automatizado.

**A LOOCV não tem vazamento de informação, já que o item escondido pode aparecer em outra transação do treino?**
Não é vazamento no sentido de overfitting de modelo, porque não existe treino paramétrico, é contagem de coocorrência. Mas é verdade que o mesmo padrão pode se repetir entre a cesta de teste e as de treino, e é isso que dá sustentação à regra. O ponto de atenção real é o tamanho pequeno da base, não o desenho da validação.

**Por que Top-3 e não Top-5 ou Top-1?**
Top-3 equilibra utilidade prática, o vendedor não quer uma lista longa, com chance razoável de acerto dado o volume de regras. Testei mentalmente o Top-1, ficaria conservador demais e desperdiçaria regras válidas; Top-5 diluiria a precisão sem ganho real de recall nesse volume de dado.

**O que é uma "cesta multi-item" e por que só 14 das 30 entram na validação?**
Cesta multi-item é um pedido com dois produtos ou mais. Cesta de um item só não permite esconder um produto e checar se o sistema recupera, porque não sobra nada para gerar a recomendação. Das 30 transações totais, 14 têm mais de um item, e só essas entram no protocolo de LOOCV.

**O sistema recomenda igual para todo cliente, ou é personalizado por perfil?**
É baseado no item, não no perfil do cliente. Dado um produto no carrinho, o sistema sugere os complementos mais associados a ele no histórico agregado da empresa. Não segmenta por cliente porque o volume por cliente individual é baixo demais para isso.

**Por que não fez uma pesquisa de satisfação com os vendedores usando o sistema?**
Porque o volume de dado ainda não sustentava colocar o sistema em uso real no fluxo de venda durante o período da pesquisa. Validar percepção do vendedor e medir ticket médio em teste A/B é o passo natural seguinte, já registrado como trabalho futuro.

**Quantas semanas você teve para o trabalho, e isso limitou a profundidade?**
Cronograma de aproximadamente 12 semanas, do levantamento até a escrita final. O escopo foi desenhado para caber nesse tempo com qualidade, por isso a delimitação em uma técnica e um caso, em vez de comparar múltiplos algoritmos ou múltiplas empresas.

**Se um produto novo entra no catálogo sem nenhuma venda, o que o sistema faz?**
Nada ainda recomenda ele, porque não existe coocorrência registrada. É o cold start de item novo, mencionado na fundamentação. A mitigação usual seria recomendação baseada em conteúdo ou categoria do produto, fora do escopo atual.

**Quantos produtos distintos existem na base, e isso afeta a leitura das 44 regras?**
O catálogo movimentado no período é pequeno, dezenas de produtos, não milhares. Isso significa que 44 regras já cobrem uma fração relevante das combinações possíveis com suporte mínimo, não é uma amostra pequena diante de um catálogo gigante.

**Doutor(a), qual seria a nota de corte de confiança se você tivesse 10x mais dado?**
Eu subiria o suporte mínimo primeiro, porque com mais transações o mesmo corte de 0,02 passaria a aceitar ruído. A confiança de 0,30 provavelmente se manteria ou subiria um pouco, mas isso é reavaliação empírica, não decido isso de cabeça sem rodar de novo.

---

## Lembretes finais

- Respire antes de responder. Repita a pergunta com suas palavras se precisar de tempo.
- Não invente. "Não medi isso, mas investigaria por aqui" vale mais que um chute.
- Os três pontos que você domina e deve puxar sempre que der: a escolha da LOOCV, o teto da precisão e a aderência das regras ao negócio.
- Tenha em mãos: a monografia, os slides e este documento.
