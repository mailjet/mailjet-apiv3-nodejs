/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mailjet
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

const DEBUG_MODE = false
const RESOURCE = 0
const ID = 1
const ACTION = 2

const STRICT = false

/*
 * Imports.
 *
 * qs is used to format the url from the provided parameters and method
 * _path will join a path according to the OS specifications
 * https will be used to make a secure http request to the API
 * fs will simply be used to read files
 */

const qs = require('querystring')
const request = require('superagent')
const Promise = require('bluebird')
const _path = require('path')
const JSONb = require('json-bigint')({ storeAsString: true })
const version = require('./package.json').version

/* Extend superagent request with proxy method */
require('superagent-proxy')(request);

/*
 * MailjetClient constructor.
 *
 * @qpi_key (optional) {String} mailjet account api key
 * @api_secret (optional) {String} mailjet account api secret
 * @options (optional) {Object} additional connection options
 *
 * If you don't know what this is about, sign up to Mailjet at:
 * https://www.mailjet.com/
 */
function MailjetClient (api_key, api_secret, options, testMode) {
  this.config = require('./config')
  this.testMode = testMode || false
  // To be updated according to the npm repo version
  this.version = version
  if (api_key && api_secret) {
    this.connect(api_key, api_secret, options)
  }
}

MailjetClient.prototype.typeJson = function (body) {
  var keys = Object.keys(body)
  for (var i in keys) {
    var key = keys[i]
    body[key] = parseInt(body[key]) || body[key]
  }
  return body
}

/*
 * [Static] connect.
 *
 * Return a nez connected instance of the MailjetClient class
 *
 * @k {String} mailjet qpi key
 * @s {String} mailjet api secret
 * @o {String} optional connection options
 *
 */
MailjetClient.connect = function (k, s, o) {
  return new MailjetClient().connect(k, s, o)
}

/*
 * connect.
 *
 * create a auth property from the api key and secret
 *
 * @apiKey {String}
 * @apiSecret {String}
 * @options {Object}
 *
 */
MailjetClient.prototype.connect = function (apiKey, apiSecret, options) {
  this.apiKey = apiKey
  this.apiSecret = apiSecret
  this.options = options || {}
  return this
}

/*
 * path.
 *
 * Returns a formatted url from a http method and
 * a parameters object literal
 *
 * @resource {String}
 * @sub {String} REST/''/DATA
 * @params {Object literal} {name: value}
 *
 */
MailjetClient.prototype.path = function (resource, sub, params) {
  if (DEBUG_MODE) {
    console.log('resource =', resource)
    console.log('subPath =', sub)
    console.log('filters =', params)
  }
  var base = _path.join(this.config.version, sub)
  if (Object.keys(params).length === 0) {
    return base + '/' + resource
  }

  var q = qs.stringify(params).replace(/%2B/g, '+')
  return base + '/' + resource + '/?' + q
}

/*
 * httpRequest.
 *
 * @method {String} http method (GET/POST...)
 * @url {String} url path to be used for the request
 * @data {Object literal} additional data espacially for POST/PUT operations
 * @callback -optional {Function} called on response from the server, or on error
 *
 * @return a promise triggering 'success' on response
 * 		and error on error
 */

MailjetClient.prototype.httpRequest = function (method, url, data, callback) {

  var req = request[method](url)
      .set('user-agent', 'mailjet-api-v3-nodejs/' + this.version)

      .set('Content-type', url.indexOf('text:plain') > -1
                         ? 'text/plain'
                         : 'application/json')

    .auth(this.apiKey, this.apiSecret)

  if (this.options.proxyUrl) {
    req = req.proxy(this.options.proxyUrl)
  }

  const payload = method === 'post' || method === 'put' ? data : {}

  if (DEBUG_MODE) {
    console.log('Final url: ' + url)
    console.log('body: ' + payload)
  }

  if (this.testMode) {
    return [url, payload]
  }

  if (method === 'delete') { method = 'del' }
  if (method === 'post' || method === 'put') { req = req.send(data) }

  return new Promise(function (resolve, reject) {

    const ret = function (err, result) {
      return typeof callback === 'function'
        ? callback(err, result)
        : err
        ? reject(err)
        : resolve(result)
    }

    req.end(function (err, result) {
      var body

      try {
        body = JSONb.parse(result.text)
      } catch (e) {
        body = {}
      }

      if (result && result.status && result.status > 210) {
        const error = new Error('Unsuccessful')
        error.ErrorMessage = body.ErrorMessage || (result.res.statusMessage)
        error.statusCode = result.status
        error.response = result
        return ret(error)
      }

      return ret(null, {
        response: result,
        body: body
      })
    })
  })
}

