/*external modules*/
import { expect } from 'chai';
/*types*/
/*utils*/
import { isPureObject } from '@utils/index';
/*lib*/
/*helpers*/
/*other*/

describe('Unit utils/isPureObject', () => {
  it('should be return true for all pure objects', () => {
    [
      {},
      Object.create(null),
      {},
      Object.prototype,
    ].forEach((type) => expect(isPureObject(type)).to.be.true);
  });

  it('should be return false for all other objects', () => {
    const primitives = [
      5,
      BigInt(5),
      'string',
      Symbol('sym'),
      false,
      true,
      null,
      undefined,
    ];
    const objects = [
      [],
      function () { return undefined; },
      () => undefined,
      /x/g,
      new Promise((resolve) => { resolve(undefined); }),
      new Set(),
      new Map(),
      new WeakSet(),
      new WeakMap(),
      new Date(),
      [],
      Object.create({}),
    ];

    [...primitives, ...objects].forEach((type) => expect(isPureObject(type)).to.be.false);
  });
});
