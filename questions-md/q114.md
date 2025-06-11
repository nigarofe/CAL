# Tensor Tensão vs Tensor Deformação

## Introdução
- A unidade do tensor tensão é $MPa$, enquanto o tensor deformação é adimensional. Isso porque o tensor deformação mede a deformação que um elemento infinitesimal de um corpo sofre. A medição de deformação pode ser pensada da seguinte forma: vamos supor que se eu aplicar uma força $F$ em uma barra que tem $0,5\,m$ de comprimento, ela vai sofrer um alongamento medido de $0,002\,m = 2\,mm$. 
- Ou seja, a deformação da barra é:
$$
\varepsilon = \frac{\Delta L}{L_0} = \frac{0,002\,m}{0,5\,m} = 0,004.
$$
Como $0,004$ é apenas uma razão, não há unidade associada a $\varepsilon$.

- $\textbf{Tensor de tensão}$ tem unidade de pressão (por exemplo MPa), porque ele mede forças internas por área.
- $\textbf{Tensor de deformação}$ é adimensional, pois descreve a variação relativa de comprimento (ou ângulo) de um elemento infinitesimal do corpo. Em outras palavras, é a razão entre o deslocamento e a dimensão original, sem unidades.
- 
## Tensor de tensões

$$
\text{Tensor de tensões } (\sigma)  =
\begin{bmatrix}
\sigma_{xx} & \tau_{xy} & \tau_{xz} \\
\tau_{yx} & \sigma_{yy} & \tau_{yz} \\
\tau_{zx} & \tau_{zy} & \sigma_{zz}
\end{bmatrix}
$$

Definições e observações:
1. Componentes de tensão normal
- $\sigma_{xx}$, $\sigma_{yy}$, $\sigma_{zz}$ são as tensões normais (tração ou compressão).
- Cada $\sigma_{ii}$ atua na face do elemento cuja superfície é perpendicular ao eixo $i$ (isto é, $\sigma_{xx}$ age na face ortogonal ao eixo $x$, $\sigma_{yy}$ age na face ortogonal ao eixo $y$, etc.), e a direção da força é paralelo ao próprio eixo $i$.

2. Componentes de tensão de cisalhamento
- $\tau_{ij}$ (com $i \neq j$) é a tensão de cisalhamento que atua na face perpendicular ao eixo $i$, com direção paralela ao eixo $j$.
- Por exemplo, $\tau_{xy}$ é a tensão de cisalhamento na face ortogonal ao eixo $x$, mas apontando na direção $y$. De modo equivalente, $\tau_{yx}$ atua na face ortogonal ao eixo $y$, apontando na direção $x$.
- Em meios contínuos sem momento externo distribuído (hipótese de ausência de corpos-de-forma), o tensor de tensões é simétrico, isto é,
$$
\tau_{xy} = \tau_{yx}, \quad \tau_{xz} = \tau_{zx}, \quad \tau_{yz} = \tau_{zy}.
$$

3. Visualização intuitiva
- Tensões normais ($\sigma_{ii}$) podem ser imaginadas como setas saindo (ou entrando, em compressão) normalmente às faces do elemento.
- Tensões de cisalhamento ($\tau_{ij}$) podem ser imaginadas como setas “coladas” à face do elemento, apontando paralelamente ao eixo $j$ sobre a face perpendicular ao eixo $i$.

Em outras palavras, cada subíndice na notação $\tau_{ij}$ indica primeiro a face sobre a qual a força é aplicada (o índice $i$, que determina qual face é “perpendicular” ao eixo $i$) e depois a direção da força (o índice $j$, que diz em que direção, entre $x$, $y$, $z$, a tensão está atuando).


## Tensor de deformações

