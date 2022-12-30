/*external modules*/
/*types*/
import { TObject } from '../types';
/*utils*/
import isNil from './isNil';
import isNull from './isNull';
/*lib*/
/*other*/

function setValueIfNotNil(
  targetObject: TObject.UnknownRec,
  path: string,
  value: unknown,
): void {
  if (typeof targetObject !== 'object' || isNull(targetObject)) {
    throw Error('Argument "targetObject" is not object');
  }

  if (!path) {
    throw Error('Argument "path" is required');
  }

  if (!isNil(value)) {
    targetObject[path] = value;
  }
}

export default setValueIfNotNil;
