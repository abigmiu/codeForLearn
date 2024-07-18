const { AsyncParallelBailHook } = require('tapable');

const hook = new AsyncParallelBailHook(['name', 'age']);

hook.tapAsync('tap1', (name, age, callback) => {
    console.log("🚀  tap1 name, age:", name, age);
    setTimeout(() => {
        console.log('tap1 setTimeout')
        callback();
    }, 2000)
})

hook.tapAsync('tap2', (name, age, callback) => {
    console.log("🚀  tap2 name, age:", name, age);

    setTimeout(() => {
        
        console.log('tap2 setTimeout')
        callback(null, 'tap2 的返回值');
    }, 3000)
})

hook.tapAsync('tap3', (name, age, callback) => {
    console.log("🚀  tap3 name, age:", name, age);
    setTimeout(() => {
        console.log('tap3 setTimeout')

        callback(null, 'tap3 的返回值');
    }, 4000)

})

hook.tapAsync('tap4', (name, age, callback) => {

    console.log("🚀  tap4 name, age:", name, age);
    setTimeout(() => {
       
        console.log('tap4 setTimeout')
        callback(null, 'tap4 的返回值');
    }, 4000)

})

hook.callAsync('李华', 28, (err, result) => {
    console.log("🚀 ~ hook.callAsync ~ err, result:", err, result);

})