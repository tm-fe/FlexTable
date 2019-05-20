const path = require('path');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');

const conifg = merge(webpackBaseConfig, {
    devtool: 'eval-source-map',
    mode: 'development'
});

delete conifg.entry;
module.exports = conifg;