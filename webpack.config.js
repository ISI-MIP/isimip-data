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
    bootstrap: [
      './isimip_data/core/assets/scss/bootstrap.scss',
      './isimip_data/core/assets/js/bootstrap.js',
    ],
    download: [
      './isimip_data/download/assets/scss/download.scss',
      './isimip_data/download/assets/js/download.js',
    ],
    metadata: [
      './isimip_data/metadata/assets/js/metadata.js',
    ],
    resources: [
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
    extensions: ['*', '.js', '.jsx'],
    fallback: {
      buffer: require.resolve('buffer/'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env','@babel/preset-react'] }
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
        type: 'javascript/auto',
        options: {
          name: 'fonts/[name].[ext]',
          esModule: false
        }
      },
      {
        test: /\.(svg|png|jpg)$/,
        loader: 'file-loader',
        type: 'javascript/auto',
        options: {
          name: 'images/[name].[ext]',
          esModule: false
        }
      }
    ]
  },
  output: {
    path: path.resolve('./static/'),
    filename: '[name].js'
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
      Buffer: ['buffer', 'Buffer'],
    }),
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
