const childProcess = require('child_process');
const packageJSON = require('../package.json');

const VERSION_NUMBER = {
  MAJOR: 'major',
  MINOR: 'minor',
  PATCH: 'patch',
};

const VERSION_NUMBER_IMPORTANCE = {
  [VERSION_NUMBER.MAJOR]: 3,
  [VERSION_NUMBER.MINOR]: 2,
  [VERSION_NUMBER.PATCH]: 1,
};

const VERSION_NUMBER_BUMP = {
  [VERSION_NUMBER.MAJOR]: [1, 0, 0],
  [VERSION_NUMBER.MINOR]: [0, 1, 0],
  [VERSION_NUMBER.PATCH]: [0, 0, 1],
};

const TYPE_WITH_VERSION_NUMBER = {
  breaking: VERSION_NUMBER.MAJOR,
  remove: VERSION_NUMBER.MAJOR,
  feature: VERSION_NUMBER.MINOR,
  deprecate: VERSION_NUMBER.MINOR,
  fix: VERSION_NUMBER.PATCH,
  security: VERSION_NUMBER.PATCH, // or manual
  test: VERSION_NUMBER.PATCH,
  build: VERSION_NUMBER.PATCH,
  docs: VERSION_NUMBER.PATCH,
  other: VERSION_NUMBER.PATCH, // or manual
};

function evaluateCommits(packageVersion) {
  const commitTypes = Object.keys(TYPE_WITH_VERSION_NUMBER);
  const rawCommits = childProcess.execSync(`git log --pretty=format:"%s" v${packageVersion}...HEAD`, { encoding: 'utf-8' });

  let isUsedBreakingChangesFlag = false;
  const types = rawCommits
    .split('\n')
    .map((commit) => {
      const message = commit.trim();
      let type = message.slice(0, message.indexOf(':'));

      if (type.endsWith('!')) {
        isUsedBreakingChangesFlag = true;
        type = type.slice(0, type.length - 1);
      }

      if (type.endsWith(')')) {
        type = type.slice(0, type.indexOf('('));
      }

      return type;
    })
    .filter((commitType) => commitTypes.includes(commitType));

  return {
    isUsedBreakingChangesFlag,
    types,
  };
}

function increaseVersion(parsedVersion, versionBumps) {
  const result = [];

  /*eslint no-continue: 0*/
  for (let index = 0; index < versionBumps.length; index += 1) {
    const versionBump = versionBumps[index];
    if (versionBump !== 1) {
      result.push(parsedVersion[index]);
      continue;
    }

    const currentVersion = parsedVersion[index];
    result.push(currentVersion + versionBump);

    if (result.length < 3) {
      result.push(
        ...Array(versionBumps.length - result.length).fill(0),
      );
    }

    break;
  }

  return result;
}

function receiveVersionNumber(commitTypes) {
  let importance = 0;

  commitTypes.forEach((commitType) => {
    const versionNumber = TYPE_WITH_VERSION_NUMBER[commitType];
    const versionImportance = VERSION_NUMBER_IMPORTANCE[versionNumber];

    if (importance < versionImportance) {
      importance = versionImportance;
    }
  });

  return Object
    .entries(VERSION_NUMBER_IMPORTANCE)
    .find(([, versionImportance]) => versionImportance === importance)[0];
}

function calculateVersionBump(packageVersion, isUsedBreakingChangesFlag, commitTypes) {
  const parsedVersion = packageVersion.split('.').map((v) => Number(v));

  if (isUsedBreakingChangesFlag) {
    return increaseVersion(parsedVersion, VERSION_NUMBER_BUMP[VERSION_NUMBER.MAJOR]);
  }

  const versionNumber = receiveVersionNumber(commitTypes);
  return increaseVersion(parsedVersion, VERSION_NUMBER_BUMP[versionNumber]);
}

function main() {
  const oldVersion = packageJSON.version;

  const { isUsedBreakingChangesFlag, types } = evaluateCommits(oldVersion);
  if (types.length === 0) {
    throw new Error('Not found commits with type!');
  }

  const newVersion = calculateVersionBump(oldVersion, isUsedBreakingChangesFlag, types);
  process.stdout.write(newVersion.join('.'));
}

main();
