const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    base: [
      './isimip_data/core/assets/core/scss/base.scss',
      './isimip_data/core/assets/core/js/base.js',
    ],
    home: [
      './isimip_data/core/assets/core/scss/home.scss',
      './isimip_data/core/assets/core/js/home.js',
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  output: {
    libraryTarget: 'this',
    library: '[name]',
    path: path.resolve('./static/'),
    publicPath: '/static/',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /(fonts|files)\/.*\.(svg|woff2?|ttf|eot|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.svg$|\.png$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new CopyWebpackPlugin([
      {
        from: '**/*',
        to: './/images/',
        context: './isimip_data/core/assets/core/images/',
      }
    ])
  ]
}
