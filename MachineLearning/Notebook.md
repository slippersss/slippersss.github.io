<a><script src="https://slippersss.github.io/tex-svg-full.js"></script></a>

# Regression

## Application

* stock market forecast  
* self-driving car  
* recommondation

## Linear model

$$
y=b+\sum_iw_ix_i
$$

## Loss

$$
L(w,\ b)=\sum_n(\hat{y}^n-y^n)^2
$$

## Gradient descent

$$
w\leftarrow w-\eta\frac{\partial L}{\partial w}
$$

## Regularization

$$
\lambda\sum_iw_i^2
$$
