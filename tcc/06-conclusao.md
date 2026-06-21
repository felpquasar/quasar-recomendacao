# 6 CONCLUSÃO

Este trabalho investigou se é possível gerar recomendações de produtos úteis e estatisticamente relevantes para uma distribuidora B2B de pequeno porte usando apenas regras de associação extraídas do histórico de vendas, mesmo com um volume reduzido de transações. Para responder a essa questão, foi desenvolvido e avaliado um sistema completo aplicado aos dados reais da Quasar Barber. Esta seção retoma as contribuições do estudo (Seção 6.1), responde de forma direta à pergunta de pesquisa (Seção 6.2) e aponta os caminhos de continuidade (Seção 6.3).

## 6.1 Síntese das contribuições

O trabalho entregou um artefato funcional e reproduzível, conforme o paradigma de Design Science Research adotado no Capítulo 3. O sistema cobre todas as etapas, desde a carga e o pré-processamento dos dados até a interface web de consulta, passando pelo algoritmo de extração de regras, pela API REST e pela camada de validação. A arquitetura foi dimensionada para o porte de uma pequena empresa, com ferramentas gratuitas ou de baixo custo e sem dependência de infraestrutura de Big Data.

No plano empírico, a aplicação sobre os dados reais produziu 44 regras de associação a partir de 30 transações, com confiança média de 76,51% e lift médio de 12,41. As regras de maior destaque mostraram coerência com a prática comercial da distribuidora, agrupando produtos de uma mesma rotina de cuidado ou de uma mesma linha de marca. Isso indica que o algoritmo capturou relações de compra verossímeis, e não coincidências sem sentido para o negócio.

O estudo também contribui no plano metodológico. Ao constatar que o holdout 80/20 deixava apenas três transações avaliáveis, o trabalho adotou a validação cruzada Leave-One-Out como protocolo principal e documentou, com números, por que essa escolha é mais adequada a conjuntos pequenos. A discussão sobre o teto estrutural da Precision, fixado em $1/N \approx 0{,}33$ pelo esquema de ocultação de um item, é outro registro útil: ela mostra como interpretar as métricas sem confundir uma limitação do desenho de avaliação com baixa qualidade das recomendações.

## 6.2 Resposta à pergunta de pesquisa

A pergunta que orientou o trabalho era se regras de associação, sozinhas, podem gerar recomendações relevantes em um cenário B2B de baixo volume. A resposta é afirmativa, com ressalvas.

A evidência favorece a hipótese H1. As regras retidas apresentaram lift muito acima de 1,0, valor que descartaria a hipótese de coocorrência aleatória, e o sistema recuperou o produto ocultado em 16 dos 36 sub-testes da validação cruzada, um recall de 44,44%. Para um conjunto sem notas de produto e sem matriz densa de usuário-item, em que a filtragem colaborativa clássica não se aplica, esse desempenho sustenta a viabilidade da abordagem. As regras carregam informação além da simples frequência de venda, já que os pares de maior lift não coincidem com os produtos de maior volume individual, o que enfraquece a hipótese nula de que um baseline de popularidade bastaria.

A ressalva é de escala. A conclusão se apoia em 14 transações multi-item. Ela demonstra que o método funciona no recorte estudado, mas não autoriza generalização estatística ampla. O baixo suporte das regras, que infla os valores de lift das coocorrências raras, reforça que as recomendações devem ser tratadas como apoio à decisão da equipe de vendas, e não como prescrições automáticas.

## 6.3 Trabalhos futuros

O próprio recorte do estudo aponta as continuações mais naturais.

A primeira é o acúmulo de mais dados. À medida que o histórico da Quasar Barber crescer, espera-se maior estabilidade das métricas e suporte mais sólido para as regras, o que permitiria reavaliar os limiares de confiança e suporte com mais segurança.

A segunda é a generalização do algoritmo para itemsets de maior cardinalidade. A restrição a regras de um para um item foi uma decisão consciente, justificada pelo volume atual (Seção 4.9). Com um conjunto maior, valeria implementar o Apriori ou o FP-Growth completos para capturar padrões que envolvem três ou mais produtos comprados em conjunto.

A terceira é a colocação do sistema em produção, integrado ao fluxo de vendas da distribuidora, de modo que as recomendações cheguem à equipe no momento do pedido. A partir daí, abre-se a possibilidade de uma avaliação de impacto real por meio de um teste A/B, comparando o ticket médio dos pedidos apoiados pelas recomendações com o dos pedidos sem elas. Essa medida fecharia o ciclo entre a relevância estatística verificada neste trabalho e o efeito econômico que motivou a pesquisa.
