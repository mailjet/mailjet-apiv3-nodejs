/*external modules*/
const chai = require('chai')
const qs = require('querystring')
/*lib*/
const { MailjetResource, MailjetClient } = require('../../mailjet-client')
/*other*/

const expect = chai.expect
const expectOwnProperty = (targetObject, path, value) => {
  return expect(targetObject).to.have.ownProperty(path, value)
}

describe('Unit MailjetResource', () => {

  describe('static part', () => {

    describe('MailjetResource.constructor()', () => {

      it('create an instance with not empty argument "options"', () => {
        const options = {}
        const context = {}
        const method = 'get'
        const resource = 'Contact'

        const instance = new MailjetResource(method, resource, options, context)

        expect(instance).to.be.a('object')

        expectOwnProperty(instance, 'base', resource)
        expectOwnProperty(instance, 'callUrl', resource)
        expectOwnProperty(instance, 'options', options)
        expectOwnProperty(instance, 'resource', resource.toLowerCase())
        expectOwnProperty(instance, 'lastAdded', 0)
        expectOwnProperty(instance, 'subPath', 'REST')
        expect(instance).to.have.ownProperty('result').that.is.a('function')
      })

      it('create an instance with empty argument "options"', () => {
        const options = undefined
        const context = { options: {} }
        const method = 'get'
        const resource = 'Contact'

        const instance = new MailjetResource(method, resource, options, context)

        expect(instance).to.be.a('object')

        expectOwnProperty(instance,'base', resource)
        expectOwnProperty(instance,'callUrl', resource)
        expectOwnProperty(instance,'options', context.options)
        expectOwnProperty(instance,'resource', resource.toLowerCase())
        expectOwnProperty(instance,'lastAdded', 0)
        expectOwnProperty(instance,'subPath', 'REST')
        expect(instance).to.have.ownProperty('result').that.is.a('function')
      })

      it('create an instance with /send resource', () => {
        const options = {}
        const context = {}
        const method = 'get'
        const resource = 'send'

        const instance = new MailjetResource(method, resource, options, context)

        expect(instance).to.be.a('object')
        expectOwnProperty(instance,'subPath', '')
      })

      it('create an instance with /sms-send resource', () => {
        const options = {}
        const context = {}
        const method = 'get'
        const resource = 'sms-send'

        const instance = new MailjetResource(method, resource, options, context)

        expect(instance).to.be.a('object')
        expectOwnProperty(instance,'subPath', '')
      })

      it('create an instance with empty resource', () => {
        expect(
          () => new MailjetResource('get', undefined, {}, {})
        ).to.throw(TypeError, /Cannot read propert/)
      })

      it('create an instance with both empty "options" and "context" arguments', () => {
        expect(
          () => new MailjetResource('get', 'send', undefined, undefined)
        ).to.throw(TypeError, /Cannot read propert/)
      })

    })
  })

  describe('instance part', () => {
    const config = require('../../config.json')

    function createMailjetClientContext() {
      return {
        config: { ...config },
        pathData: {},
        path(resource, sub, params, options) {
          this.pathData = {
            resource,
            sub,
            params,
            options,
          }

          return MailjetClient.prototype.path.apply(this, [resource, sub, params, options])
        },
        httpRequest(method, url, data, callback, perform_api_call) {
          return {
            method,
            url,
            data,
            callback,
            perform_api_call,
          }
        }
      }
    }

    describe('MailjetResource.result()', () => {

      it('should be have own method #result()', () => {
        const options = {}
        const context = {}
        const method = 'get'
        const resource = 'contact'

        const instance = new MailjetResource(method, resource, options, context)

        expect(instance).to.be.a('object')
        expect(instance).itself.to.respondTo('result')
      })

      it('should be change instance properties and call httpRequest', () => {
        const context = createMailjetClientContext()
        const options = {}
        const method = 'get'
        const resource = 'contact'
        const callback = () => {}
        const params = {}

        const instance = new MailjetResource(method, resource, options, context)

        expect(instance).to.be.a('object')

        expectOwnProperty(instance,'base', resource)
        expectOwnProperty(instance,'callUrl', resource)
        expectOwnProperty(instance,'options', options)
        expectOwnProperty(instance,'resource', resource.toLowerCase())
        expectOwnProperty(instance,'lastAdded', 0)
        expectOwnProperty(instance,'subPath', 'REST')
        expect(instance).to.have.ownProperty('result').that.is.a('function')

        expect(context).to.not.have.ownProperty('lastAdded')

        const result = instance.result(params, callback)

        expect(result).to.be.a('object')
        expect(context.pathData).to.be.a('object')

        expectOwnProperty(context, 'lastAdded', 0)

        expectOwnProperty(context.pathData, 'resource', resource)
        expectOwnProperty(context.pathData, 'sub', 'REST')
        expectOwnProperty(context.pathData, 'params', params)
        expectOwnProperty(context.pathData, 'options', options)

        expectOwnProperty(instance,'callUrl', instance.base)

        const path = `https://${config.url}/${config.version}/REST/${resource}`

        expectOwnProperty(result, 'method', method)
        expectOwnProperty(result, 'url', path)
        expectOwnProperty(result, 'data', params)
        expectOwnProperty(result, 'callback', callback)
        expectOwnProperty(result, 'perform_api_call', config.perform_api_call)
      })

      it('call with empty "params"', () => {
        const context = createMailjetClientContext()
        const options = {}
        const method = 'get'
        const resource = 'contact'
        const callback = undefined
        const params = undefined

        const instance = new MailjetResource(method, resource, options, context)
        const result = instance.result(params, callback)

        expect(instance).to.be.a('object')
        expect(result).to.be.a('object')

        expect(result).to.have.ownProperty('data')
          .that.is.a('object')
          .and.is.not.equal(params)
        expectOwnProperty(result, 'callback', callback)
      })

      it('call with "params" which is function', () => {
        const context = createMailjetClientContext()
        const options = {}
        const method = 'get'
        const resource = 'contact'
        const callback = () => {}
        const params = () => {}

        const instance = new MailjetResource(method, resource, options, context)
        const result = instance.result(params, callback)

        expect(instance).to.be.a('object')
        expect(result).to.be.a('object')

        expect(result).to.have.ownProperty('data')
          .that.is.a('object')
          .and.is.not.equal(params)
        expect(result).to.have.ownProperty('callback')
          .that.is.equal(params)
          .but.not.equal(callback)
      })

      it('call with "params.filters"', () => {
        const context = createMailjetClientContext()
        const options = {}
        const method = 'post'
        const resource = 'contact'
        const callback = () => {}

        const filters = {
          a: 5,
          b: 6
        }
        const params = { filters }

        const instance = new MailjetResource(method, resource, options, context)

        expect(instance).to.be.a('object')
        expect(params).to.have.ownProperty('filters')

        const result = instance.result(params, callback)

        expect(result).to.be.a('object')
        expect(context.pathData).to.be.a('object')

        expect(params).to.not.have.ownProperty('filters')
        expectOwnProperty(context.pathData, 'params', filters)

        const querystring = qs.stringify(filters);
        const path = `https://${config.url}/${config.version}/REST/${resource}?${querystring}`

        expectOwnProperty(result, 'method', method)
        expectOwnProperty(result, 'url', path)
        expectOwnProperty(result, 'data', params)
        expectOwnProperty(result, 'callback', callback)
      })

      it('call with empty "params.filters" and POST/PUT/DELETE "method"', () => {
        ['post', 'put', 'delete'].forEach(method => {
          const context = createMailjetClientContext()
          const options = {}
          const resource = 'contact'
          const callback = () => {}
          const params = {}

          const instance = new MailjetResource(method, resource, options, context)
          const result = instance.result(params, callback)

          expect(instance).to.be.a('object')
          expect(result).to.be.a('object')
          expect(context.pathData).to.be.a('object')

          expect(context.pathData).to.have.ownProperty('params')
            .that.is.a('object')
            .and.is.not.equal(params)

          const path = `https://${config.url}/${config.version}/REST/${resource}`

          expectOwnProperty(result, 'method', method)
          expectOwnProperty(result, 'url', path)
          expectOwnProperty(result, 'data', params)
          expectOwnProperty(result, 'callback', callback)
        })
      })

      it('call with argument "options.perform_api_call"', () => {
        const context = createMailjetClientContext()
        const options = {
          perform_api_call: false
        }
        const method = 'get'
        const resource = 'contact'
        const callback = () => {}
        const params = () => {}

        const instance = new MailjetResource(method, resource, options, context)
        const result = instance.result(params, callback)

        expect(instance).to.be.a('object')
        expect(result).to.be.a('object')

        expectOwnProperty(result, 'perform_api_call', options.perform_api_call)
      })

    })

    describe('MailjetResource.id()', () => {

      it('should be have prototype method #id()', () => {
        expect(MailjetResource).to.respondsTo('id')
      })

      it('should be change instance properties', () => {
        const options = {}
        const context = {}
        const method = 'get'
        const resource = 'contact'
        const id = '5'

        const instance = new MailjetResource(method, resource, options, context)
        instance.id(id)

        expect(instance).to.be.a('object')

        expectOwnProperty(instance,'callUrl', `${resource}/${id}`)
        expectOwnProperty(instance,'lastAdded', 1)
      })

      it('should be throw error if argument "value" is not passed', () => {
        const options = {}
        const context = {}
        const method = 'get'
        const resource = 'contact'

        const instance = new MailjetResource(method, resource, options, context)

        expect(() => instance.id()).to.throw(TypeError, /Cannot read propert/)
      })

    })

    describe('MailjetResource.action()', () => {

      it('should be have prototype method #action()', () => {
        expect(MailjetResource).to.respondsTo('action')
      })

      it('should be change instance properties', () => {
        const options = {}
        const context = {}
        const method = 'get'
        const resource = 'contact'
        const action = 'Managecontactslists'

        const instance = new MailjetResource(method, resource, options, context)

        expect(instance).to.be.a('object')
        expect(instance).to.not.have.ownProperty('action')

        const result = instance.action(action)

        expect(result).to.be.a('object')
        expect(result).to.equal(instance)

        expect(instance)
          .to.have.ownProperty('action')
          .that.is.a('string')
          .to.equal(action.toLowerCase())

        expectOwnProperty(instance,'callUrl', `${resource}/${action.toLowerCase()}`)
        expectOwnProperty(instance,'lastAdded', 2)
        expectOwnProperty(instance,'subPath', 'REST')
      })

      it('call with "action" is csvdata', () => {
        const options = {}
        const context = {}
        const method = 'get'
        const resource = 'contact'
        const action = 'csvdata'

        const instance = new MailjetResource(method, resource, options, context)
        const result = instance.action(action)

        expect(instance).to.be.a('object')
        expect(result).to.be.a('object')
        expect(result).to.equal(instance)

        expect(instance)
          .to.have.ownProperty('action')
          .that.is.a('string')
          .to.equal('csvdata/text:plain')

        expectOwnProperty(instance,'callUrl', `${resource}/${action}/text:plain`)
      })

      it('call with "action" is csvdata and "resource" is /contactslist', () => {
        const options = {}
        const context = {}
        const method = 'get'
        const resource = 'contactslist'
        const action = 'csvdata'

        const instance = new MailjetResource(method, resource, options, context)
        const result = instance.action(action)

        expect(instance).to.be.a('object')
        expect(result).to.be.a('object')
        expect(result).to.equal(instance)

        expect(instance)
          .to.have.ownProperty('action')
          .that.is.a('string')
          .to.equal('csvdata/text:plain')

        expectOwnProperty(instance,'callUrl', `${resource}/${action}/text:plain`)
        expectOwnProperty(instance,'subPath', 'DATA')
      })

      it('call with "action" is csverror', () => {
        const options = {}
        const context = {}
        const method = 'get'
        const resource = 'contact'
        const action = 'csverror'

        const instance = new MailjetResource(method, resource, options, context)
        const result = instance.action(action)

        expect(instance).to.be.a('object')
        expect(result).to.be.a('object')
        expect(result).to.equal(instance)

        expect(instance)
          .to.have.ownProperty('action')
          .that.is.a('string')
          .to.equal('csverror/text:csv')

        expectOwnProperty(instance,'callUrl', `${resource}/${action}/text:csv`)
      })

      it('call with "action" is csverror and "resource" is /batchjob', () => {
        const options = {}
        const context = {}
        const method = 'get'
        const resource = 'batchjob'
        const action = 'csverror'

        const instance = new MailjetResource(method, resource, options, context)
        const result = instance.action(action)

        expect(instance).to.be.a('object')
        expect(result).to.be.a('object')
        expect(result).to.equal(instance)

        expect(instance)
          .to.have.ownProperty('action')
          .that.is.a('string')
          .to.equal('csverror/text:csv')

        expectOwnProperty(instance,'callUrl', `${resource}/${action}/text:csv`)
        expectOwnProperty(instance,'subPath', 'DATA')
      })

      it('should be throw error if argument "name" is not passed', () => {
        const options = {}
        const context = {}
        const method = 'get'
        const resource = 'contact'

        const instance = new MailjetResource(method, resource, options, context)

        expect(() => instance.action()).to.throw(/Cannot read propert/)
      })

    })

    describe('MailjetResource.request()', () => {

      it('should be have prototype method #request()', () => {
        expect(MailjetResource).to.respondsTo('request')
      })

      it('should be return result', async () => {
        const context = createMailjetClientContext()
        const originalHttpRequest = context.httpRequest.bind(this)
        context.httpRequest = function (...args) {
          return Promise.resolve(originalHttpRequest(...args))
        }

        const options = {}
        const method = 'get'
        const resource = 'contact'
        const callback = () => {}
        const params = {}

        const instance = new MailjetResource(method, resource, options, context)

        expect(instance).to.be.a('object')

        expectOwnProperty(instance,'base', resource)
        expectOwnProperty(instance,'callUrl', resource)
        expectOwnProperty(instance,'options', options)
        expectOwnProperty(instance,'resource', resource.toLowerCase())
        expectOwnProperty(instance,'lastAdded', 0)
        expectOwnProperty(instance,'subPath', 'REST')
        expect(instance).to.have.ownProperty('result').that.is.a('function')

        expect(context).to.not.have.ownProperty('lastAdded')

        const result = await instance.request(params, callback)

        expect(result).to.be.a('object')
        expect(context.pathData).to.be.a('object')

        expectOwnProperty(context, 'lastAdded', 0)

        expectOwnProperty(context.pathData, 'resource', resource)
        expectOwnProperty(context.pathData, 'sub', 'REST')
        expectOwnProperty(context.pathData, 'params', params)
        expectOwnProperty(context.pathData, 'options', options)

        expectOwnProperty(instance,'callUrl', instance.base)

        const path = `https://${config.url}/${config.version}/REST/${resource}`

        expectOwnProperty(result, 'method', method)
        expectOwnProperty(result, 'url', path)
        expectOwnProperty(result, 'data', params)
        expectOwnProperty(result, 'callback', callback)
        expectOwnProperty(result, 'perform_api_call', config.perform_api_call)
      })

      it('should be return original error if can not parse "response.text"', async () => {
        const errorMessage = 'test'
        const error = new Error(errorMessage)
        error.response = {
          text: 'some text'
        }

        const context = createMailjetClientContext()
        context.httpRequest = function () {
          return Promise.reject(error)
        }

        const options = {}
        const method = 'get'
        const resource = 'contact'
        const callback = () => {}
        const params = {}

        const instance = new MailjetResource(method, resource, options, context)

        expect(instance).to.be.a('object')

        let err = null;
        try {
          await instance.request(params, callback)
        } catch (e) {
          err = e

          expect(e).to.equal(error)
          expect(e).to.have.ownProperty('message', errorMessage)
        } finally {
          expect(err).to.be.not.null
        }
      })

      it('should be return original error with extended "err.message"', async () => {
        const errorMessage = 'test'
        const additionalErrorMessage = 'additional error information'
        const error = new Error(errorMessage)
        error.response = {
          text: JSON.stringify({
            Messages: [
              {
                Errors: [
                  {
                    ErrorMessage: additionalErrorMessage
                  }
                ]
              }
            ]
          })
        }

        const context = createMailjetClientContext()
        context.httpRequest = function () {
          return Promise.reject(error)
        }

        const options = {}
        const method = 'get'
        const resource = 'contact'
        const callback = () => {}
        const params = {}

        const instance = new MailjetResource(method, resource, options, context)

        expect(instance).to.be.a('object')

        let err = null;
        try {
          await instance.request(params, callback)
        } catch (e) {
          err = e

          expect(e).to.equal(error)
          expect(e).to.have.ownProperty('message', errorMessage + ';\n' + additionalErrorMessage)
        } finally {
          expect(err).to.be.not.null
        }
      })

    })

  })

})