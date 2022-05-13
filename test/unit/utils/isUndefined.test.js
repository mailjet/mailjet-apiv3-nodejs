/*external modules*/
import chai from 'chai';
/*lib*/
/*utils*/
import { isUndefined } from '../../../lib/utils/index.js';
/*helpers*/
/*other*/

const expect = chai.expect;

describe('Unit utils/isUndefined', () => {

  it('should be return true for undefined', () => {
    expect(isUndefined(undefined)).to.be.true;
  });

  it('should be return false for all not undefined types', () => {
    [
      5,
      BigInt(5),
      'string',
      Symbol('sym'),
      false,
      true,
      {},
      null
    ].forEach(type => {
      expect(isUndefined(type)).to.be.false;
    });
  });

});