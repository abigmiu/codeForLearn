import { extend, isArray, isIntegerKey, isMap } from "@miu-vue/shared";
import { createDep } from "./dep";
import { TriggerOpTypes } from "./operator";

// 表示for...in 操作类型所触发的依赖收集的key。因为for...in 操作是针对这个对象的访问,没有针对对象的属性，所以就没有key,这里我们直接自定义一个key，用于专门处理
export const ITERATE_KEY = Symbol();

// 针对map的方法.keys的依赖收集key
export const MAP_KEY_ITERATE_KEY = Symbol()



let shouldTrack = true;

export function pauseTracking() {
    shouldTrack = false;
}

export function enableTracking() {
    shouldTrack = true;
}

let activeEffect;

export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn);

    extend(_effect, options);
    // 不是懒加载就立即执行
    if (!options.lazy) {
        _effect.run();
    }

    let runner = _effect.run.bind(_effect);
    (runner as any).effect = _effect;
    return runner;
}

function cleanupEffect(effect) {
    const { deps } = effect;

    for (let dep of deps) {
        dep.delete(effect);
    }

    deps.length = 0;
}

export class ReactiveEffect {
    parent = null; // 父effect
    active = true; // 
    deps = [];

    constructor(public fn, public scheduler: any = null) {

    }

    run() {
        if (!this.active) {
            return this.fn();
        }

        let parent: ReactiveEffect | undefined = activeEffect;
        while (parent?.parent) {
            if (parent === this) {
                return;
            }
            parent = parent.parent;
        }

        try {
            this.parent = activeEffect;
            activeEffect = this;
            cleanupEffect(this);
            return this.fn();
        } finally {
            activeEffect = this.parent;
            this.parent = null;
        }
    }

    stop() {
        if (this.active) {
            cleanupEffect(this);
            this.active = false;
        }
    }
}

export function isTracking() {
    return shouldTrack && activeEffect != undefined;
}

const targetMap = new WeakMap();

export function track(target, trackOpType, key) {
    if (!isTracking()) {
        return;
    }

    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if (!dep) {
        dep = createDep();
    }

    trackEffects(dep);
}

export function trackEffects(dep) {
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
    }
}

export function trigger(target, type, key?, newValue?, oldValue?) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;

    const effects = new Set();

    const add = (effectsToAdd) => {
        if (effectsToAdd) {
            effectsToAdd.forEach(effect => {
                effects.add(effect);
            })
        }
    }


    if (key === 'length' && isArray(target)) {
        depsMap.forEach((dep, key) => {
            if (key === 'length' || key >= newValue) {
                add(dep);
            }
        })
    } else {
        if (key !== void 0) {
            add(depsMap.get(key));
        }

        switch (type) {
            case TriggerOpTypes.ADD:
                if (!isArray(target)) {
                    add(depsMap.get(ITERATE_KEY))
                    if (isMap(target)) {
                        add(depsMap.get(MAP_KEY_ITERATE_KEY))
                    }
                } else if (isIntegerKey(key)) {
                    add(depsMap.get('length'))
                }
                break;
            case TriggerOpTypes.DELETE:
                //删除对象的特殊情况 map => [foreach for in] 时候依赖跟踪此时需要触发、 set=> [foreach for in] 时候依赖跟踪此时需要触发、、 {} =>[for in]时候依赖跟踪此时需要触发
                if (!isArray(target)) {
                    add(depsMap.get(ITERATE_KEY))
                    if (isMap(target)) {
                        add(depsMap.get(MAP_KEY_ITERATE_KEY))
                    }
                }
                break
            case TriggerOpTypes.SET:
                if (isMap(target)) { //map的set操作是需要更新的，
                    add(depsMap.get(ITERATE_KEY))
                }
                break
        }

        trackEffects(createDep(effects));
    }
}

export function triggerEffects(dep) {
    dep.forEach((effect) => {
        if (activeEffect !== effect) {
            effect.scheduler ? effect.scheduler() : effect.run()
        }
    })
}