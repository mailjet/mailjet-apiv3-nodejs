const START_KEY_SENTENCE = 'https://img.shields.io/badge/version-';
const END_KEY_SENTENCE = '-green.svg';

function getVersion(content) {
  const startIndex = content.indexOf(START_KEY_SENTENCE) + START_KEY_SENTENCE.length;
  const endIndex = content.indexOf(END_KEY_SENTENCE);

  return content.slice(startIndex, endIndex);
}

module.exports.readVersion = function (content) {
  return getVersion(content);
};

module.exports.writeVersion = function (content, newVersion) {
  const oldVersion = getVersion(content);

  return content.replace(
    `${START_KEY_SENTENCE}${oldVersion}${END_KEY_SENTENCE}`,
    `${START_KEY_SENTENCE}${newVersion}${END_KEY_SENTENCE}`,
  );
};
