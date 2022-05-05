/*external modules*/
const chai = require('chai');
const nock = require('nock');
const qs = require('querystring');
/*lib*/
const { MailjetClient } = require('../../mailjet-client');
/*other*/

const expect = chai.expect;
const expectOwnProperty = (targetObject, path, value) => {
  return expect(targetObject).to.have.ownProperty(path, value);
};

function buildBasicAuthStr(apiKey, apiSecret) {
  return Buffer.from(`${apiKey}:${apiSecret}`, 'utf-8').toString('base64');
}

describe('Unit MailjetClient', () => {

  describe('static part', () => {

    describe('MailjetClient.constructor()', () => {

      it('should be call the "authStrategy" method', () => {
        const connectArguments = {};
        const ProxyMailjetClient = new Proxy(MailjetClient, {
          get(target, prop, receiver) {
            if(prop === 'prototype') {
              return {
                ...MailjetClient.prototype,
                authStrategy(apiKey, apiSecret, options, perform_api_call) {
                  connectArguments.apiKey = apiKey;
                  connectArguments.apiSecret = apiSecret;
                  connectArguments.options = options;
                  connectArguments.perform_api_call = perform_api_call;
                }
              };
            } else {
              return Reflect.get(target, prop, receiver);
            }
          }
        });

        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const performApiCall = false;
        const options = {
          perform_api_call: performApiCall
        };

        new ProxyMailjetClient(API_KEY, API_SECRET, options, performApiCall);

        expectOwnProperty(connectArguments, 'apiKey', API_KEY);
        expectOwnProperty(connectArguments, 'apiSecret', API_SECRET);
        expectOwnProperty(connectArguments, 'perform_api_call', performApiCall);
        expect(connectArguments).to.have.ownProperty('options').that.is.equal(options);
      });

    });

    describe('MailjetClient.connect()', () => {

      it('should be have own method #connect()', () => {
        expect(MailjetClient).itself.to.respondsTo('connect');
      });

      it('should be call the prototype method "connect"', () => {
        const connectArguments = {};
        const ProxyMailjetClient = new Proxy(MailjetClient, {
          get(target, prop, receiver) {
            if(prop === 'prototype') {
              return {
                ...MailjetClient.prototype,
                connect(apiKey, apiSecret, options) {
                  connectArguments.apiKey = apiKey;
                  connectArguments.apiSecret = apiSecret;
                  connectArguments.options = options;
                }
              };
            } else if(prop === 'connect') {
              return (...args) => {
                new ProxyMailjetClient().connect(...args);
              };
            } else {
              return Reflect.get(target, prop, receiver);
            }
          }
        });

        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const options = {
          perform_api_call: false
        };

        ProxyMailjetClient.connect(API_KEY, API_SECRET, options);

        expectOwnProperty(connectArguments, 'apiKey', API_KEY);
        expectOwnProperty(connectArguments, 'apiSecret', API_SECRET);
        expect(connectArguments).to.have.ownProperty('options').that.is.equal(options);
      });

    });

  });

  describe('instance part', () => {
    const config = require('../../config.json');
    const packageJSON = require('../../package.json');

    describe('MailjetClient.authStrategy()', () => {

      it('should be have prototype method #authStrategy()', () => {
        expect(MailjetClient).to.respondsTo('authStrategy');
      });

      it('should be create instance by token strategy', () => {
        const connectArguments = {};
        const ProxyMailjetClient = new Proxy(MailjetClient, {
          get(target, prop, receiver) {
            if(prop === 'prototype') {
              return {
                ...MailjetClient.prototype,
                connect(apiToken, options) {
                  connectArguments.apiToken = apiToken;
                  connectArguments.options = options;
                }
              };
            } else {
              return Reflect.get(target, prop, receiver);
            }
          }
        });

        const API_TOKEN = 'token';
        const options = {
          perform_api_call: false
        };

        const client = new ProxyMailjetClient(API_TOKEN, options);

        expect(client).to.be.a('object');

        expectOwnProperty(client,'perform_api_call', false);
        expectOwnProperty(client,'version', packageJSON.version);

        expectOwnProperty(connectArguments, 'apiToken', API_TOKEN);
        expect(connectArguments).to.have.ownProperty('options').that.is.equal(options);
      });

      it('should be create instance by basic strategy', () => {
        const connectArguments = {};
        const ProxyMailjetClient = new Proxy(MailjetClient, {
          get(target, prop, receiver) {
            if(prop === 'prototype') {
              return {
                ...MailjetClient.prototype,
                connect(apiKey, apiSecret, options) {
                  connectArguments.apiKey = apiKey;
                  connectArguments.apiSecret = apiSecret;
                  connectArguments.options = options;
                }
              };
            } else {
              return Reflect.get(target, prop, receiver);
            }
          }
        });

        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const options = {
          perform_api_call: false
        };

        const client = new ProxyMailjetClient(API_KEY, API_SECRET, options);

        expect(client).to.be.a('object');

        expectOwnProperty(client,'perform_api_call', false);
        expectOwnProperty(client,'version', packageJSON.version);
        expect(client).to.have.ownProperty('config').that.is.deep.equal({ ...config, ...options });

        expectOwnProperty(connectArguments, 'apiKey', API_KEY);
        expectOwnProperty(connectArguments, 'apiSecret', API_SECRET);
        expect(connectArguments).to.have.ownProperty('options').that.is.equal(options);
      });

    });

    describe('MailjetClient.connectStrategy()', () => {

      it('should be have prototype method #connectStrategy()', () => {
        expect(MailjetClient).to.respondsTo('connectStrategy');
      });

      it('should be connect by token strategy', () => {
        const API_TOKEN = 'token';
        const options = {
          perform_api_call: false
        };

        const client = MailjetClient.connect(API_TOKEN, options);

        expect(client).to.be.a('object');

        expectOwnProperty(client,'apiToken', API_TOKEN);
        expect(client).to.have.ownProperty('options').that.equal(options);
        expect(client).to.have.ownProperty('config').that.deep.equal({ ...config, ...options });
      });

      it('should be throw error if api token not provided', () => {
        const API_TOKEN = null;
        const options = {
          perform_api_call: false
        };

        expect(() => MailjetClient.connect(API_TOKEN, options)).to.throw(Error, 'Mailjet API_TOKEN is required');
      });

      it('should be connect by basic strategy', () => {
        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const options = {
          perform_api_call: false
        };

        const client = MailjetClient.connect(API_KEY, API_SECRET, options);

        expect(client).to.be.a('object');

        expectOwnProperty(client,'apiKey', API_KEY);
        expectOwnProperty(client,'apiSecret', API_SECRET);
        expect(client).to.have.ownProperty('options').that.equal(options);
        expect(client).to.have.ownProperty('config').that.deep.equal({ ...config, ...options });
      });

      it('should be throw error if api key not provided', () => {
        const API_KEY = null;
        const API_SECRET = 'secret';
        const options = {
          perform_api_call: false
        };

        expect(() => MailjetClient.connect(API_KEY, API_SECRET, options)).to.throw(Error, 'Mailjet API_KEY is required');
      });

    });

    describe('MailjetClient.isTokenRequired()', () => {

      it('should be have prototype method #isTokenRequired()', () => {
        expect(MailjetClient).to.respondsTo('isTokenRequired');
      });

      it('should be return true if it is token strategy', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;

        const API_TOKEN = '';

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);
        const isTokenRequired = client.isTokenRequired(API_TOKEN);

        expect(isTokenRequired).to.equal(true);
      });

      it('should be return true if it is token strategy with options', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;

        const API_TOKEN = '';

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);
        const isTokenRequired = client.isTokenRequired(API_TOKEN, options);

        expect(isTokenRequired).to.equal(true);
      });

      it('should be return false if it is basic strategy', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);
        const isTokenRequired = client.isTokenRequired(API_KEY, API_SECRET);

        expect(isTokenRequired).to.equal(false);
      });

      it('should be return false if it is basic strategy with options', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);
        const isTokenRequired = client.isTokenRequired(API_KEY, API_SECRET, options);

        expect(isTokenRequired).to.equal(false);
      });

    });

    describe('MailjetClient.connect()', () => {

      it('should be have prototype method #connect()', () => {
        expect(MailjetClient).to.respondsTo('connect');
      });

      it('should be call the "connectStrategy" method', () => {
        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const options = {
          perform_api_call: false
        };
        const perform_api_call = true;
        const connectStrategyArguments = {};

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);

        client.connectStrategy = (apiKey, apiSecret, options) => {
          connectStrategyArguments.apiKey = apiKey;
          connectStrategyArguments.apiSecret = apiSecret;
          connectStrategyArguments.options = options;
        };
        client.connect(API_KEY, API_SECRET, options);

        expectOwnProperty(connectStrategyArguments, 'apiKey', API_KEY);
        expectOwnProperty(connectStrategyArguments, 'apiSecret', API_SECRET);
        expect(connectStrategyArguments).to.have.ownProperty('options').that.is.equal(options);
      });

    });

    describe('MailjetClient.setConfig()', () => {

      it('should be have prototype method #setConfig()', () => {
        expect(MailjetClient).to.respondsTo('setConfig');
      });

      it('should be return config', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);
        const clientConfig = client.setConfig({});

        expect(clientConfig).to.deep.equal(config);
      });

      it('should be return config with custom options', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;

        const configOptions = {
          url: 'testurl',
          version: 'v1',
          perform_api_call: false,
        };

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);
        const clientConfig = client.setConfig(configOptions);

        expect(clientConfig).to.deep.equal({ ...config, ...configOptions });
      });

      it('should be throw error if argument "options" is not object', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);

        // TODO: need add "undefined"
        ['', 5, true, Symbol(), BigInt(5)].forEach(arg => {
          expect(() => client.setConfig(arg)).to.throw(Error, 'warning, your options variable is not a valid object.');
        });
      });

    });

    describe('MailjetClient.path()', () => {

      it('should be have prototype method #path()', () => {
        expect(MailjetClient).to.respondsTo('path');
      });

      it('should be build path', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;

        const resource = 'contact';
        const subPath = 'REST';
        const params = {};

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);
        const path = client.path(resource, subPath, params);

        expect(path).to.be.a('string');
        expect(path).to.equal(`${config.url}/${config.version}/${subPath}/${resource}`);
      });

      it('should be build path with custom options', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;

        const resource = 'contact';
        const subPath = 'REST';
        const params = {};
        const pathOptions = {
          url: 'next-api.mailjet.com',
          version: 'v1'
        };

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);
        const path = client.path(resource, subPath, params, pathOptions);

        expect(path).to.be.a('string');
        expect(path).to.equal(`${pathOptions.url}/${pathOptions.version}/${subPath}/${resource}`);
      });

      it('should be build path with params', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;

        const resource = 'contact';
        const subPath = 'REST';
        const params = {
          a: 5,
          b: 'some text',
          c: true
        };

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);

        const querystring = qs.stringify(params);
        const path = client.path(resource, subPath, params);

        expect(path).to.be.a('string');
        expect(path).to.equal(`${config.url}/${config.version}/${subPath}/${resource}?${querystring}`);
      });

    });

    describe('MailjetClient.httpRequest()', () => {
      const REQUEST_DELAY = 10;

      after(function () {
        nock.cleanAll();
      });

      it('should be have prototype method #httpRequest()', () => {
        expect(MailjetClient).to.respondsTo('httpRequest');
      });

      it('should be request with content type application/json', async () => {
        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const options = {};

        const apiVersion = 'v3';
        const resource = 'contact';
        const data = {
          a: 5,
          b: 6,
          c: 7
        };

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {
          a: 5,
          b: 'text',
          c: false
        };
        const requestData = {};
        nock('https://api.mailjet.com')
          .get(path)
          .query(true)
          .delayConnection(REQUEST_DELAY)
          .reply(200, function (uri, reqBody) {
            requestData.path = this.req.path;
            requestData.headers = this.req.headers;
            requestData.body = reqBody;

            return JSON.stringify(resultData);
          });

        const client = MailjetClient.connect(API_KEY, API_SECRET, options);
        const result = await client
          .get(resource, options)
          .request(data);

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData,'path', `${path}?${qs.stringify(data)}`);
        expectOwnProperty(requestData,'body', '');

        expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers,'content-type', 'application/json');
        expectOwnProperty(requestData.headers,'host', 'api.mailjet.com');
        expectOwnProperty(requestData.headers,'authorization', `Basic ${buildBasicAuthStr(API_KEY, API_SECRET)}`);
      });

      it('should be request with content type text/plain', async () => {
        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const options = {};

        const apiVersion = 'v3';
        const resource = 'contactslist';
        const action = 'csvdata';
        const contactListId = 124123;
        const CSVData = '"name","age"\n"test",25';

        const path = `/${apiVersion}/DATA/${resource}/${contactListId}/${action}/text:plain`;
        const resultData = {
          a: 5,
          b: 'text',
          c: false
        };
        const requestData = {};
        nock('https://api.mailjet.com')
          .post(path)
          .delayConnection(REQUEST_DELAY)
          .reply(200, function (uri, reqBody) {
            requestData.path = this.req.path;
            requestData.headers = this.req.headers;
            requestData.body = reqBody;

            return JSON.stringify(resultData);
          });

        const client = MailjetClient.connect(API_KEY, API_SECRET, options);
        const result = await client
          .post(resource)
          .id(contactListId)
          .action(action)
          .request(CSVData);

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData,'path', path);
        expectOwnProperty(requestData,'body', CSVData);

        expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers,'content-type', 'text/plain');
        expectOwnProperty(requestData.headers,'host', 'api.mailjet.com');
        expectOwnProperty(requestData.headers,'authorization', `Basic ${buildBasicAuthStr(API_KEY, API_SECRET)}`);
      });

      it('should be request with api token', async () => {
        const API_TOKEN = 'token';
        const options = {};

        const apiVersion = 'v4';
        const resource = 'sms-send';
        const data = { something: 'text' };

        const path = `/${apiVersion}/${resource}`;
        const resultData = {
          a: 5,
          b: 'text',
          c: false
        };
        const requestData = {};
        nock('https://api.mailjet.com')
          .post(path)
          .delayConnection(REQUEST_DELAY)
          .reply(200, function (uri, reqBody) {
            requestData.path = this.req.path;
            requestData.headers = this.req.headers;
            requestData.body = reqBody;

            return JSON.stringify(resultData);
          });

        const client = MailjetClient.connect(API_TOKEN, options);
        const result = await client
          .post(resource, { version: apiVersion })
          .request(data);

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData,'path', path);
        expect(requestData).to.have.ownProperty('body').that.deep.equal(data);

        expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers,'content-type', 'application/json');
        expectOwnProperty(requestData.headers,'host', 'api.mailjet.com');
        expectOwnProperty(requestData.headers,'authorization', `Bearer ${API_TOKEN}`);
      });

      it('should be request with payload', async () => {
        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const options = {};

        const apiVersion = 'v3';
        const resource = 'contactdata';
        const contactId = 2345234;
        const data = {
          Data: [
            {
              firstName: 'John',
              lastName: 'Smith'
            }
          ]
        };

        await Promise.all(
          ['post', 'put'].map(async (method) => {
            const path = `/${apiVersion}/REST/${resource}/${contactId}`;
            const resultData = {
              a: 5,
              b: 'text',
              c: false
            };
            const requestData = {};
            nock('https://api.mailjet.com')[method](path)
              .delayConnection(REQUEST_DELAY)
              .reply(200, function (uri, reqBody) {
                requestData.path = this.req.path;
                requestData.headers = this.req.headers;
                requestData.body = reqBody;

                return JSON.stringify(resultData);
              });

            const client = MailjetClient.connect(API_KEY, API_SECRET, options);
            const result = await client[method](resource)
              .id(contactId)
              .request(data);

            expect(result).to.be.a('object');
            expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

            expectOwnProperty(requestData,'path', path);
            expect(requestData).to.have.ownProperty('body').that.deep.equal(data);

            expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
            expectOwnProperty(requestData.headers,'content-type', 'application/json');
            expectOwnProperty(requestData.headers,'host', 'api.mailjet.com');
            expectOwnProperty(requestData.headers,'authorization', `Basic ${buildBasicAuthStr(API_KEY, API_SECRET)}`);
          })
        );
      });

      it('should be skip request if perform call is false', async () => {
        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const options = {};

        const apiVersion = 'v3';
        const resource = 'contactdata';
        const contactId = 2345234;
        const data = {
          Data: [
            {
              firstName: 'John',
              lastName: 'Smith'
            }
          ]
        };

        await Promise.all(
          ['post', 'put', 'get', 'delete'].map(async (method) => {
            const path = `/${apiVersion}/REST/${resource}/${contactId}`;

            const client = MailjetClient.connect(API_KEY, API_SECRET, options);
            const result = await client[method](resource, { perform_api_call: false })
              .id(contactId)
              .request(data);

            if(['post', 'put'].includes(method)) {
              const url = `https://api.mailjet.com${path}`;

              expectOwnProperty(result,'url', url);
              expect(result)
                .to.have.ownProperty('body')
                .that.deep.equal(data);
            } else {
              const url = `https://api.mailjet.com${path}${method === 'get' ? `?${qs.stringify(data)}` : ''}`;

              expectOwnProperty(result,'url', url);
              expect(result)
                .to.have.ownProperty('body')
                .that.deep.equal({});
            }
          })
        );
      });

      it('should be request by delete method', async () => {
        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const options = {};

        const apiVersion = 'v3';
        const resource = 'contact';
        const data = {
          a: 5,
          b: 6,
          c: 7
        };

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {
          deleted: true
        };
        const requestData = {};
        nock('https://api.mailjet.com')
          .delete(path)
          .delayConnection(REQUEST_DELAY)
          .reply(200, function (uri, reqBody) {
            requestData.path = this.req.path;
            requestData.headers = this.req.headers;
            requestData.body = reqBody;

            return JSON.stringify(resultData);
          });

        const client = MailjetClient.connect(API_KEY, API_SECRET, options);
        const result = await client
          .delete(resource, options)
          .request(data);

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData,'path', path);
        expectOwnProperty(requestData,'body', '');

        expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers,'content-type', 'application/json');
        expectOwnProperty(requestData.headers,'host', 'api.mailjet.com');
        expectOwnProperty(requestData.headers,'authorization', `Basic ${buildBasicAuthStr(API_KEY, API_SECRET)}`);
      });

      it('should be throw error message', async () => {
        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const options = {};

        const apiVersion = 'v3';
        const resource = 'contact';

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {
          ErrorMessage: 'some reason'
        };
        const statusCode = 404;
        nock('https://api.mailjet.com')
          .get(path)
          .query(true)
          .delayConnection(REQUEST_DELAY)
          .reply(statusCode, JSON.stringify(resultData));

        const client = MailjetClient.connect(API_KEY, API_SECRET, options);

        let error = null;
        try {
          await client
            .get(resource, options)
            .request({});
        } catch (err) {
          error = err;

          expectOwnProperty(err,'ErrorMessage', resultData.ErrorMessage);
          expectOwnProperty(err,'statusCode', statusCode);
          expectOwnProperty(err,'message', `Unsuccessful: Status Code: "${statusCode}" Message: "${resultData.ErrorMessage}"`);
        } finally {
          expect(error).to.be.not.null;
        }
      });

      it('should be throw error with full message', async () => {
        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const options = {};

        const apiVersion = 'v3';
        const resource = 'contact';

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {
          ErrorMessage: 'some reason',
          Messages: [
            {
              Errors: [
                {
                  ErrorMessage: 'full information'
                }
              ]
            }
          ]
        };

        const statusCode = 404;
        nock('https://api.mailjet.com')
          .get(path)
          .query(true)
          .delayConnection(REQUEST_DELAY)
          .reply(statusCode, JSON.stringify(resultData));

        const client = MailjetClient.connect(API_KEY, API_SECRET, options);

        let error = null;
        try {
          await client
            .get(resource, options)
            .request({});
        } catch (err) {
          error = err;

          expectOwnProperty(err,'ErrorMessage', resultData.ErrorMessage);
          expectOwnProperty(err,'statusCode', statusCode);

          const fullMessage = resultData.Messages[0].Errors[0].ErrorMessage;
          expectOwnProperty(
            err,
            'message',
            `Unsuccessful: Status Code: "${statusCode}" Message: "${resultData.ErrorMessage}";\n${fullMessage}`
          );
        } finally {
          expect(error).to.be.not.null;
        }
      });

      it('should be throw detailed error message', async () => {
        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const options = {};

        const apiVersion = 'v3';
        const resource = 'contact';

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {
          ErrorMessage: 'some reason',
          ErrorIdentifier: '3425-345345-345345-345345',
          ErrorCode: 710,
          ErrorRelatedTo: 'Data.Email'
        };
        const statusCode = 404;
        nock('https://api.mailjet.com')
          .get(path)
          .query(true)
          .delayConnection(REQUEST_DELAY)
          .reply(statusCode, JSON.stringify(resultData));

        const client = MailjetClient.connect(API_KEY, API_SECRET, options);

        let error = null;
        try {
          await client
            .get(resource, options)
            .request({});
        } catch (err) {
          error = err;

          expectOwnProperty(err,'statusCode', statusCode);
          expectOwnProperty(err,'message', `Unsuccessful: Status Code: "${statusCode}" Message: "${resultData.ErrorMessage}"`);

          expectOwnProperty(err,'ErrorMessage', resultData.ErrorMessage);
          expectOwnProperty(err,'ErrorIdentifier', resultData.ErrorIdentifier);
          expectOwnProperty(err,'ErrorCode', resultData.ErrorCode);
          expectOwnProperty(err,'ErrorRelatedTo', resultData.ErrorRelatedTo);
        } finally {
          expect(error).to.be.not.null;
        }
      });

    });

    describe('MailjetClient.post()', () => {

      it('should be have prototype method #post()', () => {
        expect(MailjetClient).to.respondsTo('post');
      });

      it('should create an MailjetResource instance', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;
        const resource = 'Contact';

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);
        const instance = client.post(resource, options);

        expect(instance).to.be.a('object');
        expect(client).to.be.a('object');

        expectOwnProperty(instance,'base', resource);
        expectOwnProperty(instance,'callUrl', resource);
        expectOwnProperty(instance,'options', options);
        expectOwnProperty(instance,'resource', resource.toLowerCase());
        expectOwnProperty(instance,'lastAdded', 0);
        expectOwnProperty(instance,'subPath', 'REST');
        expect(instance).to.have.ownProperty('result').that.is.a('function');
      });

    });

    describe('MailjetClient.get()', () => {

      it('should be have prototype method #get()', () => {
        expect(MailjetClient).to.respondsTo('get');
      });

      it('should create an MailjetResource instance', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;
        const resource = 'Contact';

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);
        const instance = client.get(resource, options);

        expect(instance).to.be.a('object');
        expect(client).to.be.a('object');

        expectOwnProperty(instance,'base', resource);
        expectOwnProperty(instance,'callUrl', resource);
        expectOwnProperty(instance,'options', options);
        expectOwnProperty(instance,'resource', resource.toLowerCase());
        expectOwnProperty(instance,'lastAdded', 0);
        expectOwnProperty(instance,'subPath', 'REST');
        expect(instance).to.have.ownProperty('result').that.is.a('function');
      });

    });

    describe('MailjetClient.delete()', () => {

      it('should be have prototype method #delete()', () => {
        expect(MailjetClient).to.respondsTo('delete');
      });

      it('should create an MailjetResource instance', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;
        const resource = 'Contact';

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);
        const instance = client.delete(resource, options);

        expect(instance).to.be.a('object');
        expect(client).to.be.a('object');

        expectOwnProperty(instance,'base', resource);
        expectOwnProperty(instance,'callUrl', resource);
        expectOwnProperty(instance,'options', options);
        expectOwnProperty(instance,'resource', resource.toLowerCase());
        expectOwnProperty(instance,'lastAdded', 0);
        expectOwnProperty(instance,'subPath', 'REST');
        expect(instance).to.have.ownProperty('result').that.is.a('function');
      });

    });

    describe('MailjetClient.put()', () => {

      it('should be have prototype method #put()', () => {
        expect(MailjetClient).to.respondsTo('put');
      });

      it('should create an MailjetResource instance', () => {
        const API_KEY = '';
        const API_SECRET = '';
        const options = {};
        const perform_api_call = true;
        const resource = 'Contact';

        const client = new MailjetClient(API_KEY, API_SECRET, options, perform_api_call);
        const instance = client.put(resource, options);

        expect(instance).to.be.a('object');
        expect(client).to.be.a('object');

        expectOwnProperty(instance,'base', resource);
        expectOwnProperty(instance,'callUrl', resource);
        expectOwnProperty(instance,'options', options);
        expectOwnProperty(instance,'resource', resource.toLowerCase());
        expectOwnProperty(instance,'lastAdded', 0);
        expectOwnProperty(instance,'subPath', 'REST');
        expect(instance).to.have.ownProperty('result').that.is.a('function');
      });

    });
  });
});