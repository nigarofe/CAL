# Question Statement

---
## EDO Linear Homogênea de 2ª ordem com coeficientes constantes
$$
\text{Equação diferencial:} \qquad a_2 y'' + a_1 y' + a_0 y = 0.
$$
$$
\text{Equação característica:} \qquad a_2 r^2 + a_1 r + a_0 = 0,
$$
$$
\boxed{[\Delta > 0]\text{ (raízes reais e distintas)} \qquad y = c_1 e^{r_1x} + c_2 e^{r_2x}}
$$
$$\boxed{[\Delta = 0]\text{ (raízes iguais)} \qquad y(x) = c_1 e^{r x} + c_2 x e^{r x}}$$$$
\boxed{[\Delta < 0] \text{ (raízes complexas)} \qquad y(x) = c_1 e^{\lambda x} \cos \mu x + c_2 e^{\lambda x} \sin \mu x}
$$$$
r_1 = \lambda + i\mu \quad \text{e} \quad r_2 = \lambda - i\mu
$$
$$
y(x) = c_1 e^{(\lambda + i\mu)x} + c_2 e^{(\lambda - i\mu)x}
$$

---
Método de redução de ordem para quando $\Delta = 0$
$$
y'' + p(x) y' + q(x) y = 0
$$
$$
y_2(x) = u(x) y_1(x) = y_1(x) \int \frac{e^{-\int p(x)\,dx}}{[y_1(x)]^2}\,dx
$$

---
## Wronskiano
### Definição geral

Seja um conjunto de $n$ funções
$$
y_1(x),\quad y_2(x),\quad \dots,\quad y_n(x)
$$
definidas num intervalo $I$. O Wronskiano $W(y_1, \dots, y_n)(x)$ é o determinante da matriz cujas colunas são essas funções e suas derivadas até a ordem $n-1$:
$$
W(y_1, \dots, y_n)(x) =
\begin{vmatrix}
y_1(x) & y_2(x) & \cdots & y_n(x) \\
y_1'(x) & y_2'(x) & \cdots & y_n'(x) \\
\vdots & \vdots & \ddots & \vdots \\
y_1^{(n-1)}(x) & y_2^{(n-1)}(x) & \cdots & y_n^{(n-1)}(x)
\end{vmatrix}.
$$

- Se $W(x) \neq 0$ em $I$, as funções são linearmente independentes em $I$.
- Se $W(x) = 0$, pode haver dependência linear (não é garantia de dependência para $n > 2$, mas geralmente indica falta de independência).

## EDO de 2ª ordem
Para duas soluções $y_1, y_2$ de uma EDO de $2^a$ ordem, o Wronskiano é
$$
W(y_1, y_2)(x) =
\begin{vmatrix}
y_1(x) & y_2(x) \\
y_1'(x) & y_2'(x)
\end{vmatrix}
= y_1(x) y_2'(x) - y_1'(x) y_2(x).
$$

**Exemplo:**
Considere $y_1(x) = e^{2x}$ e $y_2(x) = e^{-x}$. Então
$$
y_1'(x) = 2e^{2x}, \quad y_2'(x) = -e^{-x},
$$
$$
W(e^{2x}, e^{-x})(x) = e^{2x}(-e^{-x}) - (2e^{2x})(e^{-x}) = -e^x - 2e^x = -3e^x,
$$
que nunca se anula, logo as duas soluções são independentes.






# LLM Solution %% fold %%


# Question answer %% fold %%
