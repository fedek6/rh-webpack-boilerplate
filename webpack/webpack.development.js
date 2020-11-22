'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');

const development = {
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    /*
    Add other templates like this:
    
    new HtmlWebpackPlugin({
      template: 'article.html',
      filename: 'article.html'
    }),
    */
  ],
  devtool: 'inline-source-map',
};

module.exports = development;
