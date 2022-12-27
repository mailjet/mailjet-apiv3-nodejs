/*external modules*/
/*utils*/
import {
  isPureObject,
  setValueIfNotNil,
} from '@utils/index';
/*types*/
import HttpMethods from '../request/HttpMethods';
import { ClientParams } from './Client';
import { RequestConfig, RequestOptions, RequestConstructorConfig } from '../request/Request';
/*lib*/
import Request from '../request';
import packageJSON from '../../package.json';
/*other*/

export type ClientConnectParams = Pick<ClientParams, 'config' | 'options'>;

class Client {
  private version!: string;

  private config!: RequestConfig;
  private options!: RequestOptions;

  private apiKey?: string;
  private apiSecret?: string;
  private apiToken?: string;

  constructor(params: ClientParams) {
    if (!isPureObject(params)) {
      throw new Error('Argument "params" must be object');
    }

    this.init(this.cloneParams(params));
  }

  public getPackageVersion() {
    return this.version;
  }

  public getAPIKey() {
    return this.apiKey;
  }

  public getAPISecret() {
    return this.apiSecret;
  }

  public getAPIToken() {
    return this.apiToken;
  }

  public getConfig() {
    return { ...this.config };
  }

  public getOptions() {
    return { ...this.options };
  }

  public get(resource: string, config?: RequestConstructorConfig) {
    return new Request(this, HttpMethods.Get, resource, config);
  }

  public post(resource: string, config?: RequestConstructorConfig) {
    return new Request(this, HttpMethods.Post, resource, config);
  }

  public put(resource: string, config?: RequestConstructorConfig) {
    return new Request(this, HttpMethods.Put, resource, config);
  }

  public delete(resource: string, config?: RequestConstructorConfig) {
    return new Request(this, HttpMethods.Delete, resource, config);
  }

  private init(params: ClientParams) {
    if (!isPureObject(params)) {
      throw new Error('Argument "params" must be object');
    }

    const {
      apiToken,
      apiKey,
      apiSecret,
      options,
      config,
    } = params;

    this.version = Client.packageJSON.version;

    this.setConfig(config ?? null);
    this.setOptions(options ?? null);

    return 'apiToken' in params
      ? this.tokenConnectStrategy(apiToken)
      : this.basicConnectStrategy(apiKey, apiSecret);
  }

  private cloneParams(params: ClientParams) {
    if (!isPureObject(params)) {
      throw new Error('Argument "params" must be object');
    }

    const clonedParams = { ...params };

    if (params.config) {
      clonedParams.config = {
        ...params.config,
      };
    }

    if (params.options) {
      clonedParams.options = {
        ...params.options,
      };

      if (clonedParams.options.proxy) {
        clonedParams.options.proxy = {
          ...clonedParams.options.proxy,
        };
      }

      if (clonedParams.options.headers) {
        clonedParams.options.headers = {
          ...clonedParams.options.headers,
        };
      }
    }

    return clonedParams;
  }

  private setConfig(customConfig: Partial<RequestConfig> | null) {
    if (typeof customConfig !== 'object') {
      throw new Error('Argument "customConfig" must be object or null');
    }

    const config = { ...Client.config };

    if (customConfig !== null) {
      setValueIfNotNil(config, 'host', customConfig.host);
      setValueIfNotNil(config, 'output', customConfig.output);
      setValueIfNotNil(config, 'version', customConfig.version);
    }

    this.config = config;

    return this;
  }

  private setOptions(options: RequestOptions | null) {
    if (typeof options !== 'object') {
      throw new Error('Argument "options" must be object or null');
    }

    this.options = options ?? {};

    return this;
  }

  private tokenConnectStrategy(apiToken: string | undefined) {
    if (!apiToken) {
      throw new Error('Mailjet API_TOKEN is required');
    }

    this.apiToken = apiToken;

    return this;
  }

  private basicConnectStrategy(apiKey: string | undefined, apiSecret: string | undefined) {
    if (!apiKey) {
      throw new Error('Mailjet API_KEY is required');
    }
    if (!apiSecret) {
      throw new Error('Mailjet API_SECRET is required');
    }

    this.apiKey = apiKey;
    this.apiSecret = apiSecret;

    return this;
  }

  public static apiConnect(apiKey: string, apiSecret: string, params?: ClientConnectParams) {
    return new Client({ apiKey, apiSecret, ...params });
  }

  public static smsConnect(apiToken: string, params?: ClientConnectParams) {
    return new Client({ apiToken, ...params });
  }

  public static config: Readonly<RequestConfig> = Object.freeze({
    host: 'api.mailjet.com',
    version: 'v3',
    output: 'json',
  } as const);

  public static packageJSON = Object.freeze({
    ...packageJSON,
  } as const);
}

export default Client;
