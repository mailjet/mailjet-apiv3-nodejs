const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const DIST_PATH = path.join(__dirname, './dist');

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
  fs.renameSync(path.join(DIST_PATH, './lib'), path.join(DIST_PATH, './declarations'));

  // package.json
  const packageData = readJSONFile(path.join(__dirname, './package.json'));
  changePackageData(packageData);

  // common files
  fs.writeFileSync(path.join(DIST_PATH, './package.json'), Buffer.from(JSON.stringify(packageData, null, 2), 'utf-8').toString());
  fs.writeFileSync(path.join(DIST_PATH, './VERSION.md'), Buffer.from(packageData.version, 'utf-8').toString());

  fs.copyFileSync(path.join(__dirname, 'LICENSE'), path.join(DIST_PATH, './LICENSE'));
  fs.copyFileSync(path.join(__dirname, 'README.md'), path.join(DIST_PATH, './README.md'));
  fs.copyFileSync(path.join(__dirname, 'CHANGELOG.md'), path.join(DIST_PATH, './CHANGELOG.md'));

  // package-lock.json
  childProcess.execSync('npm i --prefix ./dist/ --package-lock-only');

  const packageLockData = readJSONFile(path.join(DIST_PATH, './package-lock.json'));
  changePackageLockData(packageLockData);

  fs.writeFileSync(path.join(DIST_PATH, './package-lock.json'), Buffer.from(JSON.stringify(packageLockData, null, 2), 'utf-8').toString());
}

main();
