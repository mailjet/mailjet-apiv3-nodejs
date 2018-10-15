/* global describe, it */
const FILE = 'FILE'
const EMAIL = 'test@mailjet.com'
const EMAIL2 = 'test2@mailjet.com'
const NAME = 'name'
const SUBJECT = 'subject'
const TEXT_PART = 'text'
const VAR = {'Key1': 'Value1', 'Key2': 'Value2'}
const SIMPLE_RECIPIENTS = [{email: EMAIL}, {email: EMAIL2}]
const UNIQUE_RECIPIENT = [{email: EMAIL}]
const RECIPIENTS_NAME = [{email: EMAIL, name: NAME}, {email: EMAIL2, name: NAME}]
const RECIPIENTS_VARS = [{email: EMAIL, vars: VAR}]
const API_KEY = process.env.MJ_APIKEY_PUBLIC
const API_SECRET = process.env.MJ_APIKEY_PRIVATE

var Mailjet = require('../mailjet-client')
var chai = require('chai')
var expect = chai.expect
var should = chai.should() // eslint-disable-line no-unused-vars
var Promise = require('bluebird')
var nock = require('nock')

if (typeof API_KEY === 'undefined' || typeof API_SECRET === 'undefined') {
  throw new Error('Mailjet API_KEY and API_SECRET are required, respectively ' + API_KEY + ' and ' + API_SECRET + ' given ')
}

var emailOptions = {
  version: 'v3'
}

describe('Basic Usage', function () {
  var client = Mailjet.connect(API_KEY, API_SECRET, emailOptions)

  describe('connection', function () {
    it('creates an instance of the client', function () {
      var connectionType1 = new Mailjet(API_KEY, API_SECRET)
      var connectionType2 = new Mailjet().connect(API_KEY, API_SECRET)
      var connectionType3 = Mailjet.connect(API_KEY, API_SECRET)

      expect('' + connectionType1.apiKey + connectionType1.apiSecret).to.equal('' + API_KEY + API_SECRET)
      expect('' + connectionType2.apiKey + connectionType2.apiSecret).to.equal('' + API_KEY + API_SECRET)
      expect('' + connectionType3.apiKey + connectionType3.apiSecret).to.equal('' + API_KEY + API_SECRET)
    })

    it('creates an instance of the client with options', function () {
      var options = {
        proxyUrl: 'http://localhost:3128',
        timeout: 10000
      }

      var connectionType1 = new Mailjet(API_KEY, API_SECRET, options)
      var connectionType2 = new Mailjet().connect(API_KEY, API_SECRET, options)
      var connectionType3 = Mailjet.connect(API_KEY, API_SECRET, options)

      var connections = [connectionType1, connectionType2, connectionType3]
      connections.forEach(function (connection) {
        expect(connection).to.have.property('apiKey', API_KEY)
        expect(connection).to.have.property('apiSecret', API_SECRET)
        expect(connection.options).to.have.property('proxyUrl', options.proxyUrl)
        expect(connection.options).to.have.property('timeout', 10000)
      })
    })
  })

  describe('method request', function () {
    describe('get', function () {
      var contact = client.get('contact')

      it('calls the contact ressource instance whith no parameters', function (done) {
        contact.request()
          .then(function (result) {
            result.body.should.be.a('object')
            expect(result.response.statusCode).to.equal(200)
            done()
          })
          .catch(function (reason) {
            // We want it to raise an error if it gets here
            expect(reason).to.equal(undefined)
            done()
          })
      })

      it('calls the contact ressource instance whith parameters', function (done) {
        var promise = contact.request({Name: 'Guillaume Badi'})
          .then(function (result) {
            result.body.should.be.a('object')
            expect(result.response.statusCode).to.be.within(200, 201)
            done()
          })
          .catch(function (reason) {
            // We want it to raise an error if it gets here
            expect(reason).to.equal(undefined)
            done()
          })
        expect(Promise.prototype.isPrototypeOf(promise)).to.equal(true)
      })

      it('calls the contact ressource instance with empty parameters', function (done) {
        contact.request({}).then(function (result) {
          result.body.should.be.a('object')
          expect(result.response.statusCode).to.be.within(200, 201)
          done()
        })
      })
    })

    describe('post', function () {
      var sender = client.post('sender')
      // eslint-disable-next-line no-unused-vars
      var deletedErrorMessage = 'There is an already existing deleted sender with the same email. ' +
        'You can use "validate" action in order to activate it.'
      // eslint-disable-next-line no-unused-vars
      var inactiveErrorMessage = 'There is an already existing inactive sender with the same email. ' +
        'You can use "validate" action in order to activate it.'

      it('calls the sender ressource instance whith no parameters', function (done) {
        sender.request().catch(function (reason) {
          //reason.ErrorMessage.should.equal(deletedErrorMessage)
          reason.statusCode.should.equal(400)
          done()
        })
      })

      it('calls the sender ressource instance whith invalid parameters', function (done) {
        sender.request({Name: 'Guillaume Badi'}).catch(function (reason) {
          //expect(reason.ErrorMessage).to.equal(deletedErrorMessage)
          expect(reason.statusCode).to.equal(400)
          done()
        })
      })

      it('calls the sender ressource instance whith valid parameters', function (done) {
        sender.request({email: 'gbadi@mailjet.com'})
          .then(function (result) {
            expect(result.response.statusCode).to.equal(201)
            done()
          })
          .catch(function (reason) {
            // if it fails because the sender already exist. should be 400
            // expect(reason.ErrorMessage).to.equal(inactiveErrorMessage)
            expect(reason.statusCode).to.equal(400)
            done()
          })
      })

      it('calls the sender resource with empty parameters', function (done) {
        sender.request({}).catch(function (reason) {
          // expect(reason.ErrorMessage).to.equal(deletedErrorMessage)
          expect(reason.statusCode).to.equal(400)
          done()
        })
      })
    })
  })
})

