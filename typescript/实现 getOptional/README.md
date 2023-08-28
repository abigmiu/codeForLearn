`T[P] extends Required<T>[P] ? never : P` 是一起的。

取出的值是否和 required 里面的值类型一致， 一致就抛弃

作用： 可以对某些可选值进行判断