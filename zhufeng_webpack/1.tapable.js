// tapable 实现
class SyncHook {
    constructor(args) {
        this.args = args || [];
        this.taps = [];
    }

    tap(name, fn) {
        this.taps.push(fn);
    }

    call() {
        const args = Array.from(this.args).slice(0, this.args.length);
        this.taps.forEach((tap) => tap(...args))
    }
}

const aHook = new SyncHook(['name']);
aHook.tap('这是一个没有意义的名字', (name, age) => {
    console.log("🚀 ~ aHook.tap ~ age:", age);
    console.log("🚀 ~ aHook.tap ~ name:", name);
    
})
aHook.call('abigmiu', 18)

module.exports = SyncHook;