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

const DEBUG_MODE = true;
const FUNCTION = 0;
const ID = 1;
const ACTION = 2;

/*
 * Imports.
 * 
 * qs is used to format the url from the provided parameters and method
 * _path will join a path according to the OS specifications
 * https will be used to make a secure http request to the API
 * fs will simply be used to read files
 */

var qs = require ('querystring')
	, request = require ('request')
	, EventEmitter = require ('events').EventEmitter
	, fs = require ('fs')
	, _path = require ('path');


/*
 * MailjetClient constructor.
 *
 * @qpi_key (optional) {String} mailjet account api key
 * @api_secret (optional) {String} mailjet account api secret
 *
 * If you don't know what this is about, sign up to Mailjet at:
 * https://www.mailjet.com/
 */
function MailjetClient (api_key, api_secret) {
	this.config = require ('./config');
	if (api_key && api_secret)
		this.connect(api_key, api_secret);
};

/**
 *
 * readFile.
 *
 * @file {String} csv file to be uploaded to the Mailjet server
 * @callback {Function} called when the file content is available, after meking the warnings.
 */

MailjetClient.prototype.readFile = function(file, callback) {
	var promise = new EventEmitter().on('error', function () {});
	if (file.indexOf('.csv') === -1)
		console.warn('[WARNING] The file you are trying to upload does not appear to be a csv file.');
	fs.readFile(file, function (err, data) {
		if (err) {
			if (callback) callback(err);
			else promise.emit('error', err);
		} else {
			if (callback) callback(null, data);
			else promise.emit('success', data);
		}
	});
	return promise;
};

/**
 *
 * errorHandler
 * 
 * if fn is mentionned, Set the default error Handler to fn.
 * otherwise return it
 *
 * @fn (optional) {Function} a function that takes a error and a response
 * 
 * @returns either the MailjetClient instance if fn is passed to allow chianing]
 *			or returns the _errorHandler function
 *
 */
MailjetClient.prototype.errorHandler = function(fn) {
	if (fn) {
		this._errorHandler = fn;
		return this;
	} else {
		return this._errorHandler;
	}
};

/*
 * formatJSON.
 *
 * @json {String} response body
 * @return a formatted JSON string with newlines and indentation
 */

MailjetClient.prototype.formatJSON = function(json) {
	return JSON.stringify(json, null, 4);
};

/*
 * [Static] connect.
 *
 * Return a nez connected instance of the MailjetClient class
 *
 * @k {String} mailjet qpi key
 * @s {String} mailjet api secret
 *
 */
MailjetClient.connect = function (k, s) {
	return new MailjetClient().connect(k, s);
}	

/*
 * connect.
 *
 * create a auth property from the api key and secret
 *
 * @api_key {String}
 * @api_secret {String}
 *
 */
MailjetClient.prototype.connect = function(apiKey, apiSecret) {
	this.apiKey = apiKey;
	this.apiSecret = apiSecret;
	return this;
};

/*
 * path.
 *
 * Returns a formatted url from a http method and 
 * a parameters object literal
 *
 * @method {String} GET/POST/...
 * @params {Object literal} {name: value}
 *
 */
MailjetClient.prototype.path = function(method, params) {
	base = this.config.version + 'REST';
	if (Object.keys(params).length === 0)
		return base + '/' + method;

	var q = qs.stringify(params);
	return base + '/' + method + '/?' + q;
};

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

function hasAnArray(object) {
	var keys = Object.keys(object);
	for (var i in keys) {
		var key = keys[i];
		if (object[key] instanceof Array) return true
	}
	return false;
}

