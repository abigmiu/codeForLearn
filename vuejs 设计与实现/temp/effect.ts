type IEffect = Function & {
    deps: Array<Set<Function>>;
    options: {
        scheduler?: (arg1: IEffect) => void;
        lazy?: boolean;
    }
}

const bucket = new WeakMap<Object, Map<string, Set<IEffect>>>();

const data = {
    msg: 'hello word',
    foo: 1,
    bar: 2,
}

let activeEffect: IEffect

function track(target: Object, key: string) {
    console.log('track', target, key)
    if (!activeEffect) {
        console.log('no activeEffect')
        return;
    }

    let depsMap = bucket.get(target);
    if (!depsMap) {
        depsMap = new Map();
        bucket.set(target, depsMap);
    }

    let deps = depsMap.get(key);
    if (!deps) {
        deps = new Set();
        depsMap.set(key, deps);
    }



    deps.add(activeEffect)
    activeEffect.deps.push(deps);
}

function trigger(target: Object, key: string, newVal?: any) {
    console.log('trigger', target, key, newVal);
    const effectsMap = bucket.get(target);
    const effects = effectsMap.get(key);
    // 执行effect 的时候会删除依赖，然后执行又收集依赖，死循环了
    const effectsToRun = new Set<IEffect>();
    effects.forEach(effect => {
        if (effect !== activeEffect) { // 避免无限递归。 比如obj.foo++
            effectsToRun.add(effect); // 这里又会走 obj.foo++ 这个所在的effect;
        }
    });
    effectsToRun.forEach((effect) => {
        if (effect.options.scheduler) {
            console.log('有调度器')
            effect.options.scheduler(effect)
        } else {
            effect();
        }
    })
}

const obj = new Proxy(data, {
    // 拦截设置操作
    set(target, key: string, newVal: any) {
        target[key] = newVal;
        trigger(target, key, newVal)
        return true;
    },
    // 拦截读取操作
    get(target, key: string) {
        track(target, key);
        return target[key];
    }
})

function cleanup(effectFn: IEffect) {
    for (let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i];
        // 从deps 里面删掉当前的 effectFn
        deps.delete(effectFn)
    }
    effectFn.deps.length = 0;
}

const effectStack = []; // 解决副作用函数嵌套


const jobQueue = new Set<IEffect>();
let isFlushing = false;
function flushJob() {
    if (isFlushing) return;

    isFlushing = true;
    const p = Promise.resolve();
    p.then(() => {
        jobQueue.forEach(job => job());
    }).finally(() => {
        isFlushing = false;
    })
}

function effect(fn: Function, options: IEffect['options'] = {}) {

    let effectFn: IEffect;
    // @ts-ignore
    effectFn = () => {
        cleanup(effectFn);
        activeEffect = effectFn;
        effectStack.push(activeEffect);
        const res = fn();
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];

        return res;
    };
    effectFn.options = options;
    console.log("🚀 ~ effect ~ options:", options);

    // 一个effect里面可能依赖了几个变量， 所以deps 会有多个
    effectFn.deps = [];
    if (!options.lazy) {
        effectFn();
        
    } 
    return effectFn;
}

function computed(getter: () => any) {
    let value;
    let dirty = true;
    // 新建一个对象， 让这个对象响应式。
    const obj = {
        get value() {
            if (dirty) {
                console.log('计算属性内部执行');
                value = effectFn();
                dirty = false; // 表示已经获取最新的值
            }
            track(obj, 'value');
            console.log('get computed value')
            
            return value;
        }
    }

    const effectFn = effect(getter, {
        lazy: true,
        scheduler(fn) {
            if (!dirty) {
                dirty = true; // 表示数据有更新
                trigger(obj, 'value');
            }
           
        }
    })

    return obj;
}

function traverse(source: any, seen = new Set()) {
    // 将所有的键读取一遍，用来收集依赖
    if (typeof source !== 'object' || source == null || seen.has(source)) {
        return source;
    }
    seen.add(source)
    for (const key in source) {
        traverse(source[key], seen);
    }

    return source;
}

function watch(source: any, cb: Function, options: {
    immediate?: boolean
}) {
    let getter;
    if (typeof source === 'function') {
        getter = source;
    } else if (typeof source === 'object') {
        getter = () => traverse(source);
    }
    let oldValue, newValue;

    const job = () => {
        newValue = effectFn();
            cb(newValue, oldValue);
            oldValue = newValue;
    }

    const effectFn = effect(() => getter(), {
        lazy: true,
        scheduler: job
    })
    if (options.immediate) {
        job();
    } else {
        oldValue = effectFn();
    }
}

// 测试computed
// const computedValue = computed(() => obj.foo + obj.foo);
// effect(() => {
//     console.log('计算属性触发执行');
//     console.log(computedValue.value);
// })
// console.log(computedValue.value)
// console.log(computedValue.value)
// console.log(computedValue.value)
// effect(() => {
//     console.log(obj.msg)
//     obj.foo++;
// });

// 调度执行测试
// effect(() => {
//     console.log("调度测试 effect");
//     console.log(obj.foo);
// }, {
//     scheduler(fn) {
//         console.log("调度测试 scheduler")
//         jobQueue.add(fn);
//         flushJob();
//         // setTimeout(() => {
//         // console.log("调度测试 scheduler")
//         // fn();

//         // }, 5000)
//     }
// })
// obj.foo++;
// obj.foo++;

// setTimeout(() => {
//     obj.msg = '新的 msg';
// }, 2000);