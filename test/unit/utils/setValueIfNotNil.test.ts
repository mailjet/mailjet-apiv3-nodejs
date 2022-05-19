/*external modules*/
import { expect } from 'chai';
/*types*/
/*utils*/
import { setValueIfNotNil } from '@utils/index';
/*lib*/
/*helpers*/
/*other*/

describe('Unit utils/setValueIfNotNil', () => {
  it('should be set value by string path', () => {
    const obj = {};
    const sym = Symbol('sym');

    setValueIfNotNil(obj, 'number', 5);
    setValueIfNotNil(obj, 'bigint', BigInt(5));
    setValueIfNotNil(obj, 'string', 'string');
    setValueIfNotNil(obj, 'symbol', sym);
    setValueIfNotNil(obj, 'boolean', false);
    setValueIfNotNil(obj, 'null', null);
    setValueIfNotNil(obj, 'undefined', undefined);
    setValueIfNotNil(obj, 'object', {});

    expect(obj).to.deep.equal({
      number: 5,
      bigint: BigInt(5),
      string: 'string',
      symbol: sym,
      boolean: false,
      object: {},
    });
  });

  it('should be throw error if argument "targetObject" is not object', () => {
    ['', 5, true, undefined, null, Symbol(''), BigInt(5)].forEach((arg) => {
      expect(() => setValueIfNotNil(arg as any, 'count', 5))
        .to.throw(Error, 'Argument "targetObject" is not object');
    });
  });

  it('should be throw error if argument "path" is not passed', () => {
    [false, undefined, null].forEach((arg) => {
      expect(() => setValueIfNotNil({}, arg as any, 5))
        .to.throw(Error, 'Argument "path" is required');
    });
  });
});
