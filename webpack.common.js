const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: resolve(__dirname, 'src/index.js'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(xml)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: (url, context) => {    
                console.log(`${/assets\\icons\\msicon/.test(context)} ${context}`);
                if (/assets\\icons\\msicon/.test(context)) {
                  return `assets/icons/msicon/${url}`;
                }
                return `assets/xml/${url}`;
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/i,
        use: [
          {
            loader: "file-loader",
            options: { name: "assets/icons/fonticon/[name].[ext]" }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp|ico|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: (url, context) => {    
                console.log(`${/assets\\icons\\favicons/.test(context)} ${context}`);
                if (/assets\\icons\\favicons/.test(context)) {
                  return `assets/icons/favicons/${url}`;
                }
                if (/assets\\icons\\manifest/.test(context)) {
                  return `assets/icons/manifest/${url}`;
                }
                if (/assets\\icons\\msicon/.test(context)) {
                  return `assets/icons/msicon/${url}`;
                }
                return `assets/images/${url}`;
              }
            }
          }
        ]
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          minimize: true
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, 'public/'),
          to: resolve(__dirname, 'dist/')
        }
      ]
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/template.html",
      minify: { collapseWhitespace: true, removeComments: true }
    }),
    new CleanWebpackPlugin()
  ]
};
