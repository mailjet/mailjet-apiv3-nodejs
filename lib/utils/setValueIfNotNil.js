/*external modules*/
/*lib*/
/*utils*/
import isNil from './isNil.js';
import isNull from './isNull.js';
/*other*/

/**
 * @param {Object} targetObject
 * @param {string} path
 * @param {any} value
 *
 * @return {undefined} void
 */

function setValueIfNotNil(targetObject, path, value) {
  if(typeof targetObject !== 'object' || isNull(targetObject)) {
    throw Error('Argument "targetObject" is not object');
  }

  if(!path) {
    throw Error('Argument "path" is required');
  }

  if(!isNil(value)) {
    targetObject[path] = value;
  }
}

export default setValueIfNotNil;