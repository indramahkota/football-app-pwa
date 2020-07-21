const path = require("path");
const workboxPlugin = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
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
                if (/assets\\icons\\maskicon/.test(context)) {
                  return `assets/icons/maskicon/${url}`;
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
      template: "./src/template.html"
    }),
    new workboxPlugin.InjectManifest({
      swSrc: "./src/service-worker.js",
      swDest: "sw.js"
    }),
    new WebpackPwaManifest({
      name: "Football App",
      short_name: "Football App",
      description: "Football App by Indra Mahkota",
      gcm_sender_id: "792532488211",
      start_url: "/",
      display: "standalone",
      background_color: "#00ACC1",
      theme_color: "#00ACC1",
      fingerprints: false,
      ios: true,
      icons: [
        {
          src: path.resolve("src/assets/icons/manifest/icon-36x36.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "36x36",
          type: "image/png"
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-48x48.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "48x48",
          type: "image/png"
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-57x57.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "57x57",
          type: "image/png",
          ios: true
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-72x72.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "72x72",
          type: "image/png",
          ios: true
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-76x76.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "76x76",
          type: "image/png",
          ios: true
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-96x96.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "96x96",
          type: "image/png"
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-114x114.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "114x114",
          type: "image/png",
          ios: true
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-120x120.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "120x120",
          type: "image/png",
          ios: true
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-128x128.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "128x128",
          type: "image/png"
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-144x144.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "144x144",
          type: "image/png",
          ios: true
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-152x152.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "152x152",
          type: "image/png",
          ios: true
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-180x180.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "180x180",
          type: "image/png",
          ios: true
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-192x192.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-384x384.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "384x384",
          type: "image/png"
        },
        {
          src: path.resolve("src/assets/icons/manifest/icon-512x512.png"),
          destination: path.join("assets", "icons", "manifest"),
          sizes: "512x512",
          type: "image/png"
        }
      ]
    })
  ]
};
