const path = require('path');

const LIBRARY_NAME = 'mailjet';

const MAIN_DIR = path.join(__dirname, '../');
const OUTPUT_DIR = path.join(MAIN_DIR, './dist');

const EXCLUDED_DIRS = /(node_modules|test|examples)/;

const MODE = {
  DEV: 'development',
  PROD: 'production',
};

const TARGET_ENV = {
  NODE: 'node',
  WEB: 'web',
};

const NODE_VERSION = 'node12.0';

module.exports = {
  LIBRARY_NAME,
  MAIN_DIR,
  OUTPUT_DIR,
  EXCLUDED_DIRS,
  MODE,
  TARGET_ENV,
  NODE_VERSION,
};
