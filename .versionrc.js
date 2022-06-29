module.exports = {
  commitUrlFormat: 'https://github.com/mailjet/mailjet-apiv3-nodejs/commits/{{hash}}',
  compareUrlFormat: 'https://github.com/mailjet/mailjet-apiv3-nodejs/compare/{{previousTag}}...{{currentTag}}',
  bumpFiles: [
    {
      filename: 'package.json',
      type: 'json',
    },
    {
      filename: 'package-lock.json',
      type: 'json',
    },
    {
      filename: 'README.md',
      updater: './scripts/standardVersionUpdater.js',
    },
  ],
  types: [
    {
      type: 'breaking',
      section: 'Breaking changes',
    },
    {
      type: 'security',
      section: 'Dependency changes for security',
    },
    {
      type: 'feature',
      section: 'Added features',
    },
    {
      type: 'deprecate',
      section: 'Deprecated features',
    },
    {
      type: 'remove',
      section: 'Removed features',
    },
    {
      type: 'fix',
      section: 'Bug Fixes',
    },
    {
      type: 'test',
      section: 'Tests',
    },
    {
      type: 'build',
      section: 'Build changes',
    },
    {
      type: 'docs',
      section: 'Docs changes',
    },
    {
      type: 'other',
      section: 'Other changes',
    },
    {
      type: 'chore',
      hidden: true,
    },
  ],
  scripts: {
    prerelease: 'npm run pkg:precommit',
    prebump: 'node ./scripts/VersionBump.js',
    postchangelog: 'npm run build && npm run docs',
    precommit: 'git add -A',
    posttag: 'git push && git push --tags',
  },
};
