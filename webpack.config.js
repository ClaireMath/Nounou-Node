const path = require('path');
const webpack = require ('webpack');
const nodeExternals = require ('webpack-node-externals');

module.exports = {
    entry: './SRC/server.js',
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
    },
};