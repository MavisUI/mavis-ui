/*
{
  test: /\.html$/,
  loader: 'html-loader',
  exclude: new RegExp(`${PATH_CONFIG.MAIN}/index.html`)
},
*/

const {resolve} = require('./utils');
const {PATH_CONFIG, RESOLVE_CONFIG,DEFAULT_CONFIG} = require('./config');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");


const ExtractCssPlugin = new ExtractTextPlugin({filename: 'styles.css', disable: process.env.NODE_ENV === 'development'});
const cssLoader = ExtractCssPlugin.extract(['css-loader','autoprefixer-loader']);
const lessLoader = ExtractCssPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader','autoprefixer-loader','less-loader']
});

const path = require("path");
const ASSET_PATH = process.env.ASSET_PATH || '/';

var htmlPlugin = new HtmlWebpackPlugin({filename: 'index.html', template: resolve(`${PATH_CONFIG.MAIN}/index.html`), inject: true, title: DEFAULT_CONFIG.TITLE});

module.exports = {
  target:'node-webkit',
  entry: {
    app: resolve(PATH_CONFIG.MAIN)
  },
  output: {
    path: resolve(PATH_CONFIG.OUTPUT),
    publicPath: ASSET_PATH,
    filename: '[name].js',
    chunkFilename: '[hash].js'
  },
  resolve: {
    extensions: RESOLVE_CONFIG.EXTENSIONS,
    modules: [resolve('node_modules')],
    alias: RESOLVE_CONFIG.ALIAS
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: "three",
      three: "three"
    }),
    new webpack.ProvidePlugin({
      highcharts: "highcharts",
      Highcharts: "highcharts"
    }),
    new webpack.ProvidePlugin({
      ColorPicker: "flexi-color-picker"
    }),
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    }),
    new CopyWebpackPlugin([
      {from:'app/data',to:'data'}
    ]),
    htmlPlugin,
    ExtractCssPlugin
  ],
  resolveLoader: {
    modules: [resolve('node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: [
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter')
            }
          }
        ],
        exclude: /node_modules/
      }, {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'stage-2', 'react'],
              plugins: ['transform-decorators-legacy', 'transform-runtime']
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test  : /\.html$/,
        loader: 'html-loader',
        query : {
          name: "[name].[ext]"
        }
      }, {
        test: /\.css$/,
        loader: cssLoader
      }, {
        test: /\.less$/,
        loader: ['css-hot-loader'].concat(lessLoader)
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.(png|jpg|gif|svg|jpeg|jpg)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'assets/[name].[ext]?[hash]'
        }
      }, {
        test: /\.((eot|woff|ttf)[\?]?.*)$/,
        loader: 'url-loader',
        query: {
          name: 'assets/fonts/[name].[ext]?[hash]'
        }
      }
    ]
  }
};
