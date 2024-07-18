import { isObject, toRawType } from "@miu-vue/shared";
import { mutableHandlers } from "./baseHandlers";

export enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_IsReadonly',
    SKIP = '__v_skip',
    RAW = '__v_raw' // 已经是响应式对象
}

export enum TargetTypes {
    INVALID = 0, // 无效对象
    COMMON = 1, // 普通对象
    COLLECTION = 2, // 集合对象
}

/** 判断对象是集合对象还是普通对象 */
function targetTypeMap(rawType: string): TargetTypes {
    switch (rawType) {
        case 'Object':
        case 'Array':
            return TargetTypes.COMMON;
        case 'Map':
        case 'Set':
        case 'WeakMap':
        case 'WeakSet':
            return TargetTypes.COLLECTION;
        default:
            return TargetTypes.INVALID;
    }
}

/**
 * 判断对象是集合对象还是普通对象
 */
export function getTargetType(value: any) {
    return value[ReactiveFlags.SKIP]
        ? TargetTypes.INVALID
        : targetTypeMap(toRawType(value));
}

export const readonlyMap = new WeakMap();
export const reactiveMap = new WeakMap();
export const shallowReadonlyMap = new WeakMap();
export const shallowReactiveMap = new WeakMap();

export function reactive(target: any) {
    if (isReadonly(target)) {
        return target;
    }

    return createReactiveObject(
        target,
        false,
        reactiveMap,
        mutableHandlers,
        {},
    )
}

export function readonly(target) {
    return createReactiveObject(target, true, readonlyMap, {}, {})
}

/**
 *  
 * @param target 需要代理的原对象
 * @param isReadonly 当前创建的响应式对象是否只读
 * @param proxyMap 储存当前响应式对象的缓存
 * @param baseHandlers 普通对象的处理拦截
 * @param collectionHandlers 集合对象的处理拦截
 * @returns 
 */
export function createReactiveObject(
    target: any,
    isReadonly: boolean,
    proxyMap: any,
    baseHandlers: any,
    collectionHandlers: any,
) {
    // 有 target[ReactiveFlags.RAW] 证明已经是一个响应式代理
    // 除非是对一个 reactive 对象调用 readonly
    if (
        target[ReactiveFlags.RAW] &&
        !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
    ) {
        return target;
    }

    // 只处理对象类型的数据
    if (!isObject(target)) {
        return target;
    }

    // 判断当前的对象是否存在proxy，存在就不必创建直接返回
    const existProxy = proxyMap.get(target);
    if (existProxy) {
        return existProxy;
    }

    //如果当前的对象是无效的对象就直接返回（例如函数、Date）
    const targetType = getTargetType(target);
    if (targetType === TargetTypes.INVALID) {
        return target;
    }

    const proxy = new Proxy(
        target,
        targetType === TargetTypes.COLLECTION
            ? collectionHandlers
            : baseHandlers
    )

    proxyMap.set(target, proxy);
    return proxy;
}

export function isReadonly(val: any) {
    return !!val[ReactiveFlags.IS_READONLY];
}
export function isReactive(val: any) {
    return !!val[ReactiveFlags.IS_REACTIVE];
}