/*
 *
 * MailjetResource constructor
 *
 * This class creates a function that can be build through method chaining
 *
 * @method {String} http method
 * @func {String} resource/path to be sent
 * @context {MailjetClient[instance]} parent client
 */
function MailjetResource (method, func, context) {
  this.base = func
  this.callUrl = func

  this.resource = func.toLowerCase()

  this.lastAdded = RESOURCE
  var self = context

  /*
  It can be REST or nothing if we only know the resource
  */
  this.subPath = (function () {
    if (func.toLowerCase() !== 'send') {
      return 'REST'
    }
    return ''
  })()

  /**
   *
   * result.
   *
   * @params (optional) {Object Littteral} parameters to be sent to the server
   * @callback (optional) {Function} called on response or error
   */
  var that = this
  this.result = function (params, callback) {
    params = params || {}
    if (typeof params === 'function') {
      callback = params
      params = {}
    }

    /*
    We build the querystring depending on the parameters. if the user explicitly mentionned
    a filters property, we pass it to the url
    */
    var path = self.path(that.callUrl, that.subPath, (function () {
      if (params['filters']) {
        var ret = params['filters']
        delete params['filters']
        return ret
      } else if (method === 'get') {
        return params
      } else {
        return {}
      }
    })())

    that.callUrl = that.base
    self.lastAdded = RESOURCE
    return self.httpRequest(method, 'https://' + _path.join(self.config.url, path), params, callback)
  }
}

/**
 *
 * id.
 *
 * Add an ID and prevent invalid id chaining
 *
 * @value {String/Number} append an id to the path
 * @return the MailjetResource instance to allow method chaining
 *
 */
MailjetResource.prototype.id = function (value) {
  if (this.lastAdded === ID && DEBUG_MODE) {
    console.warn('[WARNING] your request may fail due to invalid id chaining')
  }

  this.callUrl = _path.join(this.callUrl, value.toString())
  this.lastAdded = ID
  return this
}

/**
 *
 * action.
 *
 * Add an Action and prevent invalid action chaining
 *
 * @value {String} append an action to the path
 * @return the MailjetResource instance to allow method chaining
 *
 */
MailjetResource.prototype.action = function (name) {
  if (this.lastAdded === ACTION && DEBUG_MODE) {
    console.warn('[WARNING] your request may fail due to invalid action chaining')
  }

  this.callUrl = _path.join(this.callUrl, name)
  this.action = name.toLowerCase()

  this.lastAdded = ACTION

  if (this.action.toLowerCase() === 'csvdata') {
    this.action = 'csvdata/text:plain'
  } else if (this.action.toLowerCase() === 'csverror') {
    this.action = 'csverror/text:csv'
  }

  var self = this
  this.subPath = (function () {
    if (self.resource === 'contactslist' && self.action === 'csvdata/text:plain' ||
      self.resource === 'batchjob' && self.action === 'csverror/text:csv') {
      return 'DATA'
    } else {
      return self.subPath
    }
  })()
  return self
}

/**
 *
 * request.
 *
 * @parmas {Object literal} method parameters
 * @callback (optional) {Function} triggered when done
 *
 * @return {String} the server response
 */

MailjetResource.prototype.request = function (params, callback) {
  return this.result(params, callback)
}

/*
 * post.
 *
 * @func {String} required Mailjet API function to be used (can contain a whole action path)
 *
 * @returns a function that make an httpRequest for each call
 */
MailjetClient.prototype.post = function (func) {
  return new MailjetResource('post', func, this)
}

/*
 * get.
 *
 * @func {String} required Mailjet API function to be used (can contain a whole action path)
 *
 * @returns a function that make an httpRequest for each call
 */
MailjetClient.prototype.get = function (func) {
  return new MailjetResource('get', func, this)
}

/*
 * delete.
 *
 * @func {String} required Mailjet API function to be used (can contain a whole action path)
 *
 * @returns a function that make an httpRequest for each call
 */
MailjetClient.prototype.delete = function (func) {
  return new MailjetResource('delete', func, this)
}

/*
 * put.
 *
 * @func {String} required Mailjet API function to be used (can contain a whole action path)
 *
 * @returns a function that make an httpRequest for each call
 */
MailjetClient.prototype.put = function (func) {
  return new MailjetResource('put', func, this)
}

/*
 * Exports the Mailjet client.
 *
 * you can require it like so:
 * var mj = require ('./mailjet-client')
 *
 * or for the bleeding edge developpers out there:
 * import mj from './mailjet-client'
 */
module.exports = MailjetClient
