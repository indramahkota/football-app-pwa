/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { resolve } = require('path');
const { merge } = require('webpack-merge');
const production = require('./webpack.prod');
const pwaPlugin = require('./pwa/pwa-plugin');

module.exports = merge(production, {
  plugins: [
    ...pwaPlugin
  ]
});
