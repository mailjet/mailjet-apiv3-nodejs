/*external modules*/
import { expect } from 'chai';
/*types*/
import { IClientParams } from '../../lib/client/IClient';
import { IRequestConfig, IRequestOptions } from '../../lib/request/IRequest';
/*utils*/
/*lib*/
import { Client, HttpMethods } from '../../lib/index';
import packageJSON from '../../package.json';
/*helpers*/
import { expectOwnProperty } from '../helpers';
/*other*/

type TClientConnectParams = Omit<IClientParams, 'config' | 'options'> & {
  params?: Pick<IClientParams, 'config' | 'options'>
};

describe('Unit Client', () => {
  const DEFAULT_CONFIG = {
    host: 'api.mailjet.com',
    version: 'v3',
    output: 'json',
  };

  describe('static part', () => {
    describe('Client.constructor()', () => {
      it('should be call the "init" method', () => {
        const originalInit = Client.prototype['init'];

        let initParams: IClientParams = {};
        (Client.prototype as any)['init'] = (params: IClientParams) => {
          initParams = params;
        };

        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            timeout: 10,
          },
          config: {
            version: 'v3',
          },
        };

        // eslint-disable-next-line no-new
        new Client(params);

        expect(initParams).to.be.not.equal(params);
        expect(initParams['options']).to.be.not.equal(params.options);
        expect(initParams['config']).to.be.not.equal(params.config);

        expect(initParams).to.be.deep.equal(params);

        Client.prototype['init'] = originalInit;
      });

      it('should be throw error if passed argument "params" is not object', () => {
        ['', 5, true, undefined, null, Symbol(''), BigInt(5)].forEach((type) => {
          expect(() => new Client(type as any))
            .to.throw(Error, 'Argument "params" must be object');
        });
      });
    });

    describe('Client.apiConnect()', () => {
      it('should be have own method #apiConnect()', () => {
        expect(Client).itself.to.respondsTo('apiConnect');
      });

      it('should be call the method "constructor"', () => {
        const connectArguments: TClientConnectParams = {};
        const ProxyMailjetClient = new Proxy(Client, {
          construct(_, value) {
            const [
              apiKey,
              apiSecret,
              params,
            ] = value;
            connectArguments.apiKey = apiKey;
            connectArguments.apiSecret = apiSecret;
            connectArguments.params = params;

            return {};
          },
          get(target, prop, receiver) {
            if (prop === 'apiConnect') {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              return (...args: unknown[]) => new ProxyMailjetClient(...args);
            }
            return Reflect.get(target, prop, receiver);
          },
        });

        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const params: IClientParams = {
          options: {
            timeout: 10,
          },
          config: {
            version: 'v3',
          },
        };

        ProxyMailjetClient.apiConnect(API_KEY, API_SECRET, params);

        expectOwnProperty(connectArguments, 'apiKey', API_KEY);
        expectOwnProperty(connectArguments, 'apiSecret', API_SECRET);
        expect(connectArguments).to.have.ownProperty('params').that.is.equal(params);
      });
    });

    describe('Client.smsConnect()', () => {
      it('should be have own method #smsConnect()', () => {
        expect(Client).itself.to.respondsTo('smsConnect');
      });

      it('should be call the method "constructor"', () => {
        const connectArguments: TClientConnectParams = {};
        const ProxyMailjetClient = new Proxy(Client, {
          construct(_, value) {
            const [
              apiToken,
              params,
            ] = value;
            connectArguments.apiToken = apiToken;
            connectArguments.params = params;

            return {};
          },
          get(target, prop, receiver) {
            if (prop === 'smsConnect') {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              return (...args: unknown[]) => new ProxyMailjetClient(...args);
            }
            return Reflect.get(target, prop, receiver);
          },
        });

        const API_TOKEN = 'token';
        const params: IClientParams = {
          options: {
            timeout: 10,
          },
          config: {
            version: 'v3',
          },
        };

        ProxyMailjetClient.smsConnect(API_TOKEN, params);

        expectOwnProperty(connectArguments, 'apiToken', API_TOKEN);
        expect(connectArguments).to.have.ownProperty('params').that.is.equal(params);
      });
    });

    describe('Client.config', () => {
      it('should be have own property #config', () => {
        expect(Client).to.haveOwnProperty('config');
      });

      it('should be equal to default config', () => {
        expect(Client.config).to.be.deep.equal(DEFAULT_CONFIG);
      });
    });

    describe('Client.packageJSON', () => {
      it('should be have own property #packageJSON', () => {
        expect(Client).to.haveOwnProperty('packageJSON');
      });

      it('should be equal to package json', () => {
        expect(Client.packageJSON).to.be.not.equal(packageJSON);
        expect(Client.packageJSON).to.be.deep.equal(packageJSON);
      });
    });
  });

  describe('instance part', () => {
    describe('Client.init()', () => {
      it('should be have prototype method #init()', () => {
        expect(Client).to.respondsTo('init');
      });

      it('should be init by basic connect strategy', () => {
        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            timeout: 10,
          },
          config: {
            version: 'v3',
          },
        };

        const context = Object.create(Client.prototype, {});
        const client = Client.prototype['init'].call(context, params);

        expectOwnProperty(client, 'version', packageJSON.version);
        expectOwnProperty(client, 'apiKey', params.apiKey);
        expectOwnProperty(client, 'apiSecret', params.apiSecret);

        expect(client)
          .to.have.ownProperty('options')
          .that.is.equal(params.options);
        expect(client)
          .to.have.ownProperty('config')
          .that.is.deep.equal({
            ...DEFAULT_CONFIG,
            ...params.config,
          });
      });

      it('should be init by token connect strategy', () => {
        const params: IClientParams = {
          apiToken: 'token',
          options: {
            timeout: 10,
          },
          config: {
            version: 'v4',
            output: 'png',
          },
        };

        const context = Object.create(Client.prototype, {});
        const client = Client.prototype['init'].call(context, params);

        expectOwnProperty(client, 'version', packageJSON.version);
        expectOwnProperty(client, 'apiToken', params.apiToken);

        expect(client)
          .to.have.ownProperty('options')
          .that.is.equal(params.options);
        expect(client)
          .to.have.ownProperty('config')
          .that.is.deep.equal({
            ...DEFAULT_CONFIG,
            ...params.config,
          });
      });

      it('should be be init with default options and config', () => {
        [null, undefined].forEach((value) => {
          const params: IClientParams = {
            apiKey: 'key',
            apiSecret: 'secret',
            options: value,
            config: value,
          };

          const context = Object.create(Client.prototype, {});
          const client = Client.prototype['init'].call(context, params);

          expectOwnProperty(client, 'version', packageJSON.version);
          expectOwnProperty(client, 'apiKey', params.apiKey);
          expectOwnProperty(client, 'apiSecret', params.apiSecret);

          expect(client)
            .to.have.ownProperty('options')
            .that.is.deep.equal({});
          expect(client)
            .to.have.ownProperty('config')
            .that.is.deep.equal(DEFAULT_CONFIG);
        });
      });

      it('should be throw error if passed argument "params" is not object', () => {
        ['', 5, true, undefined, null, Symbol(''), BigInt(5)].forEach((type) => {
          expect(() => Client.prototype['init'].call({}, type as any))
            .to.throw(Error, 'Argument "params" must be object');
        });
      });
    });

    describe('Client.cloneParams()', () => {
      it('should be have prototype method #cloneParams()', () => {
        expect(Client).to.respondsTo('cloneParams');
      });

      it('should be clone params', () => {
        const params: IClientParams = {
          apiKey: 'key',
          apiSecret: 'secret',
          options: {
            requestHeaders: {
              Accept: 'application/json',
            },
            timeout: 100,
            proxyUrl: 'proxy.com',
          },
          config: {
            host: 'new.api.mailjet',
            version: 'v7',
            output: 'xml',
          },
        };

        const clonedParams = Client.prototype['cloneParams'].call(null, params);

        expect(params).to.be.not.equal(clonedParams);
        expect(params.options).to.be.not.equal(clonedParams.options);
        expect(params.config).to.be.not.equal(clonedParams.config);

        expect(params).to.be.deep.equal(clonedParams);
      });

      it('should be throw error if passed argument "params" is not object', () => {
        ['', 5, true, undefined, null, Symbol(''), BigInt(5)].forEach((type) => {
          expect(() => Client.prototype['cloneParams'].call(null, type as any))
            .to.throw(Error, 'Argument "params" must be object');
        });
      });
    });

    describe('Client.setConfig()', () => {
      it('should be have prototype method #setConfig()', () => {
        expect(Client).to.respondsTo('setConfig');
      });

      it('should be set default config', () => {
        const context = Object.create(Client.prototype);
        const client = Client.prototype['setConfig'].call(context, null);

        expect(client).to.be.a('object');
        expect(client['config']).to.be.deep.equal(DEFAULT_CONFIG);
      });

      it('should be set changed config', () => {
        const customConfig: IRequestConfig = {
          host: 'new.api.mailjet',
          version: 'v7',
          output: 'xml',
        };

        const context = Object.create(Client.prototype);
        const client = Client.prototype['setConfig'].call(context, customConfig);

        expect(client).to.be.a('object');

        expect(client['config']).to.be.not.equal(customConfig);
        expect(client['config']).to.be.deep.equal(customConfig);
      });

      it('should be throw error if passed argument "customConfig" is not object', () => {
        ['', 5, true, undefined, Symbol(''), BigInt(5)].forEach((type) => {
          expect(() => Client.prototype['setConfig'].call(null, type as any))
            .to.throw(Error, 'Argument "customConfig" must be object or null');
        });
      });
    });

    describe('Client.setOptions()', () => {
      it('should be have prototype method #setOptions()', () => {
        expect(Client).to.respondsTo('setOptions');
      });

      it('should be set options', () => {
        const options: IRequestOptions = {
          requestHeaders: {
            Accept: 'application/json',
          },
          timeout: 100,
          proxyUrl: 'proxy.com',
        };

        const context = Object.create(Client.prototype);
        const client = Client.prototype['setOptions'].call(context, options);

        expect(client).to.be.a('object');

        expect(client)
          .to.be.haveOwnProperty('options')
          .that.is.equal(options);
      });

      it('should be set default empty object if passed null', () => {
        const context = Object.create(Client.prototype);
        const client = Client.prototype['setOptions'].call(context, null);

        expect(client).to.be.a('object');

        expect(client)
          .to.be.haveOwnProperty('options')
          .that.is.deep.equal({});
      });

      it('should be throw error if passed argument "options" is not object', () => {
        ['', 5, true, undefined, Symbol(''), BigInt(5)].forEach((type) => {
          expect(() => Client.prototype['setOptions'].call(null, type as any))
            .to.throw(Error, 'Argument "options" must be object or null');
        });
      });
    });

    describe('Client.tokenConnectStrategy()', () => {
      it('should be have prototype method #tokenConnectStrategy()', () => {
        expect(Client).to.respondsTo('tokenConnectStrategy');
      });

      it('should be set credentials', () => {
        const API_TOKEN = 'token';
        const client = Client.prototype['tokenConnectStrategy'].call({}, API_TOKEN);

        expect(client).to.be.a('object');

        expect(client)
          .to.be.haveOwnProperty('apiToken')
          .that.is.equal(API_TOKEN);
      });

      it('should be throw error if "apiToken" not passed', () => {
        expect(() => Client.prototype['tokenConnectStrategy'].call(null, undefined))
          .to.throw(Error, 'Mailjet API_TOKEN is required');
      });
    });

    describe('Client.basicConnectStrategy()', () => {
      it('should be have prototype method #basicConnectStrategy()', () => {
        expect(Client).to.respondsTo('basicConnectStrategy');
      });

      it('should be set credentials', () => {
        const API_KEY = 'key';
        const API_SECRET = 'secret';
        const client = Client.prototype['basicConnectStrategy'].call({}, API_KEY, API_SECRET);

        expect(client).to.be.a('object');

        expect(client)
          .to.be.haveOwnProperty('apiKey')
          .that.is.equal(API_KEY);
        expect(client)
          .to.be.haveOwnProperty('apiSecret')
          .that.is.equal(API_SECRET);
      });

      it('should be throw error if "apiKey" not passed', () => {
        expect(() => Client.prototype['basicConnectStrategy'].call(null, undefined, undefined))
          .to.throw(Error, 'Mailjet API_KEY is required');
      });

      it('should be throw error if "apiSecret" not passed', () => {
        expect(() => Client.prototype['basicConnectStrategy'].call(null, 'key', undefined))
          .to.throw(Error, 'Mailjet API_SECRET is required');
      });
    });

    Object.values(HttpMethods).forEach((method) => {
      describe(`Client.${method}()`, () => {
        it(`should be have prototype method #${method}()`, () => {
          expect(Client).to.respondsTo(method);
        });

        it('should create an Request instance', () => {
          const resource = 'Contact';

          const params: IClientParams = {
            apiKey: 'key',
            apiSecret: 'secret',
            options: {
              requestHeaders: {
                Accept: 'application/json',
              },
              timeout: 100,
              proxyUrl: 'proxy.com',
            },
            config: {
              host: 'new.api.mailjet',
              version: 'v7',
              output: 'xml',
            },
          };

          const client = new Client(params);

          expect(client).to.be.a('object');

          expectOwnProperty(client, 'apiKey', params.apiKey);
          expectOwnProperty(client, 'apiSecret', params.apiSecret);
          expectOwnProperty(client, 'version', packageJSON.version);

          expect(client)
            .to.have.ownProperty('options')
            .that.is.eql(params.options)
            .but.is.not.equal(params.options);
          expect(client)
            .to.have.ownProperty('config')
            .that.is.eql(params.config)
            .but.is.not.equal(params.config);

          const request = client[method](resource, params.config);

          expect(request).to.be.a('object');

          expectOwnProperty(request, 'client', client);
          expectOwnProperty(request, 'method', method);
          expectOwnProperty(request, 'url', resource.toLowerCase());
          expectOwnProperty(request, 'resource', resource.toLowerCase());
          expectOwnProperty(request, 'subPath', 'REST');
          expectOwnProperty(request, 'actionPath', null);

          expect(request)
            .to.haveOwnProperty('config')
            .that.is.eql(params.config)
            .but.is.not.equal(params.config);
        });
      });
    });
  });
});
