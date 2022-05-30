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
  const isNodeTarget = targetEnv === TARGET_ENV.NODE;

  const target = isNodeTarget ? NODE_VERSION : ['web', 'es5'];
  const mainFields = isNodeTarget ? ['main', 'module'] : ['browser', 'main', 'module'];

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
              loader: 'ts-loader',
              options: {
                configFile: path.join(MAIN_DIR, 'tsconfig.webpack.json'),
              },
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
      mainFields,
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
        export: 'default',
      },
    },
  };
  const webConfigPart = {
    output: {
      filename: `${LIBRARY_NAME}.web.js`,
      library: {
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
