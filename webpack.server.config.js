const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './server/server.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js'
  },
  externals: [nodeExternals({
    // Include Colyseus and other necessary packages in the bundle
    allowlist: ['colyseus', '@colyseus/schema', 'express', 'cors', '@colyseus/monitor']
  })],
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
      }
    ]
  },
  node: {
    __dirname: false
  },
  resolve: {
    extensions: ['.js']
  },
  performance: {
    hints: false,
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000
  }
}; 