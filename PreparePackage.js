const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

function readJSONFile(filePath) {
  const source = fs.readFileSync(filePath).toString('utf-8');
  return JSON.parse(source);
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
  const packageData = readJSONFile(path.join(__dirname, './package.json'));
  changePackageData(packageData);

  fs.writeFileSync(path.join(__dirname, './dist/package.json'), Buffer.from(JSON.stringify(packageData, null, 2), 'utf-8').toString());
  fs.writeFileSync(path.join(__dirname, './dist/VERSION.md'), Buffer.from(packageData.version, 'utf-8').toString());

  fs.copyFileSync(path.join(__dirname, 'LICENSE'), path.join(__dirname, './dist/LICENSE'));
  fs.copyFileSync(path.join(__dirname, 'README.md'), path.join(__dirname, './dist/README.md'));

  childProcess.execSync('npm i --prefix ./dist/ --package-lock-only');

  const packageLockData = readJSONFile(path.join(__dirname, './dist/package-lock.json'));
  changePackageLockData(packageLockData);

  fs.writeFileSync(path.join(__dirname, './dist/package-lock.json'), Buffer.from(JSON.stringify(packageLockData, null, 2), 'utf-8').toString());
}

main();
