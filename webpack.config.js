const webpack = require('webpack')
const { merge } = require('webpack-merge')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const baseConfig = {
  entry: {
    base: [
      './isimip_data/core/assets/scss/base.scss',
      './isimip_data/core/assets/js/base.js',
    ],
    download: [
      './isimip_data/download/assets/scss/download.scss',
      './isimip_data/download/assets/js/download.js',
    ],
    metadata: [
      './isimip_data/metadata/assets/scss/metadata.scss',
      './isimip_data/metadata/assets/js/metadata.js',
    ],
    resources: [
      './isimip_data/metadata/assets/scss/resources.scss',
      './isimip_data/metadata/assets/js/resources.js',
    ],
    search: [
      './isimip_data/search/assets/scss/search.scss',
      './isimip_data/search/assets/js/search.js',
    ]
  },
  resolve: {
    alias: {
      isimip_data: path.resolve(__dirname, './isimip_data/')
    },
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    libraryTarget: 'this',
    library: '[name]',
    path: path.resolve('./static/'),
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
        test: /\.(woff2?|ttf|eot|otf)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(svg|png|jpg)$/,
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          to: './/images/',
          context: './isimip_data/core/assets/images/'
        }
      ]
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
}

const developmentConfig = {
  devtool: 'eval',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}

const productionConfig = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
}

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    return merge(baseConfig, developmentConfig)
  } else {
    return merge(baseConfig, productionConfig)
  }
}
