const { merge } = require("webpack-merge");
const base = require("./base");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");

/* Babel-Polyfill vs Babel-Transform-Runtime */
/* If you're building an app, you can use babel-polyfill. If you're building a library, make sure not to use babel-polyfill, and only the transform-runtime. */
/* ref: https://gist.github.com/CMCDragonkai/7fb6b279bb667f3c194994b2f2ccedae#:~:text=The%20main%20difference%20is%20that,provide%20special%20functions%20like%20array. */
module.exports = merge(base, {
  mode: "production",
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new FileManagerPlugin({
      onEnd: {
        copy: [
          { source: "dist", destination: "../indramahkota.github.io/" },
          { source: "dist", destination: "../indramahkota.info/public/" }
        ]
      }
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.m?js$/,
        terserOptions: {
          output: {
            comments: false
          },
          compress: {
            drop_console: true
          }
        },
        extractComments: false
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorPluginOptions: {
          preset: ["default", { discardComments: { removeAll: true } }]
        },
        canPrint: true
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]/* ,
            plugins: ["@babel/plugin-transform-runtime"] */
          }
        }
      }
    ]
  }
});
