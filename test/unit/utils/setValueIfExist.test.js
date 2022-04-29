/*external modules*/
const chai = require('chai')
/*lib*/
const setValueIfExist = require('../../../lib/utils/setValueIfExist')
/*other*/

const expect = chai.expect

describe('Unit utils/setValueIfExist', () => {

  it('should be set value by string path', () => {
    const obj = {}

    setValueIfExist(obj, 'count', 5)
    setValueIfExist(obj, 'description', 'message')
    setValueIfExist(obj, 'self', {})

    expect(obj, 'object not equal').to.deep.equal({
      count: 5,
      description: 'message',
      self: {}
    })
  })

  it('should be throw error if argument targetObject is not object', () => {
    ['', 5, true, undefined, null, Symbol(), BigInt(5)].forEach(arg => {
      expect(setValueIfExist.bind(null, ...[arg, 'count', 5])).to.throw(
        Error,
        'argument target object is not object',
        'must be error if passed argument is not object'
      )
    })
  })

  it('should be throw error if argument path is not passed', () => {
    [false, undefined, null].forEach(arg => {
      expect(setValueIfExist.bind(null, ...[{}, arg, 5])).to.throw(
        Error,
        'argument path is required',
        'must be error if passed argument is empty'
      )
    })
  })
})