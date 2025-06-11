# Calculating stress tensor rotation	
# Calculating  $\sigma'$
## Definitions
$$\sigma' =
\begin{bmatrix}
\sigma'_{xx} & \sigma'_{xy} & \sigma'_{xz} \\
\sigma'_{yx} & \sigma'_{yy} & \sigma'_{yz} \\
\sigma'_{zx} & \sigma'_{zy} & \sigma'_{zz}
\end{bmatrix}= L \sigma L^T$$ 
$$
L =
\begin{bmatrix}
L_{xx} & L_{xy} & L_{xz} \\
L_{yx} & L_{yy} & L_{yz} \\
L_{zx} & L_{zy} & L_{zz}
\end{bmatrix}
$$

$$
\sigma =
\begin{bmatrix}
\sigma_{xx} & \tau_{xy} & \tau_{xz} \\
\tau_{yx} & \sigma_{yy} & \tau_{yz} \\
\tau_{zx} & \tau_{zy} & \sigma_{zz}
\end{bmatrix}
$$

$$L^T =
\begin{bmatrix}
L_{xx} & L_{yx} & L_{zx} \\
L_{xy} & L_{yy} & L_{zy} \\
L_{xz} & L_{yz} & L_{zz}
\end{bmatrix}$$

$$L \sigma = 
\begin{bmatrix}
(L \sigma)_{xx} & (L \sigma)_{xy} & (L \sigma)_{xz} \\
(L \sigma)_{yx} & (L \sigma)_{yy} & (L \sigma)_{yz} \\
(L \sigma)_{zx} & (L \sigma)_{zy} & (L \sigma)_{zz}
\end{bmatrix}
$$


## Calculating $L \sigma$
To calculate $\sigma'$, we can first calculate only the products of the two first matrixes

$$
(L\sigma)_{xx} = L_{xx} \sigma_{xx} + L_{xy} \sigma_{yx} + L_{xz} \sigma_{zx},
$$
$$
(L\sigma)_{xy} = L_{xx} \sigma_{xy} + L_{xy} \sigma_{yy} + L_{xz} \sigma_{zy},
$$
$$
(L\sigma)_{xz} = L_{xx} \sigma_{xz} + L_{xy} \sigma_{yz} + L_{xz} \sigma_{zz},
$$
$$
(L\sigma)_{yx} = L_{yx} \sigma_{xx} + L_{yy} \sigma_{yx} + L_{yz} \sigma_{zx},
$$
$$
(L\sigma)_{yy} = L_{yx} \sigma_{xy} + L_{yy} \sigma_{yy} + L_{yz} \sigma_{zy},
$$
$$
(L\sigma)_{yz} = L_{yx} \sigma_{xz} + L_{yy} \sigma_{yz} + L_{yz} \sigma_{zz},
$$
$$
(L\sigma)_{zx} = L_{zx} \sigma_{xx} + L_{zy} \sigma_{yx} + L_{zz} \sigma_{zx},
$$
$$
(L\sigma)_{zy} = L_{zx} \sigma_{xy} + L_{zy} \sigma_{yy} + L_{zz} \sigma_{zy},
$$
$$
(L\sigma)_{zz} = L_{zx} \sigma_{xz} + L_{zy} \sigma_{yz} + L_{zz} \sigma_{zz}.
$$

## Calculating $(L \sigma) L^T$
$$
\sigma'_{xx} = (L\sigma)_{xx} L_{xx} + (L\sigma)_{xy} L_{xy} + (L\sigma)_{xz} L_{xz},
$$
$$
\sigma'_{xy} = (L\sigma)_{xx} L_{yx} + (L\sigma)_{xy} L_{yy} + (L\sigma)_{xz} L_{yz},
$$
$$
\sigma'_{xz} = (L\sigma)_{xx} L_{zx} + (L\sigma)_{xy} L_{zy} + (L\sigma)_{xz} L_{zz},
$$
$$
\sigma'_{yx} = (L\sigma)_{yx} L_{xx} + (L\sigma)_{yy} L_{xy} + (L\sigma)_{yz} L_{xz},
$$
$$
\sigma'_{yy} = (L\sigma)_{yx} L_{yx} + (L\sigma)_{yy} L_{yy} + (L\sigma)_{yz} L_{yz},
$$
$$
\sigma'_{yz} = (L\sigma)_{yx} L_{zx} + (L\sigma)_{yy} L_{zy} + (L\sigma)_{yz} L_{zz},
$$
$$
\sigma'_{zx} = (L\sigma)_{zx} L_{xx} + (L\sigma)_{zy} L_{xy} + (L\sigma)_{zz} L_{xz},
$$
$$
\sigma'_{zy} = (L\sigma)_{zx} L_{yx} + (L\sigma)_{zy} L_{yy} + (L\sigma)_{zz} L_{yz},
$$
$$
\sigma'_{zz} = (L\sigma)_{zx} L_{zx} + (L\sigma)_{zy} L_{zy} + (L\sigma)_{zz} L_{zz}.
$$


## Example with rotation about the Y axis by $\theta°$

