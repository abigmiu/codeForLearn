const RunPlugin = require('./plugins/run-plugin')
const DonePlugin = require('./plugins/done.plugin')
const path = require('path')

module.exports = {
    entry: './src/index.js',
    context: process.cwd(),
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    // 'logger-loader'
                    path.resolve(__dirname, 'loaders', 'logger1.loader.js'),
                    path.resolve(__dirname, 'loaders', 'logger2.loader.js')
                ]
            }
        ]
    },
    plugins: [
        new RunPlugin(),
        new DonePlugin(),
    ]
}