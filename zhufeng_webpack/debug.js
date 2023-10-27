const webpack = require('./webpack/index');
const options = require('./webpack.config')

const compiler = webpack(options);
compiler.run();