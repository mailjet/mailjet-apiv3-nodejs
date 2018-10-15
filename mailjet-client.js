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
require('superagent-proxy')(request)

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
function MailjetClient (api_key, api_secret, options, perform_api_call) {  
  return this.authStrategy(api_key, api_secret, options, perform_api_call)
}

/**
 * @param (optional){String} api_key || api_token
 * @param (optional){String} api_secret
 * @param (optional){Object} options 
 * @param (optional){any} perform_api_call 
 */
MailjetClient.prototype.authStrategy = function(api_key, api_secret, options, perform_api_call) {

  var isTokenRequired = this.isTokenRequired(api_key, api_secret, options, perform_api_call)
  var self = this
  // Check if api version requires toekn authentication
  // This is one of the approaches, maybe there is better 
  if (isTokenRequired) {   
    // params are shifted one position to left as we don't have api secret any more
    // api_key becomes api_token
    // api_secret becomes options
    // options becomes perform_api_call
    return tokenAuthentication(api_key, api_secret, options)
  } else {
    // params are in correct order
    return basicAuthentication(api_key, api_secret, options, perform_api_call)
  }

  /**
   *
   * @param (optional){String} api_key mailjet api key
   * @param (optional){String} api_secret mailjet api secret
   * @param (optional){Object} options additional connection options
   * @param (optional){boolean} perform_api_call 
   */
  function basicAuthentication(api_key, api_secret, options, perform_api_call) {
    
    self.config = self.setConfig(options)
    self.perform_api_call = perform_api_call || false
    // To be updated according to the npm repo version
    self.version = version
    if (api_key && api_secret) {
      self.connect(api_key, api_secret, options)
    }

    return self
  }

  /**
   * 
   * @param (optional){String} api_token mailjet api token
   * @param (optional){Object} options additional connection options
   * @param (optional){boolean} perform_api_call 
   */
  function tokenAuthentication(api_token, options, perform_api_call) {
    self.perform_api_call = perform_api_call || false
    // To be updated according to the npm repo version
    self.version = version
    if (api_token) {
      self.connect(api_token, options)
    }

    return self
  }
}

