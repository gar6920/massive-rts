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
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              ['@babel/plugin-transform-private-methods', { loose: true }],
              ['@babel/plugin-transform-private-property-in-object', { loose: true }]
            ]
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
    extensions: ['.js'],
    fallback: {
      "buffer": false,
      "crypto": false,
      "fs": false,
      "path": false,
      "stream": false,
      "zlib": false
    }
  },
  devtool: 'source-map',
  performance: {
    hints: false,
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000
  }
}; 