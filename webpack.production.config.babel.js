import fs from 'fs';
import path from 'path';
import glob from 'glob';
import webpack from 'webpack';
import PurifyCSSPlugin from 'purifycss-webpack';
import SWPrecache from 'sw-precache-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const mainPath = path.resolve(__dirname, 'src', 'index.js');
const buildPath = path.resolve(__dirname, 'github-profiler');

const config = {
    entry: {
        app: [mainPath],
        vendor: ['preact']
    },
    output: {
        path: buildPath,
        filename: '[name].js',
        publicPath: '/github-profiler/'
    },

    resolve: {
        alias: {
            react: 'preact-compat',
            'react-dom': 'preact-compat',
            // Not necessary unless you consume a module using `createClass`
            'create-react-class': 'preact-compat/lib/create-react-class'
        },
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: [path.resolve('src'), path.resolve('node_modules/preact-compat/src')],
                loader: 'babel-loader',
            },
            { test: /\.(png|woff|woff2|eot|ttf|svg|ico)$/, loader: 'url-loader?limit=100000' },
            { test: /\.scss$/, loaders: ExtractTextPlugin.extract('css-loader!sass-loader') }

        ]

    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: 0
            },
            sourceMap: false,
            compress: {
                unused: 1,
                warnings: 0,
                comparisons: 1,
                conditionals: 1,
                negate_iife: 0, // <- for `LazyParseWebpackPlugin()`
                dead_code: 1,
                if_return: 1,
                join_vars: 1,
                evaluate: 1
            }
        }),
        new ExtractTextPlugin({
            filename: 'styles.css',
            disable: false,
            allChunks: true
        }),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'github-profiler/*.**')),
            moduleExtensions: ['.html', '.js'],
            verbose: true,
            purifyOptions: {
                minify: true
            }
        }),
        new HtmlWebpackPlugin({
            template: 'prod-index.html',
            filename: 'index.html',
            inject: false,
            vendor: fs.readFileSync('github-profiler/vendor.js', 'utf8'),
            app: fs.readFileSync('github-profiler/app.js', 'utf8'),
            style: fs.readFileSync('github-profiler/styles.css', 'utf8'),
            excludeChunks: ['admin']
        }),
        new CopyWebpackPlugin([
            {from: 'assets', to: 'assets'},
            {from: 'manifest.json', to: '.'}
            // {from: 'CNAME', to: '.'}
        ]),
        new SWPrecache({
            cacheId: 'githubprofiler',
            minify: true,
            skipWaiting: true,
            filepath: 'github-profiler/service-worker.js',
            navigateFallback: 'index.html',
            staticFileGlobsIgnorePatterns: [/\.map$/, /\.DS_Store/],
            mergeStaticsConfig: false,
            runtimeCaching: [
                {
                    urlPattern: '/',
                    handler: 'cacheFirst',
                }
            ]
        })
    ]
};

module.exports = config;
