/*external modules*/
import chai from 'chai';
import nock from 'nock';
import qs from 'qs';
import superagent from 'superagent';
/*lib*/
import Client, { Request } from '../../lib/index.js';
import packageJSON from '../../package.json' assert { type: 'json' };
/*utils*/
/*helpers*/
import { expectOwnProperty } from '../helpers/index.js';
/*other*/

const expect = chai.expect;

// old test have 28 its - new have 66 its

describe('Unit Request', () => {

  describe('static part', () => {

    describe('Request.constructor()', () => {

      it('should be create instance and set custom application/json superagent parser', () => {
        const resource = 'Contact';
        const method = 'get';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            performAPICall: false
          }
        };
        const customConfig = {
          host: 'new.api.mailjet',
          version: 'v7',
          output: 'xml',
          performAPICall: true
        };

        const client = new Client(params);
        const request = new Request(client, method, resource, customConfig);

        expect(request).to.be.a('object');

        expectOwnProperty(request,'client', client);
        expectOwnProperty(request,'method', method);
        expectOwnProperty(request,'url', resource.toLowerCase());
        expectOwnProperty(request,'resource', resource.toLowerCase());
        expectOwnProperty(request,'subPath', 'REST');
        expectOwnProperty(request,'actionPath', null);

        expect(request)
          .to.haveOwnProperty('config')
          .that.is.eql(customConfig)
          .but.is.not.equal(customConfig);

        expect(superagent).to.be.a('function');

        expect(superagent)
          .to.haveOwnProperty('parse')
          .that.be.a('object')
          .and.that.to.haveOwnProperty('application/json')
          .that.be.a('function');
      });

      it('should be create instance with default empty config', () => {
        const resource = 'send-sms';
        const method = 'post';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            performAPICall: false
          }
        };

        const client = new Client(params);

        [null, undefined].forEach(config => {
          const request = new Request(client, method, resource, config);

          expect(request).to.be.a('object');

          expectOwnProperty(request,'client', client);
          expectOwnProperty(request,'method', method);
          expectOwnProperty(request,'url', resource);
          expectOwnProperty(request,'resource', resource.toLowerCase());
          expectOwnProperty(request,'subPath', '');
          expectOwnProperty(request,'actionPath', null);

          expect(request)
            .to.haveOwnProperty('config')
            .that.is.eql({});
        });
      });

      it('should be throw error if passed argument "client" is not instance from Client', () => {
        const resource = 'Contact';
        const method = 'get';

        [null, undefined, {}, Object.create(null)].forEach(client => {
          expect(() => new Request(client, method, resource, null))
            .to.throw(Error, 'Argument "client" must be instance of Client');
        });
      });

      it('should be throw error if passed argument "method" is not supported', () => {
        const resource = 'Contact';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            performAPICall: false
          }
        };

        const client = new Client(params);

        ['head', 'connect', 'options', 'trace', 'patch'].forEach(method => {
          expect(() => new Request(client, method, resource, null))
            .to.throw(Error, 'Argument "method" must be one of supported methods: get, post, put, delete');
        });
      });

      it('should be throw error if passed argument "resource" is not string', () => {
        const method = 'get';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            performAPICall: false
          }
        };

        const client = new Client(params);

        [5, true, undefined, null, Symbol(), BigInt(5), {}].forEach(resource => {
          expect(() => new Request(client, method, resource, null))
            .to.throw(Error, 'Argument "resource" must be string');
        });
      });

    });

    describe('Request.protocol', () => {

      it('should be have own property #protocol', () => {
        expect(Request).to.haveOwnProperty('protocol');
      });

      it('should be equal to secure http', () => {
        expect(Request.protocol).to.be.equal('https://');
      });

    });

    describe('Request.methods', () => {

      it('should be have own property #methods', () => {
        expect(Request).to.haveOwnProperty('protocol');
      });

      it('should be equal to object with supported methods', () => {
        expect(Request.methods).to.be.deep.equal({
          get: 'get',
          post: 'post',
          put: 'put',
          delete: 'delete'
        });
      });

    });

  });

  describe('instance part', () => {
    const API_MAILJET_URL = `${Request.protocol}${Client.config.host}`

    function buildBasicAuthStr(apiKey, apiSecret) {
      return Buffer.from(`${apiKey}:${apiSecret}`, 'utf-8').toString('base64');
    }

    after(function () {
      nock.cleanAll();
    });

    describe('Request.getUserAgent()', () => {

      it('should be have prototype method #getUserAgent()', () => {
        expect(Request).to.respondsTo('getUserAgent');
      });

      it('should be return user agent value', () => {
        const resource = 'Contact';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            performAPICall: false
          }
        };

        const request = new Client(params).get(resource);
        const userAgent = request.getUserAgent();

        expect(userAgent).to.equal(`mailjet-api-v3-nodejs/${packageJSON.version}`)
      });

    });

    describe('Request.getContentType()', () => {

      it('should be have prototype method #getContentType()', () => {
        expect(Request).to.respondsTo('getContentType');
      });

      it('should be return content type "application/json"', () => {
        [
          `${API_MAILJET_URL}/v3/REST/contact`,
          `${API_MAILJET_URL}/v3/REST/contact?contatctList=34`,
          `${API_MAILJET_URL}/v3/DATA/batchjob/csverror/text:csv`,
          `${API_MAILJET_URL}/v3/send`
        ].forEach(url => {
          const contentType = Request.prototype.getContentType.call(null, url);

          expect(contentType).to.equal('application/json')
        })
      })

      it('should be return content type "text/plain"', () => {
        const url = `${API_MAILJET_URL}/v3/DATA/contactslist/34/csvdata/text:plain`

        const contentType = Request.prototype.getContentType.call(null, url);

        expect(contentType).to.equal('text/plain')
      })

      it('should be throw error if argument "url" is not string', () => {
        [5, true, undefined, null, Symbol(), BigInt(5), {}].forEach(url => {
          expect(() => Request.prototype.getContentType.call(null, url))
            .to.throw(Error, 'Argument "url" must be string');
        });
      })

    });

    describe('Request.getCredentials()', () => {

      it('should be have prototype method #getCredentials()', () => {
        expect(Request).to.respondsTo('getCredentials');
      });

      it('should be return credentials based on Client instance', () => {
        const resource = 'Contact';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const request = new Client(params).get(resource);
        const credentials = request.getCredentials();

        expect(credentials).to.deep.equal({
          ...params,
          apiToken: undefined
        })
      })

    });

    describe('Request.getPerformAPICall()', () => {

      it('should be have prototype method #getPerformAPICall()', () => {
        expect(Request).to.respondsTo('getPerformAPICall');
      });

      it('should be return value by Request config', () => {
        const resource = 'Contact';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            performAPICall: false
          }
        };
        const customConfig = {
          performAPICall: true
        }

        const request = new Client(params).get(resource, customConfig);
        const performAPICall = request.getPerformAPICall();

        expect(performAPICall).to.equal(customConfig.performAPICall)
      })

      it('should be return value by Client config', () => {
        const resource = 'Contact';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            performAPICall: false
          }
        };
        const customConfig = {}

        const request = new Client(params).get(resource, customConfig);
        const performAPICall = request.getPerformAPICall();

        expect(performAPICall).to.equal(params.config.performAPICall)
      })

    });

    describe('Request.getParams()', () => {

      it('should be have prototype method #getParams()', () => {
        expect(Request).to.respondsTo('getParams');
      });

      it('should be return "filters" if "params" passed with "filters"', () => {
        const params = {
          a: 5,
          b: 'text',
          filters: {
            Limit: 100
          }
        };

        const result = Request.prototype.getParams.call(null, params);

        expect(result).to.be.a('object');

        expect(result)
          .to.eql(params.filters)
          .but.not.equal(params.filters);
      })

      it('should be return passed params for GET method', () => {
        const resource = 'Contact';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };
        const queryParams = {
          a: 5,
          b: 'text',
        };

        const client = new Client(params);
        const request = new Request(client, 'get', resource)

        const result = request.getParams(queryParams);

        expect(result).to.be.a('object')

        expect(result)
          .to.eql(queryParams)
          .but.not.equal(queryParams);
      })

      it('should be return empty params object for POST/PUT/DELETE methods', () => {
        ['post', 'put', 'delete'].forEach(method => {
          const resource = 'Contact';

          const params = {
            apiKey: 'key',
            apiSecret: 'secret'
          };
          const queryParams = {
            a: 5,
            b: 'text',
          };

          const client = new Client(params);
          const request = new Request(client, method, resource)

          const result = request.getParams(queryParams);

          expect(result).to.be.a('object')

          expect(result).to.eql({});
        })
      })

      it('should be return empty object if passed argument is not object or null', () => {
        [5, true, undefined, null, Symbol(), BigInt(5)].forEach(params => {
          const result = Request.prototype.getParams.call(null, params);

          expect(result).to.be.a('object')
          expect(result).to.deep.equal({})
        });
      })

    });

    describe('Request.getRequest()', () => {

      it('should be have prototype method #getRequest()', () => {
        expect(Request).to.respondsTo('getRequest');
      });

      it('should be request with basic auth', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false
        };
        const requestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .reply(200, function () {
            requestData.headers = this.req.headers;

            return JSON.stringify(resultData);
          });

        const instance = new Client(params).get(resource);
        const result = await instance.request();

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers,'content-type', 'application/json');
        expectOwnProperty(requestData.headers,'accept', 'application/json');
        expectOwnProperty(requestData.headers,'host', Client.config.host);
        expectOwnProperty(requestData.headers,'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);
      })

      it('should be request with bearer token auth', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params = {
          apiToken: 'token'
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false
        };
        const requestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .post(path)
          .reply(200, function () {
            requestData.headers = this.req.headers;

            return JSON.stringify(resultData);
          });

        const instance = new Client(params).post(resource);
        const result = await instance.request();

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers,'content-type', 'application/json');
        expectOwnProperty(requestData.headers,'accept', 'application/json');
        expectOwnProperty(requestData.headers,'host', Client.config.host);
        expectOwnProperty(requestData.headers,'authorization', `Bearer ${params.apiToken}`);
      })

      it('should be request with custom headers', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            requestHeaders: {
              'Accept-Charset': 'utf-8',
              'Access-Control-Allow-Origin': 'https://mozilla.org'
            }
          }
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false
        };
        const requestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .put(path)
          .reply(200, function () {
            requestData.headers = this.req.headers;

            return JSON.stringify(resultData);
          });

        const instance = new Client(params).put(resource);
        const result = await instance.request();

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers,'content-type', 'application/json');
        expectOwnProperty(requestData.headers,'accept', 'application/json');
        expectOwnProperty(requestData.headers,'host', Client.config.host);
        expectOwnProperty(requestData.headers,'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);

        Object
          .entries(params.options.requestHeaders)
          .forEach(([key, value]) => {
            expectOwnProperty(requestData.headers, key.toLowerCase(), value);
          })
      })

      it('should be request with timeout', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            timeout: 35
          }
        };

        const requestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .delayConnection(100)
          .reply(200, function () {
            requestData.headers = this.req.headers;

            return '{}';
          });

        const instance = new Client(params).get(resource);

        let error = null;
        try {
          await instance.request();
        } catch (err) {
          error = err;

          const errorMessage = `Response timeout of ${params.options.timeout}ms exceeded`;

          expectOwnProperty(err,'message', `Unsuccessful: Status Code: "null" Message: "${errorMessage}"`);
          expectOwnProperty(err,'ErrorMessage', errorMessage);
          expectOwnProperty(err,'code', 'ECONNABORTED');
          expectOwnProperty(err,'errno', 'ETIMEDOUT');

          expect(err.timeout).to.equal(params.options.timeout);
          expect(err.statusCode).to.equal(null);
          expect(err.response).to.equal(null);
        } finally {
          expect(error).to.be.not.null;
        }
      })

      it('should be request with proxy', async () => {
        const resource = 'contact';
        const proxy = 'proxy.api.com'
        const path = `/${Client.config.version}/REST/${resource}`;

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            proxyUrl: proxy
          }
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false
        };
        const requestData = {};
        nock(`https://${proxy}`)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .delete(path)
          .reply(200, function () {
            requestData.hostname = this.req.options.hostname;
            requestData.headers = this.req.headers;

            return JSON.stringify(resultData);
          });

        const instance = new Client(params).delete(resource, {});
        const result = await instance.request();

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers,'content-type', 'application/json');
        expectOwnProperty(requestData.headers,'accept', 'application/json');
        expectOwnProperty(requestData.headers,'host', Client.config.host);
        expectOwnProperty(requestData.headers,'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);

        expect(requestData.hostname).to.equal(proxy);
      })

      it('should be request with custom accept response type', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            output: 'png'
          }
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false
        };
        const requestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .reply(200, function () {
            requestData.headers = this.req.headers;

            return JSON.stringify(resultData);
          });

        const instance = new Client(params).get(resource);
        const result = await instance.request();

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers,'content-type', 'application/json');
        expectOwnProperty(requestData.headers,'accept', 'image/png');
        expectOwnProperty(requestData.headers,'host', Client.config.host);
        expectOwnProperty(requestData.headers,'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);
      })

      it('should be throw error if argument "url" is not string', () => {
        [5, true, undefined, null, Symbol(), BigInt(5), {}].forEach(url => {
          expect(() => Request.prototype.getRequest.call(null, url))
            .to.throw(Error, 'Argument "url" must be string');
        });
      })

    });

    describe('Request.buildPath()', () => {

      it('should be have prototype method #buildPath()', () => {
        expect(Request).to.respondsTo('buildPath');
      });

      it('should be build path and take url and version from Request config', () => {
        const resource = 'contact';
        const subPath = 'REST';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            host: 'client.api.mailjet',
            version: 'v3',
          }
        };
        const customConfig = {
          host: 'request.api.mailjet',
          version: 'v7',
        };

        const request = new Client(params).get(resource, customConfig);
        const path = request.buildPath({});

        expect(path).to.be.a('string');
        expect(path).to.equal(`${customConfig.host}/${customConfig.version}/${subPath}/${resource}`);
      })

      it('should be build path and take url and version from Client config', () => {
        const resource = 'contact';
        const subPath = 'REST';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            host: 'client.api.mailjet',
            version: 'v3',
          }
        };

        const request = new Client(params).get(resource);
        const path = request.buildPath({});

        expect(path).to.be.a('string');
        expect(path).to.equal(`${params.config.host}/${params.config.version}/${subPath}/${resource}`);
      })

      it('should be build path with params', () => {
        const resource = 'contact';
        const subPath = 'REST';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            host: 'client.api.mailjet',
            version: 'v3',
          }
        };
        const customConfig = {
          host: 'request.api.mailjet',
          version: 'v7',
        };
        const queryParams = {
          a: 5,
          b: 'some text',
          c: true
        }

        const request = new Client(params).get(resource, customConfig);
        const path = request.buildPath(queryParams);

        const querystring = qs.stringify(queryParams);

        expect(path).to.be.a('string');
        expect(path).to.equal(`${customConfig.host}/${customConfig.version}/${subPath}/${resource}?${querystring}`);
      })

      it('should be throw error if passed argument "params" is not object', () => {
        ['', 5, true, undefined, null, Symbol(), BigInt(5)].forEach(params => {
          expect(() => Request.prototype.buildPath.call(null, params))
            .to.throw(Error, 'Argument "params" must be object');
        })
      });

    });

    describe('Request.buildSubPath()', () => {

      it('should be have prototype method #buildSubPath()', () => {
        expect(Request).to.respondsTo('buildSubPath');
      });

      it('should be build sub path', () => {
        const resource = 'contact';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const request = new Client(params).get(resource);
        const subPath = request.buildSubPath();

        expect(subPath).to.be.a('string');
        expect(subPath).to.equal('REST')
      })

      it('should be build sub path for resource /send', () => {
        const resource = 'send';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const request = new Client(params).post(resource);
        const subPath = request.buildSubPath();

        expect(subPath).to.be.a('string');
        expect(subPath).to.equal('')
      })

      it('should be build sub path for resource /sms-send', () => {
        const resource = 'sms-send';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const request = new Client(params).post(resource);
        const subPath = request.buildSubPath();

        expect(subPath).to.be.a('string');
        expect(subPath).to.equal('')
      })

      it('should be build sub path for resource /contactslist with action csvdata', () => {
        const resource = 'contactslist';
        const action = 'csvdata'

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const request = new Client(params).put(resource).action(action);
        const subPath = request.buildSubPath();

        expect(subPath).to.be.a('string');
        expect(subPath).to.equal('DATA')
      })

      it('should be build sub path for resource /batchjob with action csverror', () => {
        const resource = 'batchjob';
        const action = 'csverror'

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const request = new Client(params).delete(resource).action(action);
        const subPath = request.buildSubPath();

        expect(subPath).to.be.a('string');
        expect(subPath).to.equal('DATA')
      })

    });

    describe('Request.parseToJSONb()', () => {

      it('should be have prototype method #parseToJSONb()', () => {
        expect(Request).to.respondsTo('parseToJSONb');
      });

      it('should be parse json with big numbers', () => {
        const json = `{
          "num": 5,
          "bigNum": 9007199254740999234234923492341,
          "str": "string",
          "bool": true,
          "obj": {}
        }`

        const obj = Request.prototype.parseToJSONb.call(null, json);

        expect(obj).to.be.a('object')

        expect(obj).to.deep.equal({
          num: 5,
          bigNum: '9007199254740999234234923492341',
          str: 'string',
          bool: true,
          obj: {}
        })
        expect(BigInt(obj.bigNum) > Number.MAX_SAFE_INTEGER).to.equal(true)
      })

      it('should be return empty object if occurred parse error', () => {
        const json = `{
          "num": 5,
          "bigNum": 9007199254740999234234923492341,
          //
          "str": "string",
          "bool": true,
          "obj": {}
        }`

        const obj = Request.prototype.parseToJSONb.call(null, json);

        expect(obj).to.be.a('object')

        expect(obj).to.deep.equal({})
      })

      it('should be throw error if argument "text" is not string', () => {
        [5, true, undefined, null, Symbol(), BigInt(5), {}].forEach(url => {
          expect(() => Request.prototype.parseToJSONb.call(null, url))
            .to.throw(Error, 'Argument "text" must be string');
        });
      })

    });

    describe('Request.id()', () => {

      it('should be have prototype method #id()', () => {
        expect(Request).to.respondsTo('id');
      });

      [234234234, '345345345'].forEach(id => {

        it(`should be change instance properties if passed ${typeof id}`, () => {
          const resource = 'contact';

          const params = {
            apiKey: 'key',
            apiSecret: 'secret'
          };

          const request = new Client(params).get(resource).id(id);

          expect(request).to.be.a('object')

          expectOwnProperty(request, 'url', `${resource}/${id}`)
        })

      })

      it('should be throw error if passed "value" is not string or number', () => {
        [true, undefined, null, Symbol(), BigInt(5), {}].forEach(value => {
          expect(() => Request.prototype.id.call(null, value))
            .to.throw(Error, 'Argument "value" must be string or number');
        });
      })

    });

    describe('Request.action()', () => {

      it('should be have prototype method #action()', () => {
        expect(Request).to.respondsTo('action');
      });

      it('should be change instance properties', () => {
        const resource = 'contact';
        const action = 'Managecontactslists'

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const request = new Client(params).get(resource).action(action);

        expect(request).to.be.a('object')

        expect(request)
          .to.have.ownProperty('actionPath')
          .that.is.a('string')
          .to.equal(action.toLowerCase());

        expectOwnProperty(request,'url', `${resource}/${action.toLowerCase()}`);
        expectOwnProperty(request,'subPath', 'REST');
      })

      it('call with "action" is csvdata', () => {
        const resource = 'contact';
        const action = 'csvdata'

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const request = new Client(params).get(resource).action(action);

        expect(request).to.be.a('object')

        expect(request)
          .to.have.ownProperty('actionPath')
          .that.is.a('string')
          .to.equal('csvdata/text:plain');

        expectOwnProperty(request,'url', `${resource}/${action}/text:plain`);
        expectOwnProperty(request,'subPath', 'REST');
      })

      it('call with "action" is csverror', () => {
        const resource = 'contact';
        const action = 'csverror'

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const request = new Client(params).get(resource).action(action);

        expect(request).to.be.a('object')

        expect(request)
          .to.have.ownProperty('actionPath')
          .that.is.a('string')
          .to.equal('csverror/text:csv');

        expectOwnProperty(request,'url', `${resource}/${action}/text:csv`);
        expectOwnProperty(request,'subPath', 'REST');
      })

      it('should be throw error if passed "name" is not string', () => {
        [5, true, undefined, null, Symbol(), BigInt(5), {}].forEach(name => {
          expect(() => Request.prototype.action.call(null, name))
            .to.throw(Error, 'Argument "name" must be string');
        });
      })

    });

    describe('Request.request()', () => {

      it('should be have prototype method #request()', () => {
        expect(Request).to.respondsTo('request');
      });

      it('should be skip request', async () => {
        const apiVersion = Client.config.version;

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

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            performAPICall: false
          }
        };

        const client = new Client(params);

        await Promise.all(
          ['post', 'put', 'get', 'delete'].map(async method => {
            const path = `/${apiVersion}/REST/${resource}/${contactId}`;

            const request = client[method](resource).id(contactId)
            const result = await request.request(data);

            expectOwnProperty(request, 'url', resource)

            if(['post', 'put'].includes(method)) {
              const url = `${API_MAILJET_URL}${path}`;

              expectOwnProperty(result,'url', url);
              expect(result)
                .to.have.ownProperty('body')
                .that.deep.equal(data);
            } else {
              const url = `${API_MAILJET_URL}${path}${method === 'get' ? `?${qs.stringify(data)}` : ''}`

              expectOwnProperty(result,'url', url);
              expect(result)
                .to.have.ownProperty('body')
                .that.deep.equal({});
            }
          })
        )
      })

      it('should be request with payload', async () => {
        const apiVersion = Client.config.version;

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

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const client = new Client(params);

        await Promise.all(
          ['post', 'put'].map(async method => {
            const path = `/${apiVersion}/REST/${resource}/${contactId}`;
            const resultData = {
              a: 5,
              b: 'text',
              c: false
            };

            const requestData = {};
            nock(API_MAILJET_URL)
              .defaultReplyHeaders({
                'Content-Type': 'application/json',
              })
              [method](path)
              .reply(200, function (uri, reqBody) {
                requestData.path = this.req.path;
                requestData.headers = this.req.headers;
                requestData.body = reqBody;

                return JSON.stringify(resultData);
              });

            const request = client[method](resource).id(contactId)
            const result = await request.request(data);

            expectOwnProperty(request, 'url', resource)

            expect(result).to.be.a('object');
            expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

            expectOwnProperty(requestData,'path', path);
            expect(requestData).to.have.ownProperty('body').that.deep.equal(data);

            expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
            expectOwnProperty(requestData.headers,'content-type', 'application/json');
            expectOwnProperty(requestData.headers,'accept', 'application/json');
            expectOwnProperty(requestData.headers,'host', Client.config.host);
            expectOwnProperty(requestData.headers,'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);
          })
        )
      })

      it('should be request by GET method', async () => {
        const apiVersion = Client.config.version;

        const resource = 'contactdata';
        const data = {
          a: 5,
          b: 6,
          c: 7
        };

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const client = new Client(params);

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {
          a: 5,
          b: 'text',
          c: false
        };
        const requestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .query(true)
          .reply(200, function (uri, reqBody) {
            requestData.path = this.req.path;
            requestData.headers = this.req.headers;
            requestData.body = reqBody;

            return JSON.stringify(resultData);
          });

        const request = await client.get(resource)
        const result = await request.request(data);

        expectOwnProperty(request, 'url', resource)

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData,'path', `${path}?${qs.stringify(data)}`);
        expectOwnProperty(requestData,'body', '');

        expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers,'content-type', 'application/json');
        expectOwnProperty(requestData.headers,'accept', 'application/json');
        expectOwnProperty(requestData.headers,'host', Client.config.host);
        expectOwnProperty(requestData.headers,'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);
      })

      it('should be request by DELETE method', async () => {
        const apiVersion = Client.config.version;

        const resource = 'contactdata';
        const data = {
          a: 5,
          b: 6,
          c: 7
        };

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const client = new Client(params);

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {
          deleted: true
        };
        const requestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .delete(path)
          .reply(200, function (uri, reqBody) {
            requestData.path = this.req.path;
            requestData.headers = this.req.headers;
            requestData.body = reqBody;

            return JSON.stringify(resultData);
          });

        const request = await client.delete(resource)
        const result = await request.request(data);

        expectOwnProperty(request, 'url', resource)

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData,'path', path);
        expectOwnProperty(requestData,'body', '');

        expectOwnProperty(requestData.headers,'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers,'content-type', 'application/json');
        expectOwnProperty(requestData.headers,'accept', 'application/json');
        expectOwnProperty(requestData.headers,'host', Client.config.host);
        expectOwnProperty(requestData.headers,'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);
      })

      it('should be throw error message', async () => {
        const apiVersion = Client.config.version;
        const resource = 'contactdata';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const client = new Client(params);

        const path = `/${apiVersion}/REST/${resource}`;
        const statusCode = 404;
        const resultData = {
          ErrorMessage: 'some reason'
        };
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .reply(statusCode, JSON.stringify(resultData));

        let error = null;
        try {
          await client
            .get(resource)
            .request()
        } catch (err) {
          error = err;

          expectOwnProperty(err,'statusCode', statusCode);
          expectOwnProperty(err,'message', `Unsuccessful: Status Code: "${statusCode}" Message: "${resultData.ErrorMessage}"`);
          expectOwnProperty(err,'ErrorMessage', resultData.ErrorMessage);

          expect(err)
            .to.haveOwnProperty('statuses')
            .that.is.deep.equal({
              ok: false,
              clientError: true,
              serverError: false,
            })
        } finally {
          expect(error).to.be.not.null;
        }
      })

      it('should be throw error with full message', async () => {
        const apiVersion = Client.config.version;
        const resource = 'contactdata';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const client = new Client(params);

        const path = `/${apiVersion}/REST/${resource}`;
        const statusCode = 501;
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
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .reply(statusCode, JSON.stringify(resultData));

        let error = null;
        try {
          await client
            .get(resource)
            .request()
        } catch (err) {
          error = err;

          expectOwnProperty(err,'statusCode', statusCode);
          expectOwnProperty(err,'ErrorMessage', resultData.ErrorMessage);

          const fullMessage = resultData.Messages[0].Errors[0].ErrorMessage;
          expectOwnProperty(
            err,
            'message',
            `Unsuccessful: Status Code: "${statusCode}" Message: "${resultData.ErrorMessage}";\n${fullMessage}`
          );

          expect(err)
            .to.haveOwnProperty('statuses')
            .that.is.deep.equal({
              ok: false,
              clientError: false,
              serverError: true,
            })
        } finally {
          expect(error).to.be.not.null;
        }
      })

      it('should be throw detailed error message', async () => {
        const apiVersion = Client.config.version;
        const resource = 'contactdata';

        const params = {
          apiKey: 'key',
          apiSecret: 'secret'
        };

        const client = new Client(params);

        const path = `/${apiVersion}/REST/${resource}`;
        const statusCode = 500;
        const resultData = {
          ErrorMessage: 'some reason',
          ErrorCode: 710,
          ErrorIdentifier: '3425-345345-345345-345345',
          ErrorRelatedTo: 'Data.Email'
        };
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .reply(statusCode, JSON.stringify(resultData));

        let error = null;
        try {
          await client
            .get(resource)
            .request()
        } catch (err) {
          error = err;

          expectOwnProperty(err,'statusCode', statusCode);
          expectOwnProperty(err,'message',`Unsuccessful: Status Code: "${statusCode}" Message: "${resultData.ErrorMessage}"`);

          expectOwnProperty(err,'ErrorMessage', resultData.ErrorMessage);
          expectOwnProperty(err,'ErrorIdentifier', resultData.ErrorIdentifier);
          expectOwnProperty(err,'ErrorCode', resultData.ErrorCode);
          expectOwnProperty(err,'ErrorRelatedTo', resultData.ErrorRelatedTo);

          expect(err)
            .to.haveOwnProperty('statuses')
            .that.is.deep.equal({
              ok: false,
              clientError: false,
              serverError: true,
            })
        } finally {
          expect(error).to.be.not.null;
        }
      })

      it('should be throw timeout error message', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            timeout: 35
          }
        };

        const requestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .delayConnection(100)
          .reply(200, function () {
            requestData.headers = this.req.headers;

            return '{}';
          });

        const instance = new Client(params).get(resource);

        let error = null;
        try {
          await instance.request();
        } catch (err) {
          error = err;

          const errorMessage = `Response timeout of ${params.options.timeout}ms exceeded`;

          expectOwnProperty(err,'message', `Unsuccessful: Status Code: "null" Message: "${errorMessage}"`);
          expectOwnProperty(err,'ErrorMessage', errorMessage);
          expectOwnProperty(err,'code', 'ECONNABORTED');
          expectOwnProperty(err,'errno', 'ETIMEDOUT');

          expect(err.timeout).to.equal(params.options.timeout);
          expect(err.statusCode).to.equal(null);
          expect(err.response).to.equal(null);
        } finally {
          expect(error).to.be.not.null;
        }
      })

    });

  });

});