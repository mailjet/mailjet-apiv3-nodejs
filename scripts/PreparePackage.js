import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

const ROOT_DIR = path.join(__dirname, '../');
const DIST_PATH = path.join(ROOT_DIR, './dist');

const LIB_PATH = path.join(DIST_PATH, './lib');
const DECLARATIONS_PATH = path.join(DIST_PATH, './declarations');

function readJSONFile(filePath) {
  const source = fs.readFileSync(filePath).toString('utf-8');
  return JSON.parse(source);
}

function rewriteDistPaths(value) {
  if (typeof value === 'string') {
    return value.startsWith('./dist/') ? value.replace('./dist/', './') : value;
  }
  if (value !== null && typeof value === 'object') {
    Object
      .entries(value)
      .forEach(([key, nestedValue]) => {
        value[key] = rewriteDistPaths(nestedValue);
      });
  }
  return value;
}

function changePackageData(packageData) {
  delete packageData.scripts;
  delete packageData.directories;
  delete packageData.devDependencies;

  packageData.private = false;
  packageData.files = ['*'];

  Object
    .entries(packageData)
    .forEach(([key, value]) => {
      packageData[key] = rewriteDistPaths(value);
    });
}

function changePackageLockData(packageLockData) {
  delete packageLockData.packages;
}

function main() {
  // ts declarations
  if (fs.existsSync(DECLARATIONS_PATH) && fs.existsSync(LIB_PATH)) {
    fs.rmSync(DECLARATIONS_PATH, { recursive: true });
  }
  fs.renameSync(LIB_PATH, DECLARATIONS_PATH);

  // package.json
  const packageData = readJSONFile(path.join(ROOT_DIR, './package.json'));
  changePackageData(packageData);

  // common files
  fs.writeFileSync(path.join(DIST_PATH, './package.json'), Buffer.from(JSON.stringify(packageData, null, 2), 'utf-8').toString());
  fs.writeFileSync(path.join(DIST_PATH, './VERSION.md'), Buffer.from(packageData.version, 'utf-8').toString());

  fs.copyFileSync(path.join(ROOT_DIR, 'LICENSE'), path.join(DIST_PATH, './LICENSE'));
  fs.copyFileSync(path.join(ROOT_DIR, 'README.md'), path.join(DIST_PATH, './README.md'));
  fs.copyFileSync(path.join(ROOT_DIR, 'CHANGELOG.md'), path.join(DIST_PATH, './CHANGELOG.md'));
  fs.copyFileSync(path.join(ROOT_DIR, 'esm/mailjet.mjs'), path.join(DIST_PATH, './mailjet.mjs'));

  // package-lock.json
  childProcess.execSync('npm i --prefix ./dist/ --package-lock-only');

  const packageLockData = readJSONFile(path.join(DIST_PATH, './package-lock.json'));
  changePackageLockData(packageLockData);

  fs.writeFileSync(path.join(DIST_PATH, './package-lock.json'), Buffer.from(JSON.stringify(packageLockData, null, 2), 'utf-8').toString());
}

main();
