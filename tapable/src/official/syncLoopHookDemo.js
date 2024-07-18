const { SyncLoopHook } = require('tapable')

const hook = new SyncLoopHook(['name', 'age']);

const ary = [1, 2, 3, 4, 5, 6, 7];

hook.tap('1', (name, age) => {
    console.log('ary.length', ary.length)
    console.log("🚀 ~ hook.tap1 ~ name, age:", name, age);
    
    if (ary.length < 5) {
        return undefined;
    } else {
        ary.pop();
        return 'tap1'
    }
})

hook.tap('2', (name, age) => {
    console.log("🚀 ~ hook.tap2 ~ name, age:", name, age);
    if (ary.length < 3) {
        return undefined;
    } else {
        ary.pop();
        return 'tap1'
    }
})

hook.tap('3', (name, age) => {
    console.log("🚀 ~ hook.tap3 ~ name, age:", name, age);
    if (ary.length <= 1) {
        return undefined;
    } else {
        ary.pop();
        return 'tap1'
    }
})

hook.call('华山',1101)