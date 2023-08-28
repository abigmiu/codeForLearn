// 深拷贝
// 对象，数组， 正则，日期，dom树
//
// 基本类型数据是否能拷贝？
// 键和值都是基本类型的普通对象是否能拷贝？
// Symbol作为对象的key是否能拷贝？
// Date和RegExp对象类型是否能拷贝？
// Map和Set对象类型是否能拷贝？
// Function对象类型是否能拷贝？（函数我们一般不用深拷贝）
// 对象的原型是否能拷贝？
// 不可枚举属性是否能拷贝？
// 循环引用是否能拷贝？
const obj: Record<any, any> = {
    // =========== 1.基础数据类型 ===========
    num: 0, // number
    str: '', // string
    bool: true, // boolean
    unf: undefined, // undefined
    nul: null, // null
    sym: Symbol('sym'), // symbol

    // =========== 2.Object类型 ===========
    // 普通对象
    obj: {
        name: '我是一个对象',
        id: 1,
    },
    // 数组
    arr: [0, 1, 2],
    // 函数
    func: function () {
        console.log('我是一个函数');
    },
    // 日期
    date: new Date(0),
    // 正则
    reg: new RegExp('/我是一个正则/ig'),
    // Map
    map: new Map().set('mapKey', 1),
    // Set
    set: new Set().add('set'),
    // =========== 3.其他 ===========
    [Symbol('1')]: 1, // Symbol作为key
};

// 4.添加不可枚举属性
Object.defineProperty(obj, 'x', {
    enumerable: false,
    writable: true,
    value: '不可枚举属性',
});

// 5.设置原型对象
Object.setPrototypeOf(obj, {
    proto: 'proto',
});

// 6.设置loop成循环引用的属性
obj.loop = obj;

function isObject(target: unknown): target is Function | Object {
    if (typeof target === 'object' && target) {
        return true;
    }
    if (typeof target === 'function') {
        return true;
    }
    return false;
}

function deepClone(data: unknown) {
    const map = new WeakMap();

    function clone(target: unknown) {
        if (!isObject(target)) return target;
        /** 日期 */
        if (target instanceof Date) {
            return new Date(target);
        }

        /** 正则 */
        if (target instanceof RegExp) {
            return new RegExp(target);
        }

        /** 函数 */
        if (target instanceof Function) {
            return new Function(`return ${target.toString()}`)();
        }

        const exist = map.get(target);
        if (exist) {
            return exist;
        }
        /** Map 类型 */
        if (target instanceof Map) {
            const result = new Map();
            map.set(target, result);

            target.forEach((val, key) => {
                result.set(key, clone(val));
            });

            return result;
        }

        /** Set 类型 */

        if (target instanceof Set) {
            const result = new Set();
            map.set(target, result);

            target.forEach((val) => {
                result.add(clone(val));
            });
        }

        /** 数组 */
        if (Array.isArray(target)) {
            const ary = new Array();
            map.set(target, ary);

            target.forEach((item, index) => {
                ary[index] = clone(item);
            });
        }

        /** 对象 */
        const keys = Reflect.ownKeys(target);
        // 利用 Object 的 getOwnPropertyDescriptors 方法可以获得对象的所有属性以及对应的属性描述
        const allDesc = Object.getOwnPropertyDescriptors(target);
        // 结合 Object 的 create 方法创建一个新对象，并继承传入原对象的原型链， 这里得到的result是对data的浅拷贝
        const result = Object.create(Object.getPrototypeOf(target), allDesc);
        map.set(target, result);
        keys.forEach((key) => {
            result[key] = clone((target as any)[key]);
        });

        return result;
    }

    return clone(data);
}

const newData = deepClone(obj);
console.log(newData);
console.log(newData.arr === obj.arr);
console.log(newData === obj);
console.log(newData.func === obj.func);
