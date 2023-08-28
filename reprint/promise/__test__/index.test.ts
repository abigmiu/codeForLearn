import { MyPromise } from "..";
import { describe, it, vi, expect } from 'vitest'

function delay(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('delay end')
        }, time);

    })
}

describe('简单版', () => {

    it('同步 then', async () => {
        const log = vi.fn(console.log);
        const promise = new MyPromise((resolve, reject) => {
            resolve('success');
            reject('err');
        })

        promise.then((value) => {
            log('resolve', value) // result: resolve success
        }, (reason) => {
            log('reject', reason);
        })
        await delay(1)
        expect(log).toHaveBeenCalledWith('resolve', 'success')

    })
    it('加入异步', async () => {
        const log = vi.fn(console.log);
        const promise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                resolve('success');
                reject('err');
            }, 2000);

        })

        promise.then((value) => {
            log('resolve', value) // result: resolve success
        }, (reason) => {
            log('reject', reason);
        })

        await delay(2000)
        expect(log).toHaveBeenCalledWith('resolve', 'success')
    })
    it('多个 then', async () => {
        const log = vi.fn(console.log);
        const promise = new MyPromise((resolve, reject) => {
            setTimeout(() => {
                resolve('success')
            }, 2000);
        })

        promise.then((value) => {
            log(1);
            log('resolve1', value)
        })

        promise.then((value) => {
            log(2)
            log('resolve2', value)
        })

        promise.then((value) => {
            log(3)
            log('resolve3', value)
        })

        await delay(2000)
        expect(log).toBeCalledTimes(6)
        expect(log).toHaveBeenNthCalledWith(1, 1)
        expect(log).toHaveBeenNthCalledWith(2, 'resolve1', 'success');
        expect(log).toHaveBeenNthCalledWith(3, 2)
        expect(log).toHaveBeenNthCalledWith(4, 'resolve2', 'success');
        expect(log).toHaveBeenNthCalledWith(5, 3)
        expect(log).toHaveBeenNthCalledWith(6, 'resolve3', 'success');
    })
    it('同步链式调用', async () => {
        const log = vi.fn(console.log);
        const promise = new MyPromise((resolve, reject) => {
            resolve('success');
        })

        function other() {
            return new MyPromise((resolve, reject) => {
                resolve('other')
            })
        }

        promise.then((value) => {
            log(1);
            log('resolve1', value);
            return 'other'
        }).then((value) => {
            log(2);
            log('resolve2', value);
        })
        await delay(1)
        expect(log).toHaveBeenNthCalledWith(1, 1);
        expect(log).toHaveBeenNthCalledWith(2, 'resolve1', 'success');
        expect(log).toHaveBeenNthCalledWith(3, 2);
        expect(log).toHaveBeenNthCalledWith(4, 'resolve2', 'other');
    })

    it('五、then 方法链式调用识别 Promise 是否返回自己', async () => {
        const log = vi.fn(console.log);
        const promise = new MyPromise((resolve, reject) => {
            resolve('success')
        })

        // 这个时候将promise定义一个p1，然后返回的时候返回p1这个promise
        const p1 = promise.then(value => {
            console.log(1)
            console.log('resolve', value)
            return p1
        })

        // 运行的时候会走reject
        p1.then(value => {
            console.log(2)
            console.log('resolve', value)
        }, reason => {
            console.log(3)
            log(reason.message)
        })

        await delay(1)
        expect(log).toBeCalledWith('Chaining cycle detected for promise #<Promise>')
    })
    it('捕获错误', async () => {
        const log = vi.fn(console.log);
        const promise = new MyPromise((resolve, reject) => {
            // resolve('success')
            throw new Error('执行器错误')
        })

        promise.then(value => {
          console.log(1)
          console.log('resolve', value)
        }, reason => {
          console.log(2)
          log(reason.message)
        })
        await delay(1)
        expect(log).toBeCalledWith('执行器错误')
    })

    it('捕获 then 错误', async () => {
        const log = vi.fn(console.log);
        const promise = new MyPromise((resolve, reject) => {
            resolve('success')
            // throw new Error('执行器错误')
         })

        // 第一个then方法中的错误要在第二个then方法中捕获到
        promise.then(value => {
          console.log(1)
          console.log('resolve', value)
          throw new Error('then error')
        }, reason => {
          console.log(2)
          console.log(reason.message)
        }).then(value => {
          console.log(3)
          console.log(value);
        }, reason => {
          console.log(4)
          log(reason.message)
        })

        await delay(1)
        expect(log).toBeCalledWith('then error')
    })
})