$$
\text{Tensor de deformações } (\varepsilon) =
\begin{bmatrix}
\varepsilon_{xx} & \frac{\gamma_{xy}}{2} & \frac{\gamma_{xz}}{2} \\
\frac{\gamma_{xy}}{2} & \varepsilon_{yy} & \frac{\gamma_{yz}}{2} \\
\frac{\gamma_{xz}}{2} & \frac{\gamma_{yz}}{2} & \varepsilon_{zz}
\end{bmatrix}
$$
$$
\varepsilon_{ij} = \frac{\gamma_{ij}}{2} \quad (i \neq j) \quad \implies \quad \gamma_{ij} = 2\,\varepsilon_{ij}
$$
$$
\varepsilon_{ij} = \tfrac{1}{2}\Bigl(\frac{\partial u_i}{\partial x_j} + \frac{\partial u_j}{\partial x_i}\Bigr) \quad (i \neq j).
$$



1. Componentes de deformação normal

- $\varepsilon_{xx}, \varepsilon_{yy}, \varepsilon_{zz}$ são as deformações normais (alongamento ou encurtamento).
- Cada $\varepsilon_{ii}$ mede a variação relativa de comprimento de uma fibra originalmente paralela ao eixo $i$:
$$
\varepsilon_{xx} = \frac{\partial u_x}{\partial x}, \quad
\varepsilon_{yy} = \frac{\partial u_y}{\partial y}, \quad
\varepsilon_{zz} = \frac{\partial u_z}{\partial z},
$$
onde $\mathbf{u} = (u_x, u_y, u_z)$ é o vetor deslocamento.
- Valor positivo $\to$ alongamento; negativo $\to$ encurtamento (compressão).

2. Componentes de deformação de cisalhamento

- Para $i \neq j$, as componentes $\varepsilon_{ij}$ representam a distorção angular entre direções originalmente ortogonais $i$ e $j$.
- Na prática de engenharia usa-se a deformação de cisalhamento "engenharia"
$$
\gamma_{ij} = 2\varepsilon_{ij}, \quad (i \neq j),
$$
porque $\gamma_{ij}$ corresponde diretamente à variação do ângulo reto (em radianos) entre os eixos $i$ e $j$.
- Exemplo: $\gamma_{xy}$ é a variação do ângulo entre linhas inicialmente paralelas aos eixos $x$ e $y$.
- Como o tensor de deformações é obtido pela média simétrica do gradiente de deslocamentos, ele é necessariamente simétrico:
$$
\varepsilon_{xy} = \varepsilon_{yx}, \quad
\varepsilon_{xz} = \varepsilon_{zx}, \quad
\varepsilon_{yz} = \varepsilon_{zy}.
$$

3. Visualização intuitiva

- Deformações normais ($\varepsilon_{ii}$): imagine uma aresta de um cubo elemento ao longo do eixo $i$ que se alonga ou encurta — seu comprimento final é $(1 + \varepsilon_{ii})$ vezes o original (para pequenas deformações).
- Deformações de cisalhamento ($\gamma_{ij}$): visualize um quadrado inicialmente com 90° entre $x$ e $y$ tornando-se um paralelogramo; o "deslizamento" das camadas paralelas ao eixo $j$ sobre a face perpendicular ao eixo $i$ altera o ângulo em $\gamma_{ij}$ (positiva se o ângulo diminui).
- As setas usadas para tensões podem ser reutilizadas aqui como deslocamentos relativos: ao invés de representar forças, elas mostram o quanto um ponto da face move-se paralelamente àquela face.

4. Relação completa com o gradiente de deslocamentos (regime de pequenas deformações)

$$
\varepsilon_{ij} = \tfrac{1}{2}\Bigl(\frac{\partial u_i}{\partial x_j} + \frac{\partial u_j}{\partial x_i}\Bigr) \quad (i, j = x, y, z).
$$

Esta fórmula reúne, em um único objeto simétrico, todas as deformações normais e de cisalhamento, servindo de base para relações constitutivas (Lei de Hooke, por exemplo) e para o cálculo de deformações a partir de campos de deslocamentos experimentais ou numéricos.


## Alfabeto grego utilizado 
