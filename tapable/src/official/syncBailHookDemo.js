const { SyncBailHook } = require('tapable');

const hook = new SyncBailHook(['name', 'age']);

hook.tap('监听器1', (name, age) => {
    console.log('监听器1 没有返回值', 'name=', name, 'age', age);
})
hook.tap('监听器2', (name, age) => {
    console.log('监听器2 有返回值', 'name=', name, 'age', age);
    return '天天开心'
})

hook.tap('监听器3', (name, age) => {
    console.log('监听器3 由于上一个有返回值，这个不执行', 'name=', name, 'age', age);
})

hook.tap('监听器4', (name, age) => {
    console.log('监听器4 监听器3不执行了，后续的都不执行', 'name=', name, 'age', age);
})

hook.tap('监听器5', (name, age) => {
    console.log('监听器4 监听器3不执行了，后续的都不执行', 'name=', name, 'age', age);
})

hook.call('李华', 20);