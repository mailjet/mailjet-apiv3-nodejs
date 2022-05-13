/*external modules*/
import chai from 'chai';
/*lib*/
/*other*/

function expectOwnProperty(targetObject, path, value) {
  return chai.expect(targetObject).to.have.ownProperty(path, value);
}

export {
  expectOwnProperty
};