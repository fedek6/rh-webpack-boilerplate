const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nunjucks = require('nunjucks');
const { join, resolve } = require("path");

const paths = require('./paths');

module.exports = {
  resolve: {
    alias: {
      'images': resolve('src/images'),
      'fonts': resolve('src/fonts'),
    }
  },
  context: paths.src,
  entry: {
    app: `./scripts/index.js`,
  },
  output: {
    filename: `scripts/[name].[hash:8].js`,
    path: paths.build,
  },
  devServer: {
    port: 8080,
    contentBase: './src',
    watchContentBase: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
              url: true
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer', 'postcss-flexbugs-fixes'],
              },
              sourceMap: true,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              debug: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            preprocessor: async (content, loaderContext) => {
              let result;
              let env = nunjucks.configure([join(__dirname, "../src/")], { autoescape: true });

              try {
                result = content;
                result = nunjucks.renderString(content);
              } catch (error) {
                await loaderContext.emitError(error);
  
                return content;
              }
              
              return result;
            },
          },
        }
      },

      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: './fonts',
            outputPath: './fonts',
            name: '[name].[hash:8].[ext]',
            esModule: false
          },
        },
      },
      // Propper path for html img tags.
      {
        test: /\.(gif|ico|jpe?g|png|svg|webp)$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: './images',
            outputPath: './images',
            name: '[name].[hash:8].[ext]',
            esModule: false
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.static,
        },
      ],
    }),
  ],
};
