/* global describe, it */
const API_TOKEN = process.env.MJ_API_TOKEN

var Mailjet = require('../mailjet-client')
var chai = require('chai')
var expect = chai.expect
var should = chai.should() // eslint-disable-line no-unused-vars
var Promise = require('bluebird')

if (typeof API_TOKEN === 'undefined') {
  throw new Error(
    'Mailjet API_TOKEN is required, respectively ' + API_TOKEN + ' given'
  )
}

describe('Basic Usage', function() {
  var client = Mailjet.connect(API_TOKEN)

  describe('connection', function() {
    it('creates instance of the client', function() {
      var connectionType1 = new Mailjet(API_TOKEN)
      var connectionType2 = new Mailjet().connect(API_TOKEN)
      var connectionType3 = Mailjet.connect(API_TOKEN)

      expect(connectionType1.apiToken).to.equal(API_TOKEN)
      expect(connectionType2.apiToken).to.equal(API_TOKEN)
      expect(connectionType3.apiToken).to.equal(API_TOKEN)
    })

    it('creates an instance of the client wiht options', function() {
      var smsOptions = {
        version: 'v4'
      }

      var connectionType1 = new Mailjet(API_TOKEN, smsOptions)
      var connectionType2 = new Mailjet().connect(API_TOKEN, smsOptions)
      var connectionType3 = Mailjet.connect(API_TOKEN, smsOptions)

      var connections = [connectionType1, connectionType2, connectionType3]

      connections.forEach(function(connection) {
        expect(connection).to.have.property('apiToken', API_TOKEN)
        expect(connection.options).to.have.property(
          'version',
          smsOptions.version
        )
      })
    })
  })

  describe('method call', function() {
    describe('get', function() {
      var smsGet = client.get('sms')
      it('calls retrieve sms action count with parameters', function(done) {
        var countRequest = smsGet.action('count')

        var promise = countRequest
          .request({ FromTS: +new Date, ToTS: +new Date })
          .then(function(result) {
            expect(result.body).should.be.a('object')
            expect(result.body.count).to.equal(0)
            done()
          })
          .catch(function(reason) {
            expect(reason.ErrorMessage).to.equal(undefined)
            done()
          })
        expect(Promise.prototype.isPrototypeOf(promise)).to.equal(true)
      })

      it('retirieve list of messages', function(done) {
        var promise = smsGet
          .request({ FromTS: +new Date, ToTS: +new Date })
          .then(function(response) {
            expect(response.body).to.be.a('object')
            expect(response.body.Data.length).to.equal(0)
            done()
          })
          .catch(function(reason) {
            expect(reason).to.equal(undefined)
            done()
          })
        expect(Promise.prototype.isPrototypeOf(promise)).to.equal(true)
      })
    })

    describe('post', function() {
      it('export sms statisitcs action with timestamp bigger than one year', function(done) {
        var promise = client
          .post('sms')
          .action('export')
          .request({
            FromTS: 1033552800,
            ToTS: 1033574400
          })
          .then(function(response) {
            expect(response.body).to.be.a('object')
            done()
          })
          .catch(function(reason) {
            expect(reason.statusCode).to.equal(400)
            expect(reason.ErrorMessage).to.equal(
              'FromTS must not be older than one year.'
            )
            expect(reason.message).to.include('Unsuccessful')
            done()
          })
        expect(Promise.prototype.isPrototypeOf(promise)).to.equal(true)
      })
    })
  })
})
