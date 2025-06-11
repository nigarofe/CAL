
$$
\begin{array}{llll}
\text{Integral type} & \text{Field type} & \text{Integral formula} & \text{Element of integration} \\
\hline
\text{Line} & \text{Scalar} & \int_C f(x,y)\,ds & ds = \|\mathbf{r}'(t)\| dt \\
\text{Line} & \text{Vector} & \int_C \vec{F}(x,y) \cdot d\vec{r} & d\vec{r} = \vec{r}'(t)\,dt \\
\text{Surface} & \text{Scalar} & \iint_S f(x,y)\,ds & ds = \sqrt{\left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2 + 1}\,dx\,dy \\
\text{Surface} & \text{Vector} & \iint_S \vec{F}(x,y) \cdot d\vec{s} & d\vec{s} = \left(-\frac{\partial z}{\partial x}, -\frac{\partial z}{\partial y}, 1\right) dx\,dy \\
\text{Volume} & \text{Scalar} & \iiint_V f(x,y)\,dV & dV = dx\,dy\,dz \\
\end{array}
$$


