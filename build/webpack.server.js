const path = require('path');
const WebpackDefinePlugin = require('webpack').DefinePlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base');

const { isDevelopment, isProduction, isPre, clientEntry, manifestName } = require('./const');

const prod = isProduction || isPre;
const splitChunks = {
  cacheGroups: {
    default: {
      test(module, chunks) {
        return !/\.css$/.test(module.request);
      },
    },
    // vue相关独立拆分单独
    vue: {
      chunks: 'all',
      test: /[\\/]node_modules[\\/](vue|vue-router|vuex)/,
      name: 'vendor-framework',
      priority: 10,
    },
    // 工具相关库
    utility: {
      test: /[\\/]node_modules[\\/](lodash|axios|dayjs)/,
      chunks: 'all',
      name: 'vendor-utility',
      priority: 10,
    },
    // 其他
    vendor: {
      test: /[\\/]node_modules[\\/]/,
      chunks: 'all',
      name: 'vendor-common',
      priority: -100,
    },
  },
};

const optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      test: /\.js(\?.*)?$/i,
      sourceMap: true,
      cache: true,
      parallel: true,
    }),
  ],
  splitChunks: {
    ...splitChunks,
    name: false,
  },
  moduleIds: 'hashed',
  runtimeChunk: 'single',
};

const devOptimization = {
  sideEffects: true,
  splitChunks,
};

module.exports = merge(baseConfig, {
  entry: clientEntry,
  optimization: prod ? optimization : devOptimization,
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDevelopment,
              // if hmr does not work, this is a forceful method.
              reloadAll: true,
            },
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
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new WebpackDefinePlugin({
      VUE_ENV: 'client',
    }),
    new HtmlWebpackPlugin({
      template: 'client/template.html',
      filename: '../server/ssr/template.html',
      inject: false,
    }),

    new VueSSRClientPlugin({
      filename: `../server/${manifestName}`,
    }),

    new MiniCssExtractPlugin({
      filename: prod ? 'css/[name].[contenthash:8].css' : 'css/[name].css',
      chunkFilename: prod ? 'css/[id].[contenthash:8].css' : 'css/[id].css',
    }),

    // new BundleAnalyzerPlugin(),
  ],
});
