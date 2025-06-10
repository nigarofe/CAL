# Fórmulas da relação constitutiva da lei de Hooke em elasticidade linear isotrópica

## Resumo
$$
\varepsilon_{ij} = \frac{1 + \nu}{E} \, \sigma_{ij} \;-\; \frac{\nu}{E} \, (\sigma_{kk}) \, \delta_{ij}  \quad \text{(Fórmula geral)}
$$
$$
\varepsilon_{ii} = \frac{1}{E} \Bigl(\sigma_{ii} \;-\; \nu \sum_{j \neq i} \sigma_{jj}\Bigr)  \quad \text{(Componentes normais)}
$$
$$
\varepsilon_{ij} = \frac{1 + \nu}{E} \, \tau_{ij} \quad \text{(Componentes de cisalhamento)}
$$


## Interpretação das fórmulas para ajudar a memorizar

$$
\varepsilon_{ii} = \frac{1}{E} \Bigl(\sigma_{ii} \;-\; \nu \sum_{j \neq i} \sigma_{jj}\Bigr)  \quad \text{(Componentes normais)}
$$
Se o coeficiente de Poisson de um material for 0, uma deformação normal do corpo daquele material não vai se importar com tensões nas outras direções, só na direção normal à ela. 
Porém, quanto maior o coeficiente de Poisson, mais a deformação vai se importar com as outras tensões normais, pois as deformações que elas estão tentando causar no corpo sobrepõe com a deformação da tensão normal sendo analisada. Ou seja, se ocorrer tração nas tensões $jj$, elas vão atrapalhar a deformação que a tensão $ii$ causaria, e se fossem de compressão, ajudariam, por isso o sinal negativo.



$$
\varepsilon_{ij} = \frac{1 + \nu}{E} \, \tau_{ij} = \frac{1}{2} \,{J} \, \tau_{i} \quad \text{(Componentes de cisalhamento)}
$$

A deformação de cisalhamento no plano de um corpo é a metade de sua conformidade ao cisalhamento $(J)$ vezes a tensão de cisalhamento naquele plano









## Forma geral em tensores (componentes arbitrárias $i, j$)
$$
\varepsilon_{ij} = \frac{1 + \nu}{E} \, \sigma_{ij} \;-\; \frac{\nu}{E} \, (\sigma_{kk}) \, \delta_{ij}
$$
onde

- $\varepsilon_{ij}$ são as componentes do tensor deformação,
- $\sigma_{ij}$ são as componentes do tensor tensão,
- $E$ é o módulo de Young,
- $\nu$ é o coeficiente de Poisson,
- $\sigma_{kk} = \sigma_{11} + \sigma_{22} + \sigma_{33}$ (soma de tensões normais),
- $\delta_{ij}$ é o delta de Kronecker.

## Fórmula para componentes normais (diagonais) da deformação
Para $i = 1, 2, 3$,
$$
\varepsilon_{ii} = \frac{1}{E} \Bigl(\sigma_{ii} \;-\; \nu \sum_{j \neq i} \sigma_{jj}\Bigr)
$$

Isso equivale, em cada direção principal $i$, a
$$
\varepsilon_{11} = \frac{1}{E}\bigl(\sigma_{11} \;-\; \nu \,[\sigma_{22} + \sigma_{33}]\bigr)
$$
$$
\varepsilon_{22} = \frac{1}{E}\bigl(\sigma_{22} \;-\; \nu \,[\sigma_{11} + \sigma_{33}]\bigr)
$$
$$
\varepsilon_{33} = \frac{1}{E}\bigl(\sigma_{33} \;-\; \nu \,[\sigma_{11} + \sigma_{22}]\bigr)
$$

## Fórmula para componentes de cisalhamento
Para $i \neq j$, ou seja, $i, j = 1, 2, 3$ com $i \neq j$,
$$
\varepsilon_{ij} = \frac{1 + \nu}{E} \, \tau_{ij}
$$

