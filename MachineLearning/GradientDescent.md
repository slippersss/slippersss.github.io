<a><script src="https://slippersss.github.io/Mathjax.js"></script></a>

# Gradient descent

## Basic concept

$L$ means loss function, $\theta$ means parameters.

We want

$$
\theta^*=arg\ \mathop{min}\limits_\theta L(\theta)
$$

Our method is

$$
\theta\leftarrow\theta-\eta\nabla L(\theta)
$$

## Adaptive learning rates

Reduce the learning rate by some factor every few epochs.

* Vanilla gradient descent

    $$
    w^{t+1}\leftarrow w^t-\eta^tg^t
    $$

* Adgrad

    $$
    \begin{aligned}
    &w^{t+1}\leftarrow w^t-\frac{\eta^t}{\sigma^t}g^t
    \\
    &w^{t+1}\leftarrow w^t-\frac{\eta}{\sqrt{\sum_{i=0}^t(g^i)^2}}g^t
    \end{aligned}
    $$

    where $\eta^t=\frac{\eta}{t+1}$, $\sigma^t=\sqrt{\frac{1}{t+1}\sum_{i=0}^t(g^i)^2}$, $g^t=\nabla L(w)$.

    It seems that $\frac{g^t}{\sum_{i=0}^t(g^i)^2}$ is uesd as $\frac{first\ derivative}{second\ derivative}$. Especially, we use $\sum_{i=0}^t(g^i)^2$ to approximate $second\ derivative$.

## Stochastic gradient descent

Sequentially or randomly pick $x^n$ to calculate gradient and loss.

## Feature scaling

Make different features have the same scaling.

$$
\frac{x-m}{\sigma}
$$

## In pratice

Gradient descent

* very low at the plateau  
* stuck at saddle point  
* stuck at local minima