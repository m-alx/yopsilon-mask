const helpers = require('./helpers');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'development', 
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [helpers.root('src'), 'node_modules']
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                    helpers.root('node_modules/@angular')
                ]
            },
            {
                test: /\.ts$/,
                ///loader: 'awesome-typescript-loader',/*
                use: [
                        {
                            loader: 'awesome-typescript-loader',
                            query: {

                                 //Use inline sourcemaps for "karma-remap-coverage" reporter

                                module: 'commonjs',
                                sourceMap: false,
                                inlineSourceMap: true,
                                compilerOptions: {
                                    removeComments: true
                                }
                            },
                        }
                        //,
                        //'angular-router-loader',
                        //'angular2-template-loader'
                    ],
                exclude: [/\.e2e\.ts$/]
            },
            {
                // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
                // Removing this will cause deprecation warnings to appear.
                test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                parser: { system: true },
            },
            {
                enforce: 'post',
                test: /\.(js|ts)$/,
                loader: 'istanbul-instrumenter-loader',
                query: {
                    esModules: true
                },
                include: helpers.root('src'),
                exclude: [/\.(e2e|spec)\.ts$/, /node_modules/]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'test')
        }),
        new webpack.ContextReplacementPlugin(
            /\@angular(\\|\/)core(\\|\/)f?esm5/, path.join(__dirname, './src')
        )
    ],
    performance: {
        hints: false
    },

    node: {
        global: true,
        crypto: 'empty',
        process: false,
        module: false,
        clearImmediate: false,
        setImmediate: false,
        fs: 'empty'
    }
};
