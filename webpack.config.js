var path = require('path');
var webpack = require('webpack');

module.exports = {
  devServer: {
    inline: true,
    contentBase: './src',
    port: 3000
  },
  devtool: 'source-map',
  entry: './dev/js/index.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.scss/,
        loaders: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.css$/,
        loader: 'style!css!'
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'src'),
    publicPath: '/js/',
    filename: 'bundle.min.js',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin()
  ]
};