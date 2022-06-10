/*external modules*/
import { expect } from 'chai';
/*types*/
/*utils*/
/*lib*/
/*other*/

function expectOwnProperty(targetObject: unknown, path: string, value: unknown) {
  return expect(targetObject).to.have.ownProperty(path, value);
}

export default expectOwnProperty;
