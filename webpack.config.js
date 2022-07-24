/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const slsw = require('serverless-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  output: {
    libraryTarget: 'commonjs2',
    filename: '[name].js',
    path: path.join(__dirname, '.webpack'),
  },
  target: 'node',
  externals: ['aws-sdk'],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve('.webpackCache'),
            },
          },
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  stats: 'errors-only',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
        },
      }),
    ],
  },
  plugins: [
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const ignores = [
          'cache-manager',
          'class-transformer/storage',
          'fastify-swagger',
        ];

        return (
          resource.includes('@nestjs/microservices') ||
          resource.includes('@nestjs/websockets') ||
          ignores.includes(resource)
        );
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
};
