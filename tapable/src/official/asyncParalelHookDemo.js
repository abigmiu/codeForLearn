const { AsyncParallelHook } = require('tapable');

const hook = new AsyncParallelHook(['name', 'age'])

hook.tapAsync('tap1', (name, age, callback) => {
    console.log("🚀 ~ hook.tapAsync ~ name, age:", name, age);
    setTimeout(() => {
        console.log('tap1 callback');
        callback()
    }, 2000)
})

hook.tapAsync('tap2', (name, age, callback)  => {
    console.log("🚀 ~ hook.tapAsync ~ name, age:", name, age);
    
    callback();
})

hook.tapAsync('tap3', (name, age, callback)  => {
    console.log('tap3')
    callback()
})

hook.callAsync('张三', 12, (err, result) => {
    console.log("🚀 ~ hook.callAsync ~ err, result:", err, result);
    
})