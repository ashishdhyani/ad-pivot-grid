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
        test: /\.css$/,
        loader: 'style!css!'
      },
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