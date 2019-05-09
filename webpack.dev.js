const merge = require ('webpack-merge')
const common = require ('./webpack.common.js')
const HtmlWebpackPlugin = require ('html-webpack-plugin')
const CleanWebpackPlugin = require ('clean-webpack-plugin')

module.exports = merge (common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new CleanWebpackPlugin (),
        new HtmlWebpackPlugin ({
            template: 'src/index.html'
        })
    ]
})