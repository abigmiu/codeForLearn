/**
 * 数组响应式
 */
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

// 改变了数组本身
const methodsToPatch = [
    'push',
    'pop',
    'unshift',
    'shift',
    'splice',
    'sort',
    'reverse'
]
methodsToPatch.forEach(method => {
    Object.defineProperty(arrayMethods, method, {
        value: function (...args) {
            const ret = arrayProto[method].apply(this, args)
            const ob = this.__ob__
            console.log('array reactive')

            let inserted
            switch (method) {
                case 'push':
                    inserted = args
                    break;
                case 'unshift':
                    inserted = args
                    break
                case 'splice':
                    inserted = args.slice(2)
                    if (inserted) ob.abserveArray(inserted)
                    ob.dep.notify()
                default:
                    break;
            }
            return ret
        },
        configurable: true,
        writable: true,
        enumerable: false,
    })
})

export default function protoArgument(ary) {
    ary.__proto__ = arrayMethods
}
