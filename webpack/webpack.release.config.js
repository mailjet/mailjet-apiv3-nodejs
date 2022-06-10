const { buildUsageConfig } = require('./webpack.common.config');
const { TARGET_ENV, MODE } = require('./constants');

module.exports = [
  buildUsageConfig(TARGET_ENV.NODE, MODE.PROD),
  buildUsageConfig(TARGET_ENV.WEB, MODE.PROD),
];
