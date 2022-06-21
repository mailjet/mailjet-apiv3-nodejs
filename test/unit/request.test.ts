/*external modules*/
import qs from 'qs';
import nock from 'nock';
import { expect } from 'chai';
import { AxiosProxyConfig, AxiosError } from 'axios';
/*types*/
import { TObject } from '@custom/types';
import { IClientParams } from '../../lib/client/IClient';
import { IRequestConfig } from '../../lib/request/IRequest';
/*utils*/
/*lib*/
import Client, { HttpMethods, Request } from '../../lib/index';
import packageJSON from '../../package.json';
/*helpers*/
import expectOwnProperty from '../helpers';
/*other*/

type TMockRequestData = {
  path?: string,
  protocol?: string;
  hostname?: string,
  port?: number;
  headers?: Record<string, unknown>,
  body?: unknown;
}

describe('Unit Request', () => {
  describe('static part', () => {
    describe('Request.constructor()', () => {
      it('should be create instance', () => {
        const resource = 'Contact';
        const method = HttpMethods.Get;

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            version: 'v4',
          },
        };
        const customConfig: IRequestConfig = {
          host: 'new.api.mailjet',
          version: 'v7',
          output: 'text',
        };

        const client = new Client(params);
        const request = new Request(client, method, resource, customConfig);

        expect(request).to.be.a('object');

        expectOwnProperty(request, 'client', client);
        expectOwnProperty(request, 'method', method);
        expectOwnProperty(request, 'url', resource.toLowerCase());
        expectOwnProperty(request, 'resource', resource.toLowerCase());
        expectOwnProperty(request, 'subPath', 'REST');
        expectOwnProperty(request, 'actionPath', null);

        expect(request)
          .to.haveOwnProperty('config')
          .that.is.eql(customConfig)
          .but.is.not.equal(customConfig);
      });

      it('should be create instance with default empty config', () => {
        const resource = 'send-sms';
        const method = HttpMethods.Post;

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            version: 'v3',
          },
        };

        const client = new Client(params);

        [null, undefined].forEach((config) => {
          const request = new Request(client, method, resource, config);

          expect(request).to.be.a('object');

          expectOwnProperty(request, 'client', client);
          expectOwnProperty(request, 'method', method);
          expectOwnProperty(request, 'url', resource);
          expectOwnProperty(request, 'resource', resource.toLowerCase());
          expectOwnProperty(request, 'subPath', '');
          expectOwnProperty(request, 'actionPath', null);

          expect(request)
            .to.haveOwnProperty('config')
            .that.is.eql({});
        });
      });

      it('should be throw error if passed argument "client" is not instance from Client', () => {
        const resource = 'Contact';
        const method = HttpMethods.Get;

        [null, undefined, {}, Object.create(null)].forEach((client) => {
          expect(() => new Request(client, method, resource, null))
            .to.throw(Error, 'Argument "client" must be instance of Client');
        });
      });

      it('should be throw error if passed argument "method" is not supported', () => {
        const resource = 'Contact';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            version: 'v3',
          },
        };

        const client = new Client(params);

        ['head', 'connect', 'options', 'trace', 'patch'].forEach((method) => {
          expect(() => new Request(client, method as HttpMethods, resource, null))
            .to.throw(Error, 'Argument "method" must be one of supported methods: get, post, put, delete');
        });
      });

      it('should be throw error if passed argument "resource" is not string', () => {
        const method = HttpMethods.Get;

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            version: 'v3',
          },
        };

        const client = new Client(params);

        [5, true, undefined, null, Symbol(''), BigInt(5), {}].forEach((resource) => {
          expect(() => new Request(client, method, resource as string, null))
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

    describe('Request.parseToJSONb()', () => {
      it('should be have own method #parseToJSONb()', () => {
        expect(Request).itself.to.respondsTo('parseToJSONb');
      });

      it('should be parse json with big numbers', () => {
        const json = `{
          "num": 5,
          "bigNum": 9007199254740999234234923492341,
          "str": "string",
          "bool": true,
          "obj": {}
        }`;

        const obj = Request.parseToJSONb(json);

        expect(obj).to.be.a('object');

        expect(obj).to.deep.equal({
          num: 5,
          bigNum: '9007199254740999234234923492341',
          str: 'string',
          bool: true,
          obj: {},
        });
        expect(BigInt(obj.bigNum) > Number.MAX_SAFE_INTEGER).to.equal(true);
      });

      it('should be return empty object if occurred parse error', () => {
        const json = `{
          "num": 5,
          "bigNum": 9007199254740999234234923492341,
          //
          "str": "string",
          "bool": true,
          "obj": {}
        }`;

        const obj = Request.parseToJSONb(json);

        expect(obj).to.be.a('object');

        expect(obj).to.deep.equal({});
      });

      it('should be throw error if argument "text" is not string', () => {
        [5, true, undefined, null, Symbol(''), BigInt(5), {}].forEach((url) => {
          expect(() => Request.parseToJSONb(url as string))
            .to.throw(Error, 'Argument "text" must be string');
        });
      });
    });

    describe('Request.isBrowser()', () => {
      it('should be have own method #isBrowser()', () => {
        expect(Request).itself.to.respondsTo('isBrowser');
      });

      it('should be return true if window is not undefined', () => {
        (global as any)['window'] = {};

        const obj = Request.isBrowser();

        if (global.window) {
          delete (global as any)['window'];
        }

        expect(obj).to.be.equal(true);
      });

      it('should be return false if window is undefined', () => {
        const obj = Request.isBrowser();

        expect(obj).to.be.equal(false);
      });
    });
  });

  describe('instance part', () => {
    const API_MAILJET_URL = `${Request.protocol}${Client.config.host}`;

    function buildBasicAuthStr(apiKey: string, apiSecret: string) {
      return Buffer.from(`${apiKey}:${apiSecret}`, 'utf-8').toString('base64');
    }

    after(() => {
      nock.cleanAll();
    });

    describe('Request.getUserAgent()', () => {
      it('should be have prototype method #getUserAgent()', () => {
        expect(Request).to.respondsTo('getUserAgent');
      });

      it('should be return user agent value', () => {
        const resource = 'Contact';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            version: 'v3',
          },
        };

        const request = new Client(params).get(resource);
        const userAgent = request.getUserAgent();

        expect(userAgent).to.equal(`mailjet-api-v3-nodejs/${packageJSON.version}`);
      });
    });

    describe('Request.getCredentials()', () => {
      it('should be have prototype method #getCredentials()', () => {
        expect(Request).to.respondsTo('getCredentials');
      });

      it('should be return credentials based on Client instance', () => {
        const resource = 'Contact';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const request = new Client(params).get(resource);
        const credentials = request.getCredentials();

        expect(credentials).to.deep.equal({
          ...params,
          apiToken: undefined,
        });
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
          `${API_MAILJET_URL}/v3/send`,
        ].forEach((url) => {
          const contentType = Request.prototype['getContentType'].call(null, url);

          expect(contentType).to.equal('application/json');
        });
      });

      it('should be return content type "text/plain"', () => {
        const url = `${API_MAILJET_URL}/v3/DATA/contactslist/34/csvdata/text:plain`;

        const contentType = Request.prototype['getContentType'].call(null, url);

        expect(contentType).to.equal('text/plain');
      });

      it('should be throw error if argument "url" is not string', () => {
        [5, true, undefined, null, Symbol(''), BigInt(5), {}].forEach((url) => {
          expect(() => Request.prototype['getContentType'].call(null, url as string))
            .to.throw(Error, 'Argument "url" must be string');
        });
      });
    });

    describe('Request.getRequestBody()', () => {
      it('should be have prototype method #getRequestBody()', () => {
        expect(Request).to.respondsTo('getRequestBody');
      });

      it('should be return original data for POST/PUT/DELETE ', () => {
        const resource = 'send-sms';
        const data = {
          Email: 'test@mailjet.com',
        };

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            version: 'v3',
          },
        };

        const client = new Client(params);

        [
          HttpMethods.Put,
          HttpMethods.Post,
          HttpMethods.Delete,
        ].forEach((method) => {
          const request = new Request(client, method, resource, {});
          const body = Request.prototype['getRequestBody'].call(request, data);

          expect(body).to.be.a('object');
          expect(body).to.be.equal(data);
        });
      });

      it('should be return empty body for GET', () => {
        const resource = 'send-sms';
        const data = {
          Email: 'test@mailjet.com',
        };

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            version: 'v3',
          },
        };

        const client = new Client(params);
        const request = new Request(client, HttpMethods.Get, resource, {});

        const body = Request.prototype['getRequestBody'].call(request, data);

        expect(body).to.be.a('object');
        expect(body).to.be.not.equal(data);
        expect(body).to.be.deep.equal({});
      });
    });

    describe('Request.buildFullUrl()', () => {
      it('should be have prototype method #buildFullUrl()', () => {
        expect(Request).to.respondsTo('buildFullUrl');
      });

      it('should be build path and take url and version from Request config', () => {
        const resource = 'contact';
        const subPath = 'REST';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            host: 'client.api.mailjet',
            version: 'v3',
          },
        };
        const customConfig: Pick<IRequestConfig, 'host' | 'version'> = {
          host: 'request.api.mailjet',
          version: 'v7',
        };

        const request = new Client(params).get(resource, customConfig);
        const path = request['buildFullUrl']();

        const url = `${Request.protocol}${customConfig.host}/${customConfig.version}/${subPath}/${resource}`;

        expect(path).to.be.a('string');
        expect(path).to.equal(url);
      });

      it('should be build path and take url and version from Client config', () => {
        const resource = 'contact';
        const subPath = 'REST';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            host: 'client.api.mailjet',
            version: 'v3',
          },
        };

        const request = new Client(params).get(resource);
        const path = request['buildFullUrl']();

        const url = `${Request.protocol}${params.config?.host}/${params.config?.version}/${subPath}/${resource}`;

        expect(path).to.be.a('string');
        expect(path).to.equal(url);
      });
    });

    describe('Request.buildSubPath()', () => {
      it('should be have prototype method #buildSubPath()', () => {
        expect(Request).to.respondsTo('buildSubPath');
      });

      it('should be build sub path', () => {
        const resource = 'contact';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const request = new Client(params).get(resource);
        const subPath = request['buildSubPath']();

        expect(subPath).to.be.a('string');
        expect(subPath).to.equal('REST');
      });

      it('should be build sub path for resource /send', () => {
        const resource = 'send';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const request = new Client(params).post(resource);
        const subPath = request['buildSubPath']();

        expect(subPath).to.be.a('string');
        expect(subPath).to.equal('');
      });

      it('should be build sub path for resource /sms-send', () => {
        const resource = 'sms-send';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const request = new Client(params).post(resource);
        const subPath = request['buildSubPath']();

        expect(subPath).to.be.a('string');
        expect(subPath).to.equal('');
      });

      it('should be build sub path for resource /contactslist with action csvdata', () => {
        const resource = 'contactslist';
        const action = 'csvdata';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const request = new Client(params).put(resource).action(action);
        const subPath = request['buildSubPath']();

        expect(subPath).to.be.a('string');
        expect(subPath).to.equal('DATA');
      });

      it('should be build sub path for resource /batchjob with action csverror', () => {
        const resource = 'batchjob';
        const action = 'csverror';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const request = new Client(params).delete(resource).action(action);
        const subPath = request['buildSubPath']();

        expect(subPath).to.be.a('string');
        expect(subPath).to.equal('DATA');
      });
    });

    describe('Request.setBaseURL()', () => {
      it('should be have prototype method #setBaseURL()', () => {
        expect(Request).to.respondsTo('setBaseURL');
      });

      it('should be set the base url', () => {
        const resourceFirst = 'Contact';
        const resourceSecond = 'Template';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          config: {
            host: 'client.api.mailjet',
            version: 'v3',
          },
        };
        const customConfig: Pick<IRequestConfig, 'host' | 'version'> = {
          host: 'request.api.mailjet',
          version: 'v7',
        };

        const request = new Client(params).get(resourceFirst, customConfig);
        expectOwnProperty(request, 'url', resourceFirst.toLowerCase());

        const result = request['setBaseURL'](resourceSecond);

        expect(request).to.be.a('object');
        expect(result).to.be.a('object');
        expect(result).to.equal(request);

        expectOwnProperty(request, 'url', resourceSecond.toLowerCase());
      });
    });

    describe('Request.id()', () => {
      it('should be have prototype method #id()', () => {
        expect(Request).to.respondsTo('id');
      });

      [234234234, '345345345'].forEach((id) => {
        it(`should be change instance properties if passed ${typeof id}`, () => {
          const resource = 'contact';

          const params: IClientParams = {
            apiKey: 'key',
            apiSecret: 'secret',
          };

          const request = new Client(params).get(resource).id(id);

          expect(request).to.be.a('object');

          expectOwnProperty(request, 'url', `${resource}/${id}`);
        });
      });

      it('should be throw error if passed "value" is not string or number', () => {
        [true, undefined, null, Symbol(''), BigInt(5), {}].forEach((value) => {
          expect(() => Request.prototype.id.call(null, value as string))
            .to.throw(Error, 'Argument "value" must be string or number');
        });
      });
    });

    describe('Request.action()', () => {
      it('should be have prototype method #action()', () => {
        expect(Request).to.respondsTo('action');
      });

      it('should be change instance properties', () => {
        const resource = 'contact';
        const action = 'Managecontactslists';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const request = new Client(params).get(resource).action(action);

        expect(request).to.be.a('object');

        expect(request)
          .to.have.ownProperty('actionPath')
          .that.is.a('string')
          .to.equal(action.toLowerCase());

        expectOwnProperty(request, 'url', `${resource}/${action.toLowerCase()}`);
        expectOwnProperty(request, 'subPath', 'REST');
      });

      it('call with "action" is csvdata', () => {
        const resource = 'contact';
        const action = 'csvdata';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const request = new Client(params).get(resource).action(action);

        expect(request).to.be.a('object');

        expect(request)
          .to.have.ownProperty('actionPath')
          .that.is.a('string')
          .to.equal('csvdata/text:plain');

        expectOwnProperty(request, 'url', `${resource}/${action}/text:plain`);
        expectOwnProperty(request, 'subPath', 'REST');
      });

      it('call with "action" is csverror', () => {
        const resource = 'contact';
        const action = 'csverror';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const request = new Client(params).get(resource).action(action);

        expect(request).to.be.a('object');

        expect(request)
          .to.have.ownProperty('actionPath')
          .that.is.a('string')
          .to.equal('csverror/text:csv');

        expectOwnProperty(request, 'url', `${resource}/${action}/text:csv`);
        expectOwnProperty(request, 'subPath', 'REST');
      });

      it('should be throw error if passed "name" is not string', () => {
        [5, true, undefined, null, Symbol(''), BigInt(5), {}].forEach((name) => {
          expect(() => Request.prototype.action.call(null, name as string))
            .to.throw(Error, 'Argument "name" must be string');
        });
      });
    });

    describe('Request.makeRequest()', () => {
      it('should be have prototype method #getRequest()', () => {
        expect(Request).to.respondsTo('makeRequest');
      });

      it('should be request with additional header if it is browser side', async () => {
        (global as any)['window'] = {};

        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params: Required<Pick<IClientParams, 'apiKey' | 'apiSecret'>> = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false,
        };
        const requestData: TMockRequestData = {};
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

        expectOwnProperty(requestData.headers, 'x-user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers, 'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers, 'content-type', 'application/json');
        expectOwnProperty(requestData.headers, 'host', Client.config.host);
        expectOwnProperty(requestData.headers, 'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);

        expect(requestData.headers).to.haveOwnProperty('accept').that.includes('application/json');

        if (global.window) {
          delete (global as any)['window'];
        }
      });

      it('should be request with basic auth', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params: Required<Pick<IClientParams, 'apiKey' | 'apiSecret'>> = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false,
        };
        const requestData: TMockRequestData = {};
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

        expectOwnProperty(requestData.headers, 'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers, 'content-type', 'application/json');
        expectOwnProperty(requestData.headers, 'host', Client.config.host);
        expectOwnProperty(requestData.headers, 'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);

        expect(requestData.headers).to.haveOwnProperty('accept').that.includes('application/json');
      });

      it('should be request with token auth', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params: IClientParams = {
          apiToken: 'token',
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false,
        };
        const requestData: TMockRequestData = {};
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

        expectOwnProperty(requestData.headers, 'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers, 'content-type', 'application/json');
        expectOwnProperty(requestData.headers, 'host', Client.config.host);
        expectOwnProperty(requestData.headers, 'authorization', `Bearer ${params.apiToken}`);

        expect(requestData.headers).to.haveOwnProperty('accept').that.includes('application/json');
      });

      it('should be request with timeout', async () => {
        const timeout = 135;

        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params: Required<Pick<IClientParams, 'apiKey' | 'apiSecret' | 'options'>> = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            timeout,
          },
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false,
        };
        const requestData: TMockRequestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .delayConnection(100)
          .reply(200, function () {
            requestData.headers = this.req.headers;

            return JSON.stringify(resultData);
          });

        const instance = new Client(params).get(resource);
        const result = await instance.request();

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expect(result.response).to.be.a('object');
        expect(result.response.config).to.be.a('object');

        expectOwnProperty(result.response.config, 'timeout', timeout);

        expectOwnProperty(requestData.headers, 'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers, 'content-type', 'application/json');
        expectOwnProperty(requestData.headers, 'host', Client.config.host);
        expectOwnProperty(requestData.headers, 'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);

        expect(requestData.headers).to.haveOwnProperty('accept').that.includes('application/json');
      });

      it('should be request with proxy', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const proxy: AxiosProxyConfig = {
          protocol: 'http',
          host: 'localhost',
          port: 3100,
        };

        const params: Required<Pick<IClientParams, 'apiKey' | 'apiSecret'>> & IClientParams = {
          apiKey: '9d4aed954db9a66a9140122aa28abb87',
          apiSecret: 'd0c9979c517da1dba56a4564b5208b7c',
          options: {
            proxy,
          },
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false,
        };
        const requestData: TMockRequestData = {};
        nock(/(.*?)/g)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .delete(/(.*?)/g)
          .reply(200, function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { options } = this.req;

            requestData.protocol = options.protocol;
            requestData.hostname = options.hostname;
            requestData.port = options.port;

            requestData.path = options.path;
            requestData.headers = options.headers;

            return JSON.stringify(resultData);
          });

        const instance = new Client(params).delete(resource, {});
        const result = await instance.request();

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData, 'protocol', `${proxy.protocol}:`);
        expectOwnProperty(requestData, 'hostname', proxy.host);
        expectOwnProperty(requestData, 'port', proxy.port);

        expectOwnProperty(requestData, 'path', `${API_MAILJET_URL}${path}`);

        expectOwnProperty(requestData.headers, 'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers, 'content-type', 'application/json');
        expectOwnProperty(requestData.headers, 'host', Client.config.host);
        expectOwnProperty(requestData.headers, 'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);

        expect(requestData.headers).to.haveOwnProperty('accept').that.includes('application/json');
      });

      it('should be request with custom headers', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params: Required<Pick<IClientParams, 'apiKey' | 'apiSecret'>> & IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            headers: {
              'Accept-Charset': 'utf-8',
              'Access-Control-Allow-Origin': 'https://mozilla.org',
            },
          },
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false,
        };
        const requestData: TMockRequestData = {};
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

        expectOwnProperty(requestData.headers, 'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers, 'content-type', 'application/json');
        expectOwnProperty(requestData.headers, 'host', Client.config.host);
        expectOwnProperty(requestData.headers, 'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);

        expect(requestData.headers).to.haveOwnProperty('accept').that.includes('application/json');

        Object
          .entries(params.options?.headers as TObject.TUnknownRec)
          .forEach(([key, value]) => {
            expectOwnProperty(requestData.headers, key.toLowerCase(), value);
          });
      });

      it('should be request with custom response type', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params: Required<Pick<IClientParams, 'apiKey' | 'apiSecret'>> & IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false,
        };
        const requestData: TMockRequestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .reply(200, function () {
            requestData.headers = this.req.headers;

            return JSON.stringify(resultData);
          });

        const instance = new Client(params).get(resource, { output: 'text' });
        const result = await instance.request();

        expect(result).to.be.a('object');
        expect(result)
          .to.have.ownProperty('body')
          .that.to.be.a('string')
          .and.is.equal(JSON.stringify(resultData));

        expectOwnProperty(requestData.headers, 'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers, 'content-type', 'application/json');
        expectOwnProperty(requestData.headers, 'host', Client.config.host);
        expectOwnProperty(requestData.headers, 'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);

        expect(requestData.headers)
          .to.haveOwnProperty('accept')
          .that.includes('application/json')
          .and.that.includes('text/plain');
      });

      it('should be request with maxBodyLength option', async () => {
        const maxBodyLength = 135;

        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params: Required<Pick<IClientParams, 'apiKey' | 'apiSecret' | 'options'>> = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            maxBodyLength,
          },
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false,
        };
        const requestData: TMockRequestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .delayConnection(100)
          .reply(200, function () {
            requestData.headers = this.req.headers;

            return JSON.stringify(resultData);
          });

        const instance = new Client(params).get(resource);
        const result = await instance.request();

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expect(result.response).to.be.a('object');
        expect(result.response.config).to.be.a('object');

        expectOwnProperty(result.response.config, 'maxBodyLength', maxBodyLength);

        expectOwnProperty(requestData.headers, 'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers, 'content-type', 'application/json');
        expectOwnProperty(requestData.headers, 'host', Client.config.host);
        expectOwnProperty(requestData.headers, 'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);

        expect(requestData.headers).to.haveOwnProperty('accept').that.includes('application/json');
      });

      it('should be request with maxContentLength option', async () => {
        const maxContentLength = 235;

        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params: Required<Pick<IClientParams, 'apiKey' | 'apiSecret' | 'options'>> = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            maxContentLength,
          },
        };

        const resultData = {
          a: 5,
          b: 'text',
          c: false,
        };
        const requestData: TMockRequestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .delayConnection(100)
          .reply(200, function () {
            requestData.headers = this.req.headers;

            return JSON.stringify(resultData);
          });

        const instance = new Client(params).get(resource);
        const result = await instance.request();

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expect(result.response).to.be.a('object');
        expect(result.response.config).to.be.a('object');

        expectOwnProperty(result.response.config, 'maxContentLength', maxContentLength);

        expectOwnProperty(requestData.headers, 'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers, 'content-type', 'application/json');
        expectOwnProperty(requestData.headers, 'host', Client.config.host);
        expectOwnProperty(requestData.headers, 'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);

        expect(requestData.headers).to.haveOwnProperty('accept').that.includes('application/json');
      });
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
              lastName: 'Smith',
            },
          ],
        };
        const requestParams = {
          Limit: 5,
          Offset: 10,
        };

        const performAPICall = false;
        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const client = new Client(params);

        await Promise.all(
          Object
            .values(HttpMethods)
            .map(async (method) => {
              const url = `${API_MAILJET_URL}/${apiVersion}/REST/${resource}/${contactId}`;

              const request = client[method](resource).id(contactId);
              const result = await request.request({
                performAPICall,
                data,
                params: requestParams,
              });

              expectOwnProperty(request, 'url', resource);
              expectOwnProperty(result, 'url', url);

              expect(result)
                .to.have.ownProperty('params')
                .that.deep.equal(requestParams);

              if (
                [
                  HttpMethods.Put,
                  HttpMethods.Post,
                  HttpMethods.Delete,
                ].includes(method)
              ) {
                expect(result)
                  .to.have.ownProperty('body')
                  .that.deep.equal(data);
              } else {
                expect(result)
                  .to.have.ownProperty('body')
                  .that.deep.equal({});
              }
            }),
        );
      });

      it('should be request by PUT/POST/DELETE methods', async () => {
        const apiVersion = Client.config.version;

        const resource = 'contactdata';
        const contactId = 2345234;
        const data = {
          Data: [
            {
              firstName: 'John',
              lastName: 'Smith',
            },
          ],
        };
        const requestParams = {
          Limit: 5,
          Offset: 10,
        };

        const params: Required<Pick<IClientParams, 'apiKey' | 'apiSecret'>> = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const client = new Client(params);

        await Promise.all(
          [
            HttpMethods.Post,
            HttpMethods.Put,
            HttpMethods.Delete,
          ]
            .map(async (method) => {
              const path = `/${apiVersion}/REST/${resource}/${contactId}`;
              const resultData = {
                a: 5,
                b: 'text',
                c: false,
              };

              const requestData: TMockRequestData = {};
              nock(API_MAILJET_URL)
                .defaultReplyHeaders({
                  'Content-Type': 'application/json',
                })[method](path)
                .query(true)
                .reply(200, function (_, reqBody) {
                  requestData.path = this.req.path;
                  requestData.headers = this.req.headers;
                  requestData.body = reqBody;

                  return JSON.stringify(resultData);
                });

              const request = client[method](resource).id(contactId);
              const result = await request.request({
                data,
                params: requestParams,
              });

              expectOwnProperty(request, 'url', resource);

              expect(result).to.be.a('object');
              expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

              expectOwnProperty(requestData, 'path', `${path}?${qs.stringify(requestParams)}`);
              expect(requestData).to.have.ownProperty('body').that.deep.equal(data);

              expectOwnProperty(requestData.headers, 'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
              expectOwnProperty(requestData.headers, 'content-type', 'application/json');
              expectOwnProperty(requestData.headers, 'host', Client.config.host);
              expectOwnProperty(requestData.headers, 'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);

              expect(requestData.headers).to.haveOwnProperty('accept').that.includes('application/json');
            }),
        );
      });

      it('should be request by GET method', async () => {
        const apiVersion = Client.config.version;

        const resource = 'contactdata';
        const data = {
          a: 5,
          b: 6,
          c: 7,
        };
        const requestParams = {
          Limit: 5,
          Offset: 10,
        };

        const params: Required<Pick<IClientParams, 'apiKey' | 'apiSecret'>> = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const client = new Client(params);

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {
          a: 5,
          b: 'text',
          c: false,
        };
        const requestData: TMockRequestData = {};
        nock(API_MAILJET_URL)
          .defaultReplyHeaders({
            'Content-Type': 'application/json',
          })
          .get(path)
          .query(true)
          .reply(200, function (_, reqBody) {
            requestData.path = this.req.path;
            requestData.headers = this.req.headers;
            requestData.body = reqBody;

            return JSON.stringify(resultData);
          });

        const request = await client.get(resource);
        const result = await request.request({
          data,
          params: requestParams,
        });

        expectOwnProperty(request, 'url', resource);

        expect(result).to.be.a('object');
        expect(result).to.have.ownProperty('body').that.deep.equal(resultData);

        expectOwnProperty(requestData, 'path', `${path}?${qs.stringify(requestParams)}`);
        expect(requestData).to.have.ownProperty('body').that.deep.equal({});

        expectOwnProperty(requestData.headers, 'user-agent', `mailjet-api-v3-nodejs/${packageJSON.version}`);
        expectOwnProperty(requestData.headers, 'content-type', 'application/json');
        expectOwnProperty(requestData.headers, 'host', Client.config.host);
        expectOwnProperty(requestData.headers, 'authorization', `Basic ${buildBasicAuthStr(params.apiKey, params.apiSecret)}`);

        expect(requestData.headers).to.haveOwnProperty('accept').that.includes('application/json');
      });

      it('should be throw error message', async () => {
        const apiVersion = Client.config.version;
        const resource = 'contactdata';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const client = new Client(params);

        const statusCode = 404;
        const statusText = 'Not Found';

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {
          ErrorMessage: 'some reason',
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
            .request();
        } catch (err) {
          error = err;

          expectOwnProperty(err, 'code', AxiosError.ERR_BAD_REQUEST);
          expect(err).to.haveOwnProperty('config').that.is.an('object');

          expect(err).to.haveOwnProperty('response').that.is.an('object');

          expectOwnProperty(err, 'statusCode', statusCode);
          if (err.statusText) {
            expectOwnProperty(err, 'statusText', statusText);
          }

          expectOwnProperty(err, 'message', `Unsuccessful: Status Code: "${statusCode}" Message: "${resultData.ErrorMessage}"`);
          expectOwnProperty(err, 'originalMessage', resultData.ErrorMessage);

          expectOwnProperty(err, 'ErrorMessage', resultData.ErrorMessage);
        } finally {
          // eslint-disable-next-line no-unused-expressions
          expect(error).to.be.not.null;
        }
      });

      it('should be throw error message without response data', async () => {
        const apiVersion = Client.config.version;
        const resource = 'contactdata';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const client = new Client(params);

        const statusCode = 404;
        const statusText = 'Not Found';

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {};
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
            .request();
        } catch (err) {
          error = err;

          expectOwnProperty(err, 'code', AxiosError.ERR_BAD_REQUEST);
          expect(err).to.haveOwnProperty('config').that.is.an('object');

          expect(err).to.haveOwnProperty('response').that.is.an('object');

          expectOwnProperty(err, 'statusCode', statusCode);
          if (err.statusText) {
            expectOwnProperty(err, 'statusText', statusText);
          }

          const errorMessage = 'Request failed with status code 404';
          expectOwnProperty(err, 'message', `Unsuccessful: Status Code: "${statusCode}" Message: "${errorMessage}"`);
          expectOwnProperty(err, 'originalMessage', errorMessage);
        } finally {
          // eslint-disable-next-line no-unused-expressions
          expect(error).to.be.not.null;
        }
      });

      it('should be throw timeout error message', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            timeout: 35,
          },
        };

        const requestData: TMockRequestData = {};
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

          expectOwnProperty(err, 'code', AxiosError.ECONNABORTED);
          expect(err).to.haveOwnProperty('config').that.is.an('object');

          expectOwnProperty(err, 'response', null);
          expectOwnProperty(err, 'statusCode', null);
          expectOwnProperty(err, 'statusText', null);

          const errorMessage = `timeout of ${params.options?.timeout}ms exceeded`;

          expectOwnProperty(err, 'message', `Unsuccessful: Error Code: "${AxiosError.ECONNABORTED}" Message: "${errorMessage}"`);
          expectOwnProperty(err, 'originalMessage', errorMessage);

          expect(err.config.timeout).to.equal(params.options?.timeout);
        } finally {
          // eslint-disable-next-line no-unused-expressions
          expect(error).to.be.not.null;
        }
      });

      it('should be throw max body length error message', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            maxBodyLength: 1,
          },
        };

        const requestData: TMockRequestData = {};
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

          expectOwnProperty(err, 'code', AxiosError.ERR_BAD_REQUEST);
          expect(err).to.haveOwnProperty('config').that.is.an('object');

          expectOwnProperty(err, 'response', null);
          expectOwnProperty(err, 'statusCode', null);
          expectOwnProperty(err, 'statusText', null);

          const errorMessage = 'Request body larger than maxBodyLength limit';

          expectOwnProperty(err, 'message', `Unsuccessful: Error Code: "${AxiosError.ERR_BAD_REQUEST}" Message: "${errorMessage}"`);
          expectOwnProperty(err, 'originalMessage', errorMessage);

          expect(err.config.maxBodyLength).to.equal(params.options?.maxBodyLength);
        } finally {
          // eslint-disable-next-line no-unused-expressions
          expect(error).to.be.not.null;
        }
      });

      it('should be throw max content length error message', async () => {
        const resource = 'contact';
        const path = `/${Client.config.version}/REST/${resource}`;

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            maxContentLength: 1,
          },
        };

        const requestData: TMockRequestData = {};
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

          expectOwnProperty(err, 'code', AxiosError.ERR_BAD_RESPONSE);
          expect(err).to.haveOwnProperty('config').that.is.an('object');

          expectOwnProperty(err, 'response', null);
          expectOwnProperty(err, 'statusCode', null);
          expectOwnProperty(err, 'statusText', null);

          const errorMessage = `maxContentLength size of ${params.options?.maxContentLength} exceeded`;

          expectOwnProperty(err, 'message', `Unsuccessful: Error Code: "${AxiosError.ERR_BAD_RESPONSE}" Message: "${errorMessage}"`);
          expectOwnProperty(err, 'originalMessage', errorMessage);

          expect(err.config.maxContentLength).to.equal(params.options?.maxContentLength);
        } finally {
          // eslint-disable-next-line no-unused-expressions
          expect(error).to.be.not.null;
        }
      });

      it('should be throw error with full message', async () => {
        const apiVersion = Client.config.version;
        const resource = 'contactdata';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const client = new Client(params);

        const statusCode = 501;
        const statusText = 'Not Implemented';

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {
          ErrorMessage: 'some reason',
          Messages: [
            {
              Errors: [
                {
                  ErrorMessage: 'full information',
                },
              ],
            },
          ],
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
            .request();
        } catch (err) {
          error = err;

          expectOwnProperty(err, 'code', AxiosError.ERR_BAD_RESPONSE);
          expect(err).to.haveOwnProperty('config').that.is.an('object');

          expect(err).to.haveOwnProperty('response').that.is.an('object');

          expectOwnProperty(err, 'statusCode', statusCode);
          if (err.statusText) {
            expectOwnProperty(err, 'statusText', statusText);
          }

          const fullMessage = resultData.Messages[0].Errors[0].ErrorMessage;
          expectOwnProperty(
            err,
            'message',
            `Unsuccessful: Status Code: "${statusCode}" Message: "${resultData.ErrorMessage}";\n${fullMessage}`,
          );
          expectOwnProperty(err, 'originalMessage', resultData.ErrorMessage);

          expectOwnProperty(err, 'ErrorMessage', resultData.ErrorMessage);
        } finally {
          // eslint-disable-next-line no-unused-expressions
          expect(error).to.be.not.null;
        }
      });

      it('should be throw detailed error message', async () => {
        const apiVersion = Client.config.version;
        const resource = 'contactdata';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const client = new Client(params);

        const statusCode = 500;
        const statusText = 'Internal Server Error';

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {
          ErrorMessage: 'some reason',
          ErrorCode: 710,
          ErrorIdentifier: '3425-345345-345345-345345',
          ErrorRelatedTo: 'Data.Email',
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
            .request();
        } catch (err) {
          error = err;

          expectOwnProperty(err, 'code', AxiosError.ERR_BAD_RESPONSE);
          expect(err).to.haveOwnProperty('config').that.is.an('object');

          expect(err).to.haveOwnProperty('response').that.is.an('object');

          expectOwnProperty(err, 'statusCode', statusCode);
          if (err.statusText) {
            expectOwnProperty(err, 'statusText', statusText);
          }

          expectOwnProperty(err, 'message', `Unsuccessful: Status Code: "${statusCode}" Message: "${resultData.ErrorMessage}"`);
          expectOwnProperty(err, 'originalMessage', resultData.ErrorMessage);

          expectOwnProperty(err, 'ErrorMessage', resultData.ErrorMessage);
          expectOwnProperty(err, 'ErrorCode', resultData.ErrorCode);
          expectOwnProperty(err, 'ErrorIdentifier', resultData.ErrorIdentifier);
          expectOwnProperty(err, 'ErrorRelatedTo', resultData.ErrorRelatedTo);
        } finally {
          // eslint-disable-next-line no-unused-expressions
          expect(error).to.be.not.null;
        }
      });

      it('should be throw external error', async () => {
        const customError = new Error('test error');
        const originalMakeRequest = Request.prototype['makeRequest'];
        Request.prototype['makeRequest'] = function () {
          throw customError;
        };

        const apiVersion = Client.config.version;
        const resource = 'contactdata';

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
        };

        const client = new Client(params);

        const statusCode = 404;

        const path = `/${apiVersion}/REST/${resource}`;
        const resultData = {
          ErrorMessage: 'some reason',
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
            .request();
        } catch (err) {
          error = err;

          expect(err).to.be.equal(customError);
        } finally {
          // eslint-disable-next-line no-unused-expressions
          expect(error).to.be.not.null;

          Request.prototype['makeRequest'] = originalMakeRequest;
        }
      });
    });
  });
});
