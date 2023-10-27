const Compiler = require('./Compiler')

function webpack(options) {
    console.log("🚀 ~ webpack ~ options:", options);
    const args = process.argv;
    console.log("🚀 ~ webpack ~ args:", args);
    // args 第一个和第二个参数是, 要去掉
    // /usr/local/bin/node
    // /Users/uranus/Documents/code/codeForLearn/zhufeng_webpack/debug.js
    const availableArgs = args.slice(2);
    console.log("🚀 ~ webpack ~ availableArgs:", availableArgs);
    const shellOptions = availableArgs.reduce((options, shellConfigItem) => {
        const [key, value] = shellConfigItem.split('=');
        options[key.slice(2)] = value;
        return options;
    }, {})
    const finalOptions = {

        ...options,
        ...shellOptions
    }
    console.log("🚀 ~ webpack ~ finalOptions:", finalOptions);

    const compiler = new Compiler(finalOptions)

    const plugins = finalOptions.plugins ?? [];
    plugins.forEach((plugin) => {
        plugin.apply(compiler)
    })

    return compiler;
}

module.exports = webpack;