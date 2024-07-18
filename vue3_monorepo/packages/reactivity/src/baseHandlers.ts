import { hasOwn, isArray, isIntegerKey, isObject, isSymbol, makeMap } from "@miu-vue/shared";
import { reactive, ReactiveFlags, reactiveMap, readonly, readonlyMap, shallowReadonlyMap } from "./reactive";
import { enableTracking, ITERATE_KEY, pauseTracking, track, trigger } from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./operator";

const builtInSymbols = new Set(
    Object.getOwnPropertyNames(Symbol)
        .map(key => (Symbol as any)[key])
        .filter(isSymbol)
)

const isNonTrackableKeys = makeMap(`__proto__,__v_isRef,__isVue`)

/** 重写数组的方法 */
function createInstrumentations() {
    const instrumentations: Record<string, Function> = {};
    (['indexOf', 'includes', 'lastIndexOf'] as const)
        .forEach(key => {
            const originMethod: Function = Array.prototype[key];
            instrumentations[key] = function (this, ...args) {
                let res = originMethod.apply(this, args);
                if (res < 0 || res === false) {
                    res = originMethod.apply(this[ReactiveFlags.RAW], args);
                }
                return res;
            }
        });

    (['push', 'pop', 'shift', 'unshift', 'splice'] as const)
        .forEach(key => {
            const originMethod: Function = Array.prototype[key];
            instrumentations[key] = function (this, ...args) {
                pauseTracking();
                let res = originMethod.apply(this, args);
                enableTracking();
                return res;
            }
        });

    return instrumentations;
}
const arrayInstrumentations = createInstrumentations();

function createGetter(isReadonly = false, isShallow = false) {
    return function get(target, key, receiver) {
        const isExistInReactiveMap = () =>
            key === ReactiveFlags.RAW && receiver === reactiveMap.get(target);

        const isExistInReadonlyMap = () =>
            key === ReactiveFlags.RAW && receiver === readonlyMap.get(target);

        const isExistInShallowReadonlyMap = () =>
            key === ReactiveFlags.RAW && receiver === shallowReadonlyMap.get(target);

        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        } else if (
            key === ReactiveFlags.RAW &&
            (
                isExistInReactiveMap() ||
                isExistInReadonlyMap() ||
                isExistInShallowReadonlyMap()
            )
        ) {
            // __v_raw 属性对应 代理对象的目标对象
            // 当该属性有值，且在相应的proxyMap中存在代理对象时，说明target已经是一个proxy了
            // __v_raw 属性对应的值为target本身
            return target;
        }
        /**
    * 如果当前的操作对象时数组，并且操作的属性是一个重写的方法,就走自定义的重写方法的逻辑
    */
        if (
            !isReadonly &&
            isArray(target) &&
            hasOwn(arrayInstrumentations, key)
        ) {
            return Reflect.get(arrayInstrumentations, key, receiver);
        }

        const res = Reflect.get(target, key, receiver);
        if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
            return res;
        }

        if (!isReadonly) {
            track(target, TrackOpTypes.GET, key);
        }

        if (isShallow) {
            return res;
        }

        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }

        return res;

    }
}
const get = createGetter();

export function toRaw(observed) {
    const raw = observed && (observed as any)[ReactiveFlags.RAW];
    return raw ? toRaw(raw) :observed;
}

function createSetter(isShallow = false) {
    return function set(target, key, value, receiver) {
        let oldValue = target[key];

        const hadKey = (
            isArray(target) && isIntegerKey(key) 
            ? key < target.length
            : hasOwn(target, key)
        )
        const res = Reflect.set(target, key, value, receiver);
        if (target === toRaw(receiver)) {
            if (!hadKey) {
                trigger(target, TriggerOpTypes.ADD, key, value)
            } else {
                trigger(target, TriggerOpTypes.SET, key, value, oldValue)
            }
        }

        return res;
    }
}
const set = createSetter();

function ownKeys(target) {
    // 如果当前操作的对象是数组时直接用length为依赖的key名称，因为操作数组都要改变数组长度
    track(target, TrackOpTypes.ITERATE, isArray(target) ? 'length' : ITERATE_KEY) //这种情况需要收集依赖
    return Reflect.ownKeys(target)
  }
export const mutableHandlers = {
    get,
    set,
    ownKeys
}