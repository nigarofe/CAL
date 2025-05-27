# Question Statement


## EDO Não Homogênea
$$
y'' + p(t)y' + q(t)y = f(t)
$$
$$
y(x) = y_h(x) + y_p(x),
$$

### Método dos coeficientes indeterminados
### Polinômio
Se $f$ é um polinômio de grau $m$, admitimos
$$
y_p(x) = A_m x^m + A_{m-1}x^{m-1} + \dots + A_1 x + A_0,
$$

$$
\boxed{
\begin{aligned}
\text{Se } P(0) \neq 0 &: \text{ supõe } y_p = A_0 + A_1 x + \dots + A_m x^m \\
\text{Se } P(0) = 0 \text{ e } P'(0) \neq 0 &: \text{ supõe } y_p = x(A_0 + A_1 x + \dots + A_m x^m) \\
\text{Se } P(0) = 0 \text{ e } P'(0) = 0 &: \text{ supõe } y_p = x^2(A_0 + A_1 x + \dots + A_m x^m)
\end{aligned}
}
$$

### Exponencial
Se $f$ é uma função exponencial da forma
$$
f(x) = ae^{\beta x},
$$
admitimos uma solução particular da forma
$$
y_p(x) = Ae^{\beta x}.
$$

### Seno e Cosseno
Se $f$ é uma combinação linear das funções seno e cosseno, ou seja,
$$
f(x) = a \cos(\omega x) + b \sin(\omega x),
$$
admitimos uma solução particular da forma
$$
y_p(x) = A \cos(\omega x) + B \sin(\omega x).
$$

## Exponencial + Polinômio
Para funções da forma
$$
f(x) = (b_0 + b_1 x + \dots + b_m x^m) e^{\beta x},
$$

$$
\boxed{
\begin{aligned}
\text{Se } P(\beta) \neq 0 &: \text{ supõe } y_p = (A_0 + A_1 x + \dots + A_m x^m) e^{\beta x} \\
\text{Se } P(\beta) = 0 \text{ e } P'(\beta) \neq 0 &: \text{ supõe } y_p = x(A_0 + A_1 x + \dots + A_m x^m) e^{\beta x} \\
\text{Se } P(\beta) = 0 \text{ e } P'(\beta) = 0 &: \text{ supõe } y_p = x^2(A_0 + A_1 x + \dots + A_m x^m) e^{\beta x}
\end{aligned}
}
$$





# LLM Solution %% fold %%


# Question answer %% fold %%
