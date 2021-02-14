<a><script src="https://slippersss.github.io/Mathjax.js"></script></a>

# Regression

## Application

* stock market forecast  
* self-driving car  
* recommondation

## Linear model

$$
y=b+\sum_i\ w_i\ x_i
$$

## Loss

$$
L(w,\ b)=\sum_n\ (\hat{y}^n-y^n)^2
$$

## Gradient descent

$$
w\leftarrow w-\eta\ \frac{\partial L}{\partial w}
$$

## Regularization

$$
\lambda\ \sum_i\ w_i^2
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