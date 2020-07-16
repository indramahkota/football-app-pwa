const merge = require("webpack-merge");
const base = require("./base");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

/* npm install --save-dev @babel/plugin-transform-runtime */
/* Babel-Polyfill vs Babel-Transform-Runtime */
/* Summary: If you're building an app, you can use babel-polyfill. If you're building a library, make sure not to use babel-polyfill, and only the transform-runtime. */
/* ref: https://gist.github.com/CMCDragonkai/7fb6b279bb667f3c194994b2f2ccedae#:~:text=The%20main%20difference%20is%20that,provide%20special%20functions%20like%20array. */
module.exports = merge(base, {
  mode: "production",
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
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
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]/* ,
            plugins: ['@babel/plugin-transform-runtime'] */
          }
        }
      }
    ]
  }
});
