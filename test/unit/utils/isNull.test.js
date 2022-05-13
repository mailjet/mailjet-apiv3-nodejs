/*external modules*/
import chai from 'chai';
/*lib*/
/*utils*/
import { isNull } from '../../../lib/utils/index.js';
/*helpers*/
/*other*/

const expect = chai.expect;

describe('Unit utils/isNull', () => {

  it('should be return true for null', () => {
    expect(isNull(null)).to.be.true;
  });

  it('should be return false for all not null types', () => {
    [
      5,
      BigInt(5),
      'string',
      Symbol('sym'),
      false,
      true,
      {},
      undefined
    ].forEach(type => {
      expect(isNull(type)).to.be.false;
    });
  });

});