$$
L =
\begin{bmatrix}
L_{xx} & L_{xy} & L_{xz} \\
L_{yx} & L_{yy} & L_{yz} \\
L_{zx} & L_{zy} & L_{zz}
\end{bmatrix} =
\begin{bmatrix}
c & 0 & s \\
0 & 1 & 0 \\
-s & 0 & c
\end{bmatrix}
$$
$$
L^T =
\begin{bmatrix}
L_{xx} & L_{yx} & L_{zx} \\
L_{xy} & L_{yy} & L_{zy} \\
L_{xz} & L_{yz} & L_{zz}
\end{bmatrix} =
\begin{bmatrix}
c & 0 & -s \\
0 & 1 & 0 \\
s & 0 & c
\end{bmatrix}
$$



### Calculate $L \sigma$
$$
\begin{bmatrix}
\sigma_{xx} & \tau_{xy} & \tau_{xz} \\
\tau_{yx} & \sigma_{yy} & \tau_{yz} \\
\tau_{zx} & \tau_{zy} & \sigma_{zz}
\end{bmatrix}
$$
$$
\begin{bmatrix}
c & 0 & s \\
0 & 1 & 0 \\
-s & 0 & c
\end{bmatrix}
\quad
\begin{bmatrix}
c\,\sigma_{xx} + 0\,\tau_{yx} + s\,\tau_{zx} 
& c\,\tau_{xy} + 0\,\sigma_{yy} + s\,\tau_{zy} 
& c\,\tau_{xz} + 0\,\tau_{yz} + s\,\sigma_{zz} \\[6pt]
0\,\sigma_{xx} + 1\,\tau_{yx} + 0\,\tau_{zx} 
& 0\,\tau_{xy} + 1\,\sigma_{yy} + 0\,\tau_{zy} 
& 0\,\tau_{xz} + 1\,\tau_{yz} + 0\,\sigma_{zz} \\[6pt]
 -s\,\sigma_{xx} + 0\,\tau_{yx} + c\,\tau_{zx} 
& -s\,\tau_{xy} + 0\,\sigma_{yy} + c\,\tau_{zy} 
& -s\,\tau_{xz} + 0\,\tau_{yz} + c\,\sigma_{zz}
\end{bmatrix}.
$$
$$c = \cos(\theta) \quad \text{and} \quad s = \sin(\theta)$$
### Calculate $\sigma' = (L \sigma) L^T$

$$
\sigma'_{xx} = c(c\,\sigma_{xx} + 0\,\tau_{yx} + s\,\tau_{zx}) \;+\; 0(c\,\tau_{xy} + 0\,\sigma_{yy} + s\,\tau_{zy}) \;+\; s(c\,\tau_{xz} + 0\,\tau_{yz} + s\,\sigma_{zz})
$$
$$\sigma'_{xx} =c^2\,\sigma_{xx} \;+\; c\,s\,\tau_{zx} \;+\; c\,s\,\tau_{xz} \;+\; s^2\,\sigma_{zz}$$
$$\sigma'_{xx} =c^2\,\sigma_{xx} \;+\; 2\, c\,s\,\tau_{xz} \;+\; s^2\,\sigma_{zz}$$
Using
$$
\cos^2 \theta = \frac{1 + \cos 2\theta}{2}, \quad \sin^2 \theta = \frac{1 - \cos 2\theta}{2}, \quad 2 \sin \theta \cos \theta = \sin 2\theta,
$$
we start from
$$
\sigma'_{xx} = c^2 \sigma_{xx} + 2 c s \tau_{xz} + s^2 \sigma_{zz}.
$$
Substitute:
$$
c^2 = \frac{1 + \cos 2\theta}{2}, \quad s^2 = \frac{1 - \cos 2\theta}{2}, \quad 2 c s = \sin 2\theta.
$$
Then
$$
\sigma'_{xx} = \sigma_{xx} \frac{1 + \cos 2\theta}{2} + \tau_{xz} \sin 2\theta + \sigma_{zz} \frac{1 - \cos 2\theta}{2}.
$$
Combine terms:
$$
\sigma'_{xx} = \frac{\sigma_{xx} + \sigma_{zz}}{2} + \frac{\sigma_{xx} - \sigma_{zz}}{2} \cos 2\theta + \tau_{xz} \sin 2\theta.
$$
















## Numerical example
[[q88]]



$$
\begin{array}{cc}
\quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad
&
\begin{bmatrix}
100 & 0 & 120 \\
0 & 20 & 0 \\
120 & 0 & 80
\end{bmatrix}
&
\quad
\begin{bmatrix}
\cos 30^\circ & 0 & -\sin 30^\circ \\
0 & 1 & 0 \\
\sin 30^\circ & 0 & \cos 30^\circ
\end{bmatrix}
\end{array}
$$

$$
\begin{array}{ccc}
\begin{bmatrix}
\cos 30^\circ & 0 & \sin 30^\circ \\
0 & 1 & 0 \\
-\sin 30^\circ & 0 & \cos 30^\circ
\end{bmatrix}
&
\begin{bmatrix}
46,60 & 0 & 143,92 \\
0 & 20 & 0 \\
53,92 & 0 & 9,28
\end{bmatrix}
&
\begin{bmatrix}
198,92 & 0 & 51,34 \\
0 & 20 & 0 \\
51,34 & 0 & -18,92
\end{bmatrix}
\end{array}
$$




# Questions to be answered
- Regardless of orientation, what quantities remain constant on a Cauchy stress tensor on an infinitesimal element, common “orientation‐independent” measures.