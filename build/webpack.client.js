const path = require('path');
const WebpackDefinePlugin = require('webpack').DefinePlugin;
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

const baseConfig = require('./webpack.base');

const { serverEntry, serverBundleName } = require('./const');

module.exports = merge(baseConfig, {
  entry: serverEntry,
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'vue-style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.css?$/,
        include: [path.resolve('node_modules')],
        use: [
          {
            loader: 'vue-style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              publicPath: '../',
            },
          },
        ],
      },
    ],
  },
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
  },
  externals: nodeExternals({
    whitelist: [/\.css$/, /\.less$/, /\.vue$/],
  }),
  plugins: [
    new VueSSRServerPlugin({
      filename: `../server/ssr/${serverBundleName}`,
    }),
    new WebpackDefinePlugin({
      VUE_ENV: 'server',
    }),
  ],
});
