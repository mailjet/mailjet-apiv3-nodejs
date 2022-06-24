const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const ROOT_DIR = path.join(__dirname, '../');
const DIST_PATH = path.join(ROOT_DIR, './dist');

const LIB_PATH = path.join(DIST_PATH, './lib');
const DECLARATIONS_PATH = path.join(DIST_PATH, './declarations');

function readJSONFile(filePath) {
  const source = fs.readFileSync(filePath).toString('utf-8');
  return JSON.parse(source);
}

function changePackageData(packageData) {
  delete packageData.scripts;
  delete packageData.directories;
  delete packageData.devDependencies;
  delete packageData['standard-version'];

  packageData.private = false;
  packageData.files = ['*'];

  Object
    .entries(packageData)
    .forEach(([key, value]) => {
      if (key === 'typescript') {
        packageData[key].definition = value.definition.replace('./dist/', './');
      } else if (typeof value === 'string' && value.startsWith('./dist/')) {
        packageData[key] = value.replace('./dist/', './');
      }
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

  // package-lock.json
  childProcess.execSync('npm i --prefix ./dist/ --package-lock-only');

  const packageLockData = readJSONFile(path.join(DIST_PATH, './package-lock.json'));
  changePackageLockData(packageLockData);

  fs.writeFileSync(path.join(DIST_PATH, './package-lock.json'), Buffer.from(JSON.stringify(packageLockData, null, 2), 'utf-8').toString());
}

main();
