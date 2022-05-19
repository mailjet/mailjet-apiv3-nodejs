/*external modules*/
/*types*/
/*utils*/
import isNull from './isNull';
import isUndefined from './isUndefined';
/*lib*/
/*other*/

function isNil(value: unknown): boolean {
  return isUndefined(value) || isNull(value);
}

export default isNil;
