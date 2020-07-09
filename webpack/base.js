const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    bundle: "./src/index.js",
    worker: "./src/service-worker.js"
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
        exclude: /styles/,
        use: ["to-string-loader", "css-loader"]
      },
      {
        test: /\.css$/i,
        include: /styles/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/icons/fonticon/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(ico)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/images/[name].[ext]"
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
      favicon: "./src/assets/icons/favicons/favicon.ico"
    }),
    new WebpackPwaManifest({
      name: "Football App",
      short_name: "Football App",
      description: "Football App by Indra Mahkota",
      icons: [
        {
          src: path.resolve("src/assets/icons/manifest/icon-36x36.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "36x36",
          type: "image/png",
          density: "0.75"
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-48x48.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "48x48",
          type: "image/png",
          density: "1.0"
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-72x72.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "72x72",
          type: "image/png",
          density: "1.5"
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-96x96.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "96x96",
          type: "image/png",
          density: "2.0"
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-144x144.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "144x144",
          type: "image/png",
          density: "3.0"
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-192x192.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "192x192",
          type: "image/png",
          density: "4.0"
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-512x512.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "512x512",
          type: "image/png",
          density: "4.0"
        }
      ],
      start_url: "/index.html",
      display: "standalone",
      background_color: "#3E4EB8",
      theme_color: "#2F3BA2",
      fingerprints: false
    })
  ]
};
