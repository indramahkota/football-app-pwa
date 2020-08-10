const path = require("path");
const workboxPlugin = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PWAManifestData = require("./manifest-data.js");

module.exports = {
  entry: {
    materializecss: "materialize-css",
    polyfill: "babel-polyfill",
    bundle: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js"
  },
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
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
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/template.html",
      minify: { collapseWhitespace: true, removeComments: true }
    }),
    new WebpackPwaManifest(PWAManifestData),
    new workboxPlugin.InjectManifest({
      swSrc: "./src/service-worker.js",
      swDest: "sw.js",
      maximumFileSizeToCacheInBytes: 5000000
    })
  ]
};