MailjetClient.prototype.httpRequest = function(method, url, data, callback) {
	var promise = new EventEmitter().on('error', function () {});
	
	if (url.match(/REST\/send/i))
		url = url.replace(/REST\/send/gi, 'send');
	else if (url.match(/REST\/contactslist\/[0-9]+\/CSVData/gi))
		url = url.replace(/REST/gi, 'DATA').replace(/CSVData/gi, 'CSVData/text:plain');
	else if (url.match(/REST\/batchjob\/[0-9]+\/csvError/gi))
		url = url.replace(/REST/gi, 'DATA').replace(/csverror/gi, 'CSVError/text:csv');

	if (DEBUG_MODE)
		console.log ('Finale url: ' +  url);

	/**
	 * json: true converts the output from string to JSON
	 */
	var options = {
		json: url.indexOf('text:plain') === -1,
		url: url,
		auth: {user: this.apiKey, pass: this.apiSecret}
	}

	if ((method === 'post' || method === 'put') && Object.keys(data).length !== 0) {
		options.body = data;
	}

	/*
	 * request[method] returns either request.post, request.get etc
	 *
	 * If a callback is provided, it triggers it, else it trigger an event
	 * on the promise object
	 */
	request[method](options, function (err, response, body) {
		if (err || (response.statusCode > 210)) {
			if (callback) {
				callback(err || body, response);
			}
			else promise.emit('error', err || body, response);
		} else {
			if (callback) callback(null, response, body);
			else promise.emit('success', response, body);
		}
	});

	return promise;
};

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
	this.base = func;
	this.func = func;
	this.lastAdded = FUNCTION;
	var self = context;

	/**
	 *
	 * result.
	 *
	 * @params (optional) {Object Littteral} parameters to be sent to the server
	 * @callback (optional) {Function} called on response or error
	 */
	this.result = function (params, callback) {
		params = params || {};
		if (typeof params === 'function') {
			callback = params;
			params = {};
		}
		var path = self.path(this.func, method === 'get' ? params : {});
		this.func = this.base;
		self.lastAdded = FUNCTION;
		return self.httpRequest(method, 'https://' + _path.join(self.config.url, path), params, callback);
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
MailjetResource.prototype.id = function(value) {
	if (isNaN(parseInt(value)))
		throw new Error('Invalid ID value');
	if (this.lastAdded === ID)
		console.warn('[WARNING] your request may fail due to invalid id chaining');

	this.func = _path.join(this.func, value.toString());
	this.lastAdded = ID;
	return this;
};

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
MailjetResource.prototype.action = function(name) {
	if (this.lastAdded === ACTION)
		console.warn('[WARNING] your request may fail due to invalid action chaining');
	this.func = _path.join(this.func, name);
	this.lastAdded = ACTION;
	return this;
};

/**
 *
 * request.
 *
 * @parmas {Object literal} method parameters
 * @callback (optional) {Function} triggered when done
 * 
 * @return {String} the server response
 */

MailjetResource.prototype.request = function(params, callback) {
	return this.result(params, callback);
};

/*
 * post.
 *
 * @func {String} required Mailjet API function to be used (can contain a whole action path)
 *
 * @returns a function that make an httpRequest for each call
 */
MailjetClient.prototype.post = function(func) {
	return new MailjetResource('post', func, this);
};


/*
 * get.
 *
 * @func {String} required Mailjet API function to be used (can contain a whole action path)
 *
 * @returns a function that make an httpRequest for each call
 */
MailjetClient.prototype.get = function(func) {
	return new MailjetResource('get', func, this);
};

/*
 * delete.
 *
 * @func {String} required Mailjet API function to be used (can contain a whole action path)
 *
 * @returns a function that make an httpRequest for each call
 */
MailjetClient.prototype.delete = function(func) {
	return new MailjetResource('delete', func, this);
};

/*
 * put.
 *
 * @func {String} required Mailjet API function to be used (can contain a whole action path)
 *
 * @returns a function that make an httpRequest for each call
 */
MailjetClient.prototype.put = function(func) {
	return new MailjetResource('put', func, this);
};

/*
 * Exports the Mailjet client.
 *
 * you can require it like so:
 * var mj = require ('./mailjet-client');
 *
 * or for the bleeding edge developpers out there:
 * import mj from './mailjet-client';
 */
module.exports = MailjetClient;