describe('Advanced API Calls', function () {
  function Example (fn, payload) {
    this.fn = fn
    this.payload = payload
    this.format = function (obj) { return JSON.stringify(obj).match(/\S+/g).join('') }
    var self = this
    this.call = function () {
      var res = this.fn.request(this.payload)
      if(res[0]) {
        return res[0].replace(/\\/g, '/') + ' ' + this.format(res[1])
      } else {
        return res.then(function(result) {
          return result.url.replace(/\\/g, '/') + ' ' + self.format(result.body)
        })
      }
    }
  }

  var client2 = new Mailjet(API_KEY, API_SECRET, emailOptions, true)

  const EXAMPLES_SET = [
    new Example(client2.get('contact')),
    new Example(client2.get('contact').id(2)),
    new Example(client2.get('contact/2')),
    new Example(client2.get('contact').id(3).action('getcontactslist')),
    new Example(client2.get('contact'), {countOnly: 1}),
    new Example(client2.get('contact'), {limit: 2}),
    new Example(client2.get('contact'), {offset: 233}),
    new Example(client2.get('contact'), {contatctList: 34}),
    new Example(client2.post('contactslist').id(34).action('managecontact'), {email: EMAIL}),
    new Example(client2.post('contactslist').id(34).action('csvdata'), FILE),
    new Example(client2.get('newsletter'), {filters: {CountOnly: 1}}),
    new Example(client2.get('batchjob').action('csverror')),
    new Example(client2.post('contact'), {email: EMAIL}),
    new Example(client2.post('send'), {'FromName': NAME, 'FromEmail': EMAIL, 'Subject': SUBJECT, 'Text-Part': TEXT_PART, 'Recipients': UNIQUE_RECIPIENT}),
    new Example(client2.post('send'), {'FromName': NAME, 'FromEmail': EMAIL, 'Subject': SUBJECT, 'Text-Part': TEXT_PART, 'Recipients': SIMPLE_RECIPIENTS}),
    new Example(client2.post('send'), {'FromName': NAME, 'FromEmail': EMAIL, 'Subject': SUBJECT, 'Text-Part': TEXT_PART, 'Recipients': RECIPIENTS_NAME}),
    new Example(client2.post('send'), {'FromName': NAME, 'FromEmail': EMAIL, 'Subject': SUBJECT, 'Text-Part': TEXT_PART, 'Recipients': RECIPIENTS_VARS})
  ]

  const EXPECTED_SET = [
    'https://api.mailjet.com/v3/REST/contact {}',
    'https://api.mailjet.com/v3/REST/contact/2 {}',
    'https://api.mailjet.com/v3/REST/contact/2 {}',
    'https://api.mailjet.com/v3/REST/contact/3/getcontactslist {}',
    'https://api.mailjet.com/v3/REST/contact/?countOnly=1 {}',
    'https://api.mailjet.com/v3/REST/contact/?limit=2 {}',
    'https://api.mailjet.com/v3/REST/contact/?offset=233 {}',
    'https://api.mailjet.com/v3/REST/contact/?contatctList=34 {}',
    'https://api.mailjet.com/v3/REST/contactslist/34/managecontact {"email":"test@mailjet.com"}',
    'https://api.mailjet.com/v3/DATA/contactslist/34/csvdata "FILE"',
    'https://api.mailjet.com/v3/REST/newsletter/?CountOnly=1 {}',
    'https://api.mailjet.com/v3/DATA/batchjob/csverror {}',
    'https://api.mailjet.com/v3/REST/contact {"email":"test@mailjet.com"}',
    'https://api.mailjet.com/v3/send {"FromName":"name","FromEmail":"test@mailjet.com","Subject":"subject","Text-Part":"text","Recipients":[{"email":"test@mailjet.com"}]}',
    'https://api.mailjet.com/v3/send {"FromName":"name","FromEmail":"test@mailjet.com","Subject":"subject","Text-Part":"text","Recipients":[{"email":"test@mailjet.com"},{"email":"test2@mailjet.com"}]}',
    'https://api.mailjet.com/v3/send {"FromName":"name","FromEmail":"test@mailjet.com","Subject":"subject","Text-Part":"text","Recipients":[{"email":"test@mailjet.com","name":"name"},{"email":"test2@mailjet.com","name":"name"}]}',
    'https://api.mailjet.com/v3/send {"FromName":"name","FromEmail":"test@mailjet.com","Subject":"subject","Text-Part":"text","Recipients":[{"email":"test@mailjet.com","vars":{"Key1":"Value1","Key2":"Value2"}}]}'
  ]

  EXPECTED_SET.forEach(function (test, index) {
    it('should output: ' + test, function () {
      var call = EXAMPLES_SET[index].call()
      if(call instanceof Promise) {
        call.then(function(response) {
          response.should.equal(test)
        })
      } else {
        call.should.equal(test)      }
      
    })
  })
})

/* This fixture needs to run last so that it doesn't interfere with the other tests */
describe('Mocked API calls', function () {
  /* Set a very short timeout */
  var client = Mailjet.connect(API_KEY, API_SECRET, { timeout: 10, version: 'v3' })

  describe('method request', function () {
    describe('get', function () {
      var contact = client.get('contact')

      it('calls the contact resource instance and the request times out', function (done) {
        /* Simulate a delayed response */
        nock('https://api.mailjet.com')
          .get('/v3/REST/contact')
          .delayConnection(1000)
          .reply(200, {})

        contact.request({})
          .then(function (result) {
            // We want it to raise an error if it gets here
            expect(result).to.equal(undefined)
            done()
          })
          .catch(function (reason) {
            expect(reason.ErrorMessage).to.equal('Timeout of 10ms exceeded')
            expect(reason.statusCode).to.equal(null)
            expect(reason.response).to.equal(null)
            done()
          })
      })
    })
  })
})
