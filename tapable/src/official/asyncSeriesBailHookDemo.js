const { AsyncSeriesBailHook } = require('tapable')

const hook = new AsyncSeriesBailHook(['name', 'age'])

hook.tapAsync('tap1', (name, age, callback) => {
    console.log("🚀 ~ tap1 ~ name, age:", name, age);
    setTimeout(() => {
        console.log('tap1 callback');
        callback();
    }, 2000);
})

hook.tapAsync('tap2', (name, age, callback) => {
    console.log("🚀 ~ tap2 ~ name, age,:", name, age,);
    setTimeout(() => {
        console.log('tap2 callback');
        callback(null, 'tap2 result');
    }, 3000);
})
hook.tapAsync('tap3', (name, age, callback) => {
    console.log("🚀 ~ tap3 ~ name, age,:", name, age,);
    setTimeout(() => {
        console.log('tap3 callback');
        callback(null, 'tap3 result');
    }, 4000);
})
hook.callAsync('李华', 22, (err, result) => {
    console.log("🚀 ~ hook.callAsync ~ err, result:", err, result);
    
})