/*external modules*/
import { expect } from 'chai';
/*types*/
/*utils*/
import { isUndefined } from '../../../lib/utils';
/*lib*/
/*helpers*/
/*other*/

describe('Unit utils/isUndefined', () => {
  it('should be return true for undefined', () => expect(isUndefined(undefined)).to.be.true);

  it('should be return false for all not undefined types', () => {
    [
      5,
      BigInt(5),
      'string',
      Symbol('sym'),
      false,
      true,
      {},
      null,
    ].forEach((type) => expect(isUndefined(type)).to.be.false);
  });
});
