const path = require('path');

const officialConfig = {
    mode: 'development',
    entry: {
        main: './official/src/index.js',
        b: './official/src/b.js'
    },
    output: {
        filename: '[name][hash].js',
        path: path.resolve(__dirname, './official/dist')
    }
}

module.exports = officialConfig;