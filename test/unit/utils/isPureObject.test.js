/*external modules*/
import chai from 'chai';
/*lib*/
/*utils*/
import { isPureObject } from '../../../lib/utils/index.js';
/*helpers*/
/*other*/

const expect = chai.expect;

describe('Unit utils/isPureObject', () => {

  it('should be return true for all pure objects', () => {
    [
      {},
      new Object(),
      Object.create(null),
      Object.assign({}),
      Object.prototype,
    ].forEach(type => {
      expect(isPureObject(type)).to.be.true;
    });
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
      function () {},
      () => {},
      /x/g,
      new Promise(() => {}),
      new Set(),
      new Map(),
      new WeakSet(),
      new WeakMap(),
      new Date(),
      new Array(),
      new RegExp(),
      new Boolean(),
      new String(),
      new Number(),
      Object.create({})
    ];

    [...primitives, ...objects].forEach(type => {
      expect(isPureObject(type)).to.be.false;
    });
  });

});