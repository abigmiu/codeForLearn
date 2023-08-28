const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer');

const srcPagePath = path.resolve(__dirname, 'src/page')

/** 获取所有页面文件夹 */
function generatePages() {
    const pageDirs = fs.readdirSync(srcPagePath, {
        encoding: 'utf-8',
    })
    return pageDirs
}
const pages = generatePages()

module.exports = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map', // source-map
    // 入口文件
    entry: pages.reduce(
        (prev, page) => ({
            ...prev,
            [`${page}/index`]: path.resolve(__dirname, `src/page/${page}/index.ts`),
        }),
        {}
    ),
    // entry: {
    //     page1: path.resolve(__dirname, 'src/page1/index.ts')
    // },

    // 编译后放置的文件夹
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            // 静态文件处理
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                type: 'asset',
            },
            // ts 文件处理
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader', // 先执行
                    },
                ],
                exclude: '/node-modules',
            },
            {
                test: /\.(sc|c)ss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    // 'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    resolve: {
        // import 的时候可以不写 ts 后缀名
        extensions: ['.ts', '.js'],
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     template: 'src/page1/index.html',
        //     filename: 'page1.html',
        //     chunks: ['page1'],
        // }),
        // html 文件
        ...pages.map((page) => {
            return new HtmlWebpackPlugin({
                template: path.resolve(__dirname, `src/page/${page}/index.html`),
                filename: `${page}/index.html`,
                chunks: [`${page}/index`],
            })
        }),
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
    ],
    // 开发服务器配置
    // devServer: {
    //     port: 3010,
    //     hot: true,
    // }
}
