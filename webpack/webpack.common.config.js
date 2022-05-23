/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const TSConfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const pkg = require('../package.json');

const {
  LIBRARY_NAME,
  MAIN_DIR,
  OUTPUT_DIR,
  MODE,
  EXCLUDED_DIRS,
  TARGET_ENV,
  NODE_VERSION,
} = require('./constants');

const buildBaseConfig = (targetEnv) => {
  const target = targetEnv === TARGET_ENV.NODE ? NODE_VERSION : ['web', 'es5'];

  return {
    target,
    mode: MODE.DEV,
    context: MAIN_DIR,
    entry: path.join(MAIN_DIR, './lib/index.ts'),
    output: {
      filename: `${LIBRARY_NAME}.js`,
      path: OUTPUT_DIR,
      library: LIBRARY_NAME,
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: ['@babel/preset-env'],
              },
            },
            {
              loader: `ts-loader?configFile=${path.join(MAIN_DIR, 'tsconfig.webpack.json')}`,
            },
          ],
          exclude: EXCLUDED_DIRS,
        },
      ],
    },
    plugins: [
      new webpack.BannerPlugin(`${pkg.name} v${pkg.version}`),
    ],
    resolve: {
      extensions: ['.ts', '.js'/* ,'.json'*/],
      plugins: [
        new TSConfigPathsWebpackPlugin({
          configFile: path.join(MAIN_DIR, 'tsconfig.json'),
          logLevel: 'info',
        }),
      ],
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: 5000,
      ignored: ['../**/dist/*', '**/node_modules'],
    },
    devtool: 'inline-source-map',
  };
};

const buildUsageConfig = (targetEnv, mode) => {
  const isNodeEnv = targetEnv === TARGET_ENV.NODE;
  const isProdMode = mode === MODE.PROD;

  const baseConfig = buildBaseConfig(targetEnv);

  const prodConfigPart = {
    mode: MODE.PROD,
    devtool: undefined,
    watchOptions: undefined,
    optimization: {
      minimize: true,
      minimizer: [
        new TerserWebpackPlugin({
          parallel: true,
          terserOptions: {
            keep_classnames: true,
          },
        }),
      ],
    },
  };
  const nodeConfigPart = {
    output: {
      filename: `${LIBRARY_NAME}.node.js`,
      library: {
        name: LIBRARY_NAME,
        type: 'umd',
        export: 'default', // TODO: remove ?
      },
    },
  };
  const webConfigPart = {
    output: {
      filename: `${LIBRARY_NAME}.web.js`,
      library: {
        // TODO: add name ?
        type: 'amd',
      },
    },
  };

  return merge([
    baseConfig,
    isProdMode ? prodConfigPart : {},
    isNodeEnv ? nodeConfigPart : webConfigPart,
  ]);
};

module.exports = {
  buildBaseConfig,
  buildUsageConfig,
};
