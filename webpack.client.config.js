const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js', // Main client entry point
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'client.bundle.js',
    publicPath: '/js/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../images/'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  devtool: 'source-map'
}; 