class DonePlugin {
    constructor(options) {
        this.options = options;
    } 
    apply(compiler) {
        compiler.hooks.done.tap('done plugin', () => {
            console.log('done plugin applied')
        })
       
    }
}

module.exports = DonePlugin;