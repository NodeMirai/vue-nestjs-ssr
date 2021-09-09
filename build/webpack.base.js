const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const { sourceDir, isDevelopment, isProduction, isPre } = require('./const');

const prod = isProduction || isPre;

const webpackConfig = {
  mode: prod ? 'production' : 'development',
  watch: isDevelopment,
  context: path.resolve(__dirname, '../'),
  devtool: prod ? false : 'cheap-module-eval-source-map',
  output: {
    path: path.resolve(__dirname, '../dist-www'),
    filename: !isDevelopment ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    chunkFilename: !isDevelopment
      ? 'js/[name].[chunkhash:8].js'
      : 'js/[name].js',
    publicPath: prod
      ? '//ali-imgs.acfun.cn/kos/nlav10360/static/'
      : '/dist-www/',
  },
  // stats: { children: false, logging: 'warn', assets: false },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.tsx', '.jsx'],
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
      '@': sourceDir,
    },
  },
  module: {
    noParse: /^(vue|vue-router)$/,
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              appendTsxSuffixTo: ['\\.vue$'],
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // enable CSS extraction
          extractCSS: isProduction,
        },
      },
      {
        test: /\.js$/,
        include: [sourceDir],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg|woff|woff2|eot|ttf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: prod ? 'img/[name].[hash:8].[ext]' : 'img/[name].[ext]',
                },
              },
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};

module.exports = webpackConfig;
