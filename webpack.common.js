const path = require ('path')

module.exports = {
    entry: {
        index: './src/index.js',
        'data-table': './src/data-table-factory.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve (__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/preset-env' ]
                    }
                }
            }
        ]
    }
}