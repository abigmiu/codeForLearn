const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

type IResolveFun = (value: any) => any;
type IRejectFun = (reason: any) => any;
type IExecutor = (resolve: IResolveFun, reject: IRejectFun) => any

export class MyPromise {
    private status = PENDING
    private value: any = null
    private reason: any = null

    private onFulfilledCallbacks: IResolveFun[] = []
    private onRejectedCallbacks: IRejectFun[] = []


    constructor(executor: IExecutor) {
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e)
        }

    }

    // 箭头函数绑定 this
    // 更改成功后的状态
    resolve: IResolveFun = (value) => {
        if (this.status !== PENDING) return;

        this.status = FULFILLED;
        this.value = value;

        this.onFulfilledCallbacks.forEach(fn => fn(value))
        this.onFulfilledCallbacks.length = 0;
    }

    // 更改失败后的状态
    reject: IRejectFun = (reason) => {
        if (this.status !== PENDING) return;

        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn(reason))
        this.onRejectedCallbacks.length = 0;
    }

    then(onFulfilled?: IResolveFun, onRejected?: IRejectFun) {
        const innerOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v
        const innerOnRejected = typeof onRejected === 'function' ? onRejected : (r) => { throw Error(r) }

        // 创建一个新实例， 用于链式调用
        const promise2 = new MyPromise((resolve, reject) => {
            // 创建一个微任务等待 promise2 完成初始化
            const fulfilledMicrotask = () => queueMicrotask(() => {
                try {
                    // 调用成功回调
                    const x = innerOnFulfilled(this.value);
                    resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            })
            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        // 调用失败回调
                        const x = innerOnRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }

            if (this.status === FULFILLED) {
                fulfilledMicrotask();
            }

            if (this.status === REJECTED) {
                rejectedMicrotask();
            }

            if (this.status === PENDING) {
                // 等待状态变化后依次调用
                this.onFulfilledCallbacks.push(fulfilledMicrotask);
                this.onRejectedCallbacks.push(rejectedMicrotask);
            }
        })
        return promise2;
    }

    static resolve(parament) {
        if (parament instanceof MyPromise) {
            return parament;
        }

        return new MyPromise(resolve => {
            resolve(parament)
        })
    }

    static reject(reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason);
        })
    }
}


function resolvePromise(promise2, x: any, resolve: IResolveFun, reject: IRejectFun) {
    // 如果相等了， 说明 return 的是自己， 抛出类型错误并返回
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }

    if (x instanceof MyPromise) {
        // 调用 then方法。
        x.then(resolve, reject);
    } else {
        resolve(x)
    }
}
