const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    base: [
      './isimip_data/core/assets/scss/base.scss',
      './isimip_data/core/assets/js/base.js',
    ],
    search: [
      './isimip_data/search/assets/scss/search.scss',
      './isimip_data/search/assets/js/search.js',
    ],
    wizard: [
      './isimip_data/wizard/assets/scss/wizard.scss',
      './isimip_data/wizard/assets/js/wizard.js',
    ]
  },
  resolve: {
    alias: {
      isimip_data: path.resolve(__dirname, '../isimip_data/')
    },
    extensions: ['*', '.js', '.jsx']
  },
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
        test: /\.svg$|\.png$|\.jpg$/,
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
        context: './isimip_data/core/assets/images/',
      }
    ])
  ]
}
