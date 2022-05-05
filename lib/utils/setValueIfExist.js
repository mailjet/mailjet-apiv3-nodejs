/**
 * @param {Object} targetObject
 * @param {string} path
 * @param {any} value
 *
 * @return {undefined} void
 */

function setValueIfExist(targetObject, path, value) {
  if(typeof targetObject !== 'object' || targetObject === null) {
    throw Error('argument target object is not object');
  }

  if(!path) {
    throw Error('argument path is required');
  }

  if (value) {
    targetObject[path] = value;
  }
}

module.exports = setValueIfExist;