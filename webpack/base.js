const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");

module.exports = {
  entry: {
    bundle: "./src/index.js",
    worker: "./src/service-worker.js",
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].js",
  },
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.(eot|ttf|woff|woff2|png|webp|ico|xml)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          minimize: true,
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      favicon: "./src/assets/icons/favicons/favicon.ico",
      filename: "index.html",
    }),
    new WebpackPwaManifest({
      name: "Football App",
      short_name: "Football App",
      description: "Football App by Indra Mahkota",
      icons: [
        {
          src: "./src/assets/icons/manifest-icons/android-icon-36x36.png",
          sizes: "36x36",
          type: "image/png",
          density: "0.75",
        },
        {
          src: "./src/assets/icons/manifest-icons/android-icon-48x48.png",
          sizes: "48x48",
          type: "image/png",
          density: "1.0",
        },
        {
          src: "./src/assets/icons/manifest-icons/android-icon-72x72.png",
          sizes: "72x72",
          type: "image/png",
          density: "1.5",
        },
        {
          src: "./src/assets/icons/manifest-icons/android-icon-96x96.png",
          sizes: "96x96",
          type: "image/png",
          density: "2.0",
        },
        {
          src: "./src/assets/icons/manifest-icons/android-icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
          density: "3.0",
        },
        {
          src: "./src/assets/icons/manifest-icons/android-icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          density: "4.0",
        },
        {
          src: "./src/assets/icons/manifest-icons/android-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          density: "4.0",
        },
      ],
      start_url: "/index.html",
      display: "standalone",
      background_color: "#3E4EB8",
      theme_color: "#2F3BA2",
      fingerprints: false
    }),
  ],
};
