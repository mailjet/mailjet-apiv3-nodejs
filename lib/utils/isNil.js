/*external modules*/
/*lib*/
/*utils*/
import isNull from './isNull.js';
import isUndefined from './isUndefined.js';
/*other*/

/**
 * @param {any} value
 *
 * @return {boolean} void
 */

function isNil(value) {
  return isUndefined(value) || isNull(value);
}

export default isNil;