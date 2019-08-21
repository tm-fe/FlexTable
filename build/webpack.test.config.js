const path = require('path');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

const conifg = merge(webpackBaseConfig, {
    devtool: 'eval-source-map',
    mode: 'development',
    resolve: {
        extensions: ['.js', '.vue', '.ts'],
        alias: {
            vue: 'vue/dist/vue.esm.js',
            '@': resolve('test/unit'),
        },
    },
});

delete conifg.entry;
module.exports = conifg;
