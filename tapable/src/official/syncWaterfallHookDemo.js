const { SyncWaterfallHook } = require("tapable");

const hook = new SyncWaterfallHook(["name", "age"]);

hook.tap("tap 1", (name, age) => {
    console.log("tap 1接收的参数：", name, age);
});

hook.tap("tap2", (name, age) => {
    console.log("tap 2接收的参数：", name, age);
    return [
        "新的名称",
        "新的年纪"
    ];
});

hook.tap("tap3", (name, age) => {
    console.log("tap 3接收的参数：", name, age);
});

hook.call("张三", "18");
