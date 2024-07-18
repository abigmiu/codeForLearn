const SyncHook  = require('../../node_modules/tapable/lib/SyncHook');

const syncHookIns = new SyncHook(['name']);
syncHookIns.tap('监听器1', (name, age) => {
    console.log("🚀 ~ syncHookIns.tap ~ age:", age);
    console.log("🚀 ~ syncHookIns.tap ~ name:", name);
    console.log('监听器1触发');
})
syncHookIns.tap('监听器1.5', (name, age) => {
    console.log("🚀 ~ syncHookIns.tap ~ age:", age);
    console.log("🚀 ~ syncHookIns.tap ~ name:", name);
    console.log('监听器1.5触发');
})
syncHookIns.tap('监听器2', (name, age) => {
    console.log("🚀 ~ syncHookIns.tap ~ age:", age);
    console.log("🚀 ~ syncHookIns.tap ~ name:", name);
    console.log('监听器2触发');
})

syncHookIns.call('名字', '年纪')