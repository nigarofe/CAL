# Computer Assisted Learning (CAL): Uma Metodologia para Aprendizagem Adaptativa
Esta metodologia de Computer Assisted Learning (CAL) propõe um fluxo de estudo adaptativo, concebido para se ajustar dinamicamente à profundidade desejada e ao tempo disponível do aprendiz. A arquitetura do sistema é modular e organizada em camadas, cada qual com uma implementação tecnológica específica:

| Camada                                  | Implementação Técnica                                                                                                                              | Pasta           |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| **Base de Conhecimento (Questões)**     | Arquivos Markdown, com gestão de conteúdo no Obsidian                                                                                              | questions-md    |
| **Base de Conhecimento (Premissas)**    | Arquivos Markdown, com gestão de conteúdo no Obsidian                                                                                              | premise-sets-md |
| **Sistema de Repetição Espaçada (SRS)** | Aplicativo web com funcionalidade offline                                                                                                          | web-app         |
| **Sistema de Memorização e Associação** | [Sistema Mnemônico Fonético](https://www.google.com/url?sa=E&q=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMnemonic_major_system) aplicado manualmente |                 |

Para a camada de Memorização, a metodologia utiliza o [Sistema Mnemônico Fonético](https://en.wikipedia.org/wiki/Mnemonic_major_system), uma técnica poderosa que converte números abstratos em palavras e imagens mentais concretas, facilitando a retenção de fórmulas, datas e constantes.

# Arquitetura da Base de Conhecimento

O ecossistema de conhecimento é composto por dois tipos de notas (arquivos Markdown), identificadas por um prefixo e um ID único (ex: q123.md para **Questão** e cp456.md para **Conjunto de Premissas**):
1. **Questões (q)**
2. **Conjuntos de Premissas (cp)**
## Questões (q)

Cada nota do tipo **Questão (qXYZ.md)** é um objeto de aprendizagem autocontido, seguindo uma estrutura rigorosa de quatro seções:

```
## Enunciado
Descrição clara e objetiva do problema ou da pergunta.

## Desenvolvimento
Apresentação do passo a passo da resolução, incluindo:
- Cálculos detalhados.
- Raciocínio lógico e justificativas para cada etapa.

## Respostas
Lista ou bloco de texto com as respostas finais, destacadas para fácil identificação.

## Conjuntos de Premissas
Links para os arquivos de premissas (`[cpXYZ.md]`) que fundamentam a resolução.
```

A curadoria dos **Conjuntos de Premissas** associados é estratégica: priorizam-se conceitos específicos (ex: as fórmulas de um teorema) em detrimento de conhecimento genérico (ex: regras básicas de álgebra). O sistema parte do pressuposto de que o aprendiz já domina os fundamentos, focando em recomendar os blocos de conhecimento mais diretamente aplicáveis à questão.

## Conjuntos de Premissas (cp)
Um **Conjunto de Premissas (cpXYZ.md)** representa uma unidade atômica e fundamental de conhecimento. Suas características definem o funcionamento do sistema:
- **Fonte Canônica da Verdade**: Atuam como a fonte definitiva, definindo axiomas, teoremas e definições aceitos como verdadeiros no escopo do sistema.
- **Hierarquia de Conhecimento**: As premissas podem depender umas das outras, formando uma hierarquia onde conceitos complexos são construídos sobre fundamentos mais simples.
- **Foco e Escopo**: Para garantir a modularidade e evitar recursividade infinita, as premissas **não são demonstradas** dentro de uma questão. Elas são o ponto de partida axiomático.
- **Reutilização e Modularidade**: São projetados para máxima reutilização. Como blocos de construção conceituais, uma única premissa pode fundamentar inúmeras questões.
- **Aplicação vs. Conhecimento**: O sistema distingue claramente **conhecer a premissa** de **saber aplicá-la**. O conhecimento das premissas é condição **necessária, mas não suficiente**, para a resolução de um problema. A verdadeira habilidade reside na aplicação contextual.
- **Grau de Dependência**: Uma métrica que mede a complexidade de uma premissa, calculada pelo número de outras premissas das quais ela depende diretamente para ser compreendida.