/*external modules*/
/*lib*/
/*utils*/
/*other*/

/**
 * @param {any} value
 *
 * @return {boolean} void
 */

function isPureObject(value) {
  return typeof value === 'object'
    && value !== null
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}

export default isPureObject;