MailjetClient.prototype.isTokenRequired = function () {
  var args = [].slice.call(arguments)
  var vals = args.filter(a => a !== undefined)

  if (DEBUG_MODE) {
    console.log('Defined arguments: ' + JSON.stringify(vals))
  }

  return (vals.length === 1 || (vals.length >= 2 && typeof vals[1] === 'object'))
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
 * @apiKey || @apiToken {String}
 * @apiSecret {String}
 * @options {Object}
 *
 */
MailjetClient.prototype.connect = function (apiKey, apiSecret, options) {
  return this.connectStrategy(apiKey, apiSecret, options)
}

/**
 * @param (optional){String} apiKey || apiToken
 * @param (optional){String} apiSecret 
 * @param (optional){Object} options 
 */
MailjetClient.prototype.connectStrategy = function (apiKey, apiSecret, options) {

  var self = this
  var isTokenRequired = this.isTokenRequired(apiKey, apiSecret, options)

  if (isTokenRequired) {
    return tokenConnectStrategy(apiKey, apiSecret)
  } else {
    return basicConnectStrategy(apiKey, apiSecret, options)
  }

  function basicConnectStrategy(apiKey, apiSecret, options) {
    setOptions(options)
    self.apiKey = apiKey
    self.apiSecret = apiSecret
    return self
  }

  function tokenConnectStrategy(apiToken, options) {
    setOptions(options)
    self.apiToken = apiToken
    return self
  }

  function setOptions(options) {
    self.options = options || {}
    if (self.options) {
      self.config = self.setConfig(options)
    }
  }
}

MailjetClient.prototype.setConfig = function (options) {
  const config = require('./config')
  if (typeof options === 'object' && options != null && options.length != 0) {
    if (options.url) config.url = options.url
    if (options.version) config.version = options.version
    if (options.secured) config.secured = options.secured
    if (options.perform_api_call) config.perform_api_call = options.perform_api_call
  } else if (options != null) {
    throw new Error('warning, your options variable is not a valid object.')
  }
  
  return config
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
MailjetClient.prototype.path = function (resource, sub, params, options) {
  if (DEBUG_MODE) {
    console.log('resource =', resource)
    console.log('subPath =', sub)
    console.log('filters =', params)
  }
  
  const url = (options && 'url' in options ? options.url : this.config.url)
  const api_version = (options && 'version' in options ? options.version : this.config.version)
  
  var base = _path.join(api_version, sub)
  if (Object.keys(params).length === 0) {
    return _path.join(url, base + '/' + resource)
  }

  var q = qs.stringify(params).replace(/%2B/g, '+')
  return _path.join(url, base + '/' + resource + '/?' + q)
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

MailjetClient.prototype.httpRequest = function (method, url, data, callback, perform_api_call){  
  var req = request[method](url)
    .set('user-agent', 'mailjet-api-v3-nodejs/' + this.version)

    .set('Content-type', url.indexOf('text:plain') > -1
      ? 'text/plain'
      : 'application/json')

  if (this.apiToken) {
    req.set('Authorization', 'Bearer ' + this.apiToken)
  } else {
    req.auth(this.apiKey, this.apiSecret)
  }

  if (this.options.proxyUrl) {
    req = req.proxy(this.options.proxyUrl)
  }
  if (this.options.timeout) {
    req = req.timeout(this.options.timeout)
  }

  const payload = method === 'post' || method === 'put' ? data : {}

  if (DEBUG_MODE) {
    console.log('Final url: ' + url)
    console.log('body: ' + JSON.stringify(payload))
  }
  
  if (perform_api_call === false || this.perform_api_call) {
    return Promise.resolve({body: payload, url: url})
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

      if (err) {
        const error = new Error()
        error.ErrorMessage = body.ErrorMessage || err.message
        error.ErrorIdentifier = body.ErrorIdentifier
        error.statusCode = err.status || null
        error.response = result || null
        error.message = 'Unsuccessful: ' + error.statusCode + ' ' + error.ErrorMessage
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
function MailjetResource (method, func, options, context) {
  this.base = func
  this.callUrl = func
  this.options = options || context.options

  this.resource = func.toLowerCase()

  this.lastAdded = RESOURCE
  var self = context

  /*
  It can be REST or nothing if we only know the resource
  */
  this.subPath = (function () {
    if (func.toLowerCase() !== 'send' && func.indexOf('sms') === -1) {
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
      if (params.filters) {
        var ret = params.filters
        delete params.filters
        return ret
      } else if (method === 'get') {
        return params
      } else {
        return {}
      }
    })(), that.options)
    
    var secured = null
    if (that.options && 'secured' in that.options) {
      secured = that.options.secured
    } else {
      secured = self.config.secured
    }
    var perform_api_call = null
    if (that.options && 'perform_api_call' in that.options) {
      perform_api_call = that.options.perform_api_call
    } else {
      perform_api_call = self.config.perform_api_call
    }

    that.callUrl = that.base
    self.lastAdded = RESOURCE
    return self.httpRequest(method, (secured ? 'https' : 'http') + '://' + path, params, callback, perform_api_call)
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
MailjetClient.prototype.post = function (func, options) {
  return new MailjetResource('post', func, options, this)
}

/*
 * get.
 *
 * @func {String} required Mailjet API function to be used (can contain a whole action path)
 *
 * @returns a function that make an httpRequest for each call
 */
MailjetClient.prototype.get = function (func, options) {
  return new MailjetResource('get', func, options, this)
}

/*
 * delete.
 *
 * @func {String} required Mailjet API function to be used (can contain a whole action path)
 *
 * @returns a function that make an httpRequest for each call
 */
MailjetClient.prototype.delete = function (func, options) {
  return new MailjetResource('delete', func, options, this)
}

/*
 * put.
 *
 * @func {String} required Mailjet API function to be used (can contain a whole action path)
 *
 * @returns a function that make an httpRequest for each call
 */
MailjetClient.prototype.put = function (func, options) {
  return new MailjetResource('put', func, options, this)
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
