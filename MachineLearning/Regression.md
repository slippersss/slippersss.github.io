<a><script src="https://slippersss.github.io/Mathjax.js"></script></a>

# Regression

## Linear model

$$
f(x)=xw
$$

where

$$
\begin{align}
&x=[1,\ x_1,\ x_2,\ ...,\ x_m]
\\
&w=[w_0,\ w_1,\ w_2,\ ...,\ w_m]
\end{align}
$$

## Cost/Loss function

$$
\begin{align}
&L(w)=\frac{1}{n}\ \sum_i\ (f(x^{(i)})-y^{(i)})^2=\frac{1}{n}\ \sum_i\ (x^{(i)}\ w-y^{(i)})^2=\frac{1}{n}\ ||Xw-y||^2
\\
&\frac{\partial\ L(w)}{\partial\ w}=\frac{2}{n}\ X^T\ (Xw-y)
\end{align}
$$

Let

$$
\frac{\partial\ L(w)}{\partial\ w}=0
$$

then

$$
w=(X^T\ X)^{-1}\ X^T\ y
$$

That means with this $w$

$$
Xw-y\perp span(X)
$$

## Gradient descent

$$
w\leftarrow w-r\ \frac{\partial\ L(w)}{\partial\ w}
$$

## Stochastic gradient descent

Reshuffle and segment the data to mini batches. Every iteration uses one of the mini batches to calculate $\frac{\partial\ L(w)}{\partial\ w}$(a noisy estimate to the true gradient).

## Regularization

$$
\lambda\ \sum_i\ w_i^2=\lambda\ ||w||^2
$$

## Explanation

$$
\begin{aligned}
&y'=b+\sum_i\ w_i\ (x_i+\Delta x_i)
\\
&y'-y=w_i\ \Delta x_i
\end{aligned}
$$

Because of regularization, $w_i$ become small. So $w_i\ \Delta x_i$ become small, which means $x_i$ has little effect.
