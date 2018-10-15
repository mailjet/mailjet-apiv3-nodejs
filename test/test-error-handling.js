/* global describe, it */
var API_TOKEN = process.env.MJ_API_TOKEN
var API_PUBLIC_KEY = process.env.MJ_APIKEY_PUBLIC
var API_PRIVATE_KEY = process.env.MJ_APIKEY_PRIVATE

var Mailjet = require('../mailjet-client')
var chai = require('chai')
var expect = chai.expect
var should = chai.should() // eslint-disable-line no-unused-vars
var Promise = require('bluebird')

describe('Basic Error Handling', function () {
  API_TOKEN = API_TOKEN || '#invalidToken'
  API_PUBLIC_KEY = API_PUBLIC_KEY || '#invalidPublicKey'
  API_PRIVATE_KEY = API_PRIVATE_KEY || '#invalidPrivateKey'

  const AUTH_ERROR_MESSAGE = 'API key authentication/authorization failure. You may be unauthorized to access the API or your API key may be expired. Visit API keys management section to check your keys.'
  const AUTH_V3_ERROR_MESSAGE = 'Unauthorized'
  const AUTH_ERROR_CODE = 401

  describe('invalid token', function () {
    var v4Config = {
      'url': 'api.mailjet.com',
      'version': 'v4',
      'output': 'json',
      'perform_api_call': true,
      'secured': true
    }
    var v4Client = Mailjet.connect(API_TOKEN, v4Config)

    describe('get', function () {

      var smsGet = v4Client.get('sms')

      it('check error message', function (done) {
        var promise = smsGet
          .request({ FromTS: +new Date, ToTS: +new Date })
          .then(function (response) {
            expect(response.body).to.be.a('object')
            done()
          })
          .catch(function (err) {
            expect(err.ErrorMessage).to.equal(AUTH_ERROR_MESSAGE)
            done()
          })
        expect(Promise.prototype.isPrototypeOf(promise)).to.equal(true)
      })

      it('check status code', function (done) {
        var promise = smsGet
          .request({ FromTS: +new Date, ToTS: +new Date })
          .then(function (response) {
            expect(response.body).to.be.a('object')
            expect(response.body.Data.length).to.equal(0)
            done()
          })
          .catch(function (err) {
            expect(err.statusCode).to.equal(AUTH_ERROR_CODE)
            done()
          })
        expect(Promise.prototype.isPrototypeOf(promise)).to.equal(true)
      })

      it('check response body is not null on error', function (done) {
        var promise = smsGet
          .request({ FromTS: +new Date, ToTS: +new Date })
          .then(function (response) {
            expect(response.body).to.be.a('object')
            expect(response.body.Data.length).to.equal(0)
            done()
          })
          .catch(function (err) {
            expect(err.response).to.not.equal(null)
            done()
          })
        expect(Promise.prototype.isPrototypeOf(promise)).to.equal(true)
      })

      it('check error identitfier is not empty string', function (done) {
        var promise = smsGet
          .request({ FromTS: +new Date, ToTS: +new Date })
          .then(function (response) {
            expect(response.body).to.be.a('object')
            expect(response.body.Data.length).to.equal(0)
            done()
          })
          .catch(function (err) {
            expect(err.ErrorIdentifier).to.not.equal('')
            done()
          })
        expect(Promise.prototype.isPrototypeOf(promise)).to.equal(true)
      })
    })

    describe('invalid public/private keys', function () {
      var v3Config = {
        url: 'api.mailjet.com',
        version: 'v3',
        output: 'json',
        perform_api_call: true,
        secured: true
      }
      var v3Client = Mailjet.connect(API_PUBLIC_KEY, API_PRIVATE_KEY, v3Config)

      describe('get', function () {

        var contact = v3Client.get('contact')

        it('check v3 error message', function (done) {
          contact.request()
            .then(function (result) {
              result.body.should.be.a('object')
              expect(result.response.statusCode).to.equal(200)
              done()
            })
            .catch(function (err) {
              expect(err.ErrorMessage).to.equal(AUTH_V3_ERROR_MESSAGE)
              done()
            })
        })  
        
        it('check v3 error status code', function (done) {
          contact.request()
            .then(function (result) {
              result.body.should.be.a('object')
              expect(result.response.statusCode).to.equal(200)
              done()
            })
            .catch(function (err) {
              expect(err.statusCode).to.equal(AUTH_ERROR_CODE)
              done()
            })
        })

        it('check v3 response body is not null on error', function (done) {
          contact.request()
            .then(function (result) {
              result.body.should.be.a('object')
              expect(result.response.statusCode).to.equal(200)
              done()
            })
            .catch(function (err) {
              expect(err.response).to.not.equal(null)
              done()
            })
        })  

        it('check v3 error identitfier is not empty string', function (done) {
          contact.request()
            .then(function (result) {
              result.body.should.be.a('object')
              expect(result.response.statusCode).to.equal(200)
              done()
            })
            .catch(function (err) {
              expect(err.ErrorIdentifier).to.not.equal('')
              done()
            })
        })

      })
    })
  })
})