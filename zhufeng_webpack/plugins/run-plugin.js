class RunPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.run.tap('run plugin', () => {
            console.log('run plugin applied')
        })
       
    }
}

module.exports = RunPlugin;