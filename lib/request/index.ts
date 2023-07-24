/*external modules*/
import urlJoin from 'url-join';
import JSONBigInt from 'json-bigint';
import axios, { AxiosError } from 'axios';
/*utils*/
import { setValueIfNotNil } from '../utils/index';
/*types*/
import { TObject } from '../types';
import { LibraryResponse, LibraryLocalResponse } from '../types/api';
import HttpMethods from './HttpMethods';
import {
  RequestConfig,
  RequestData,
  RequestParams,
  RequestConstructorConfig,
  RequestAxiosConfig,
  SubPath,
} from './Request';
/*lib*/
import Client from '../client';
/*other*/

type UnknownRec = TObject.UnknownRec

const JSONb = JSONBigInt({ storeAsString: true });

class Request {
  private readonly client: Client;
  private readonly method: HttpMethods;
  private readonly config: Partial<RequestConfig>;
  private readonly resource: string;

  private url: string;
  private subPath: SubPath;
  private actionPath: string | null;

  constructor(
    client: Client,
    method: HttpMethods,
    resource: string,
    config?: RequestConstructorConfig,
  ) {
    if (!(client instanceof Client)) {
      throw new Error('Argument "client" must be instance of Client');
    }

    if (!Object.values(HttpMethods).includes(method)) {
      throw new Error('Argument "method" must be one of supported methods: get, post, put, delete');
    }

    if (typeof resource !== 'string') {
      throw new Error('Argument "resource" must be string');
    }

    this.client = client;

    this.method = method;
    this.url = resource.toLowerCase();
    this.resource = resource.toLowerCase();
    this.subPath = this.buildSubPath();
    this.actionPath = null;

    this.config = { ...config };
  }

  public getUserAgent() {
    return `mailjet-api-v3-nodejs/${this.client.getPackageVersion()}`;
  }

  public getCredentials() {
    return {
      apiToken: this.client.getAPIToken(),
      apiKey: this.client.getAPIKey(),
      apiSecret: this.client.getAPISecret(),
    };
  }

  private getContentType(url: string) {
    if (typeof url !== 'string') {
      throw new Error('Argument "url" must be string');
    }

    return url.indexOf('text:plain') > -1
      ? 'text/plain'
      : 'application/json';
  }

  private getRequestBody(data: RequestData) {
    return [
      HttpMethods.Put,
      HttpMethods.Post,
      HttpMethods.Delete,
    ].includes(this.method) ? data : undefined;
  }

  private buildFullUrl() {
    const clientConfig = this.client.getConfig();

    const host = this.config.host ?? clientConfig.host;
    const version = this.config.version ?? clientConfig.version;

    return urlJoin(Request.protocol, host, version, this.subPath, this.url);
  }

  private buildSubPath() {
    if (this.actionPath) {
      const isContactListWithCSV = this.resource === 'contactslist' && this.actionPath === 'csvdata/text:plain';
      const isBatchJobWithCSV = this.resource === 'batchjob' && this.actionPath === 'csverror/text:csv';

      return (isContactListWithCSV || isBatchJobWithCSV) ? 'DATA' : this.subPath;
    }
    const isSendResource = this.resource === 'send';
    const resourceContainSMS = this.resource.indexOf('sms') > -1;

    return (!isSendResource && !resourceContainSMS) ? 'REST' : '';
  }

  private makeRequest(url: string, data: RequestData, params: RequestParams) {
    // https://github.com/axios/axios#request-config
    const requestConfig: RequestAxiosConfig = {
      url,
      params,
      data: this.getRequestBody(data),
      method: this.method,
      responseType: 'json',
      headers: {
        'User-Agent': this.getUserAgent(),
        'Content-Type': this.getContentType(url),
      },
      transformResponse(responseData: unknown) {
        const dataIsString = typeof responseData === 'string';
        const isJSONRequested = this.responseType === 'json';

        if (responseData && dataIsString && isJSONRequested) {
          return Request.parseToJSONb(responseData);
        }

        return responseData;
      },
    };

    // BROWSER SIDE
    if (Request.isBrowser()) {
      requestConfig.headers['X-User-Agent'] = requestConfig.headers['User-Agent'];
    }

    // AUTH
    const credentials = this.getCredentials();

    if (credentials.apiToken) {
      requestConfig.headers['Authorization'] = `Bearer ${credentials.apiToken}`;
    } else {
      requestConfig.auth = {
        username: credentials.apiKey as string,
        password: credentials.apiSecret as string,
      };
    }

    // OPTIONS
    const clientConfig = this.client.getConfig();
    const clientOptions = this.client.getOptions();

    // 1. Timeout
    if (clientOptions.timeout) {
      requestConfig.timeout = clientOptions.timeout;
    }

    // 2. Proxy
    if (clientOptions.proxy) {
      requestConfig.proxy = clientOptions.proxy;
    }

    // 3. Headers
    if (clientOptions.headers && Object.keys(clientOptions.headers).length > 0) {
      requestConfig.headers = {
        ...requestConfig.headers,
        ...clientOptions.headers,
      };
    }

    // 4. Output
    const output = this.config.output ?? clientConfig.output;
    if (output) {
      requestConfig.responseType = output;
    }

    // NODE SIDE
    // 5. Max request content size
    if (clientOptions.maxBodyLength) {
      requestConfig.maxBodyLength = clientOptions.maxBodyLength;
    }

    // NODE SIDE
    // 6. Max response content size
    if (clientOptions.maxContentLength) {
      requestConfig.maxContentLength = clientOptions.maxContentLength;
    }

    return axios(requestConfig);
  }

  private setBaseURL(baseUrl: string) {
    this.url = baseUrl.toLowerCase();
    return this;
  }

  public id(value: string | number) {
    if (!['string', 'number'].includes(typeof value)) {
      throw new Error('Argument "value" must be string or number');
    }

    this.url = urlJoin(this.url, value.toString());

    return this;
  }

  public action(name: string) {
    if (typeof name !== 'string') {
      throw new Error('Argument "name" must be string');
    }

    this.actionPath = name.toLowerCase();

    switch (this.actionPath) {
      case 'csvdata': {
        this.actionPath = 'csvdata/text:plain';
        break;
      }
      case 'csverror': {
        this.actionPath = 'csverror/text:csv';
        break;
      }
      default: {
        break;
      }
    }

    this.url = urlJoin(this.url, this.actionPath);
    this.subPath = this.buildSubPath();

    return this;
  }

  public async request<Body extends RequestData>(
    data?: RequestData,
    params?: RequestParams,
    performAPICall?: true,
  ): Promise<LibraryResponse<Body>>

  public async request<Body extends RequestData, Params extends UnknownRec>(
    data?: Body,
    params?: Params,
    performAPICall?: false,
  ): Promise<LibraryLocalResponse<Body, Params>>

  public async request<Body extends RequestData, Params extends UnknownRec>(
    data: RequestData | Body = {},
    params: RequestParams | Params = {},
    performAPICall = true,
  ): Promise<LibraryResponse<Body> | LibraryLocalResponse<Body, Params>> {
    const url = this.buildFullUrl();
    this.setBaseURL(this.resource);

    if (!performAPICall) {
      const body = this.getRequestBody(data);

      return {
        body,
        params,
        url,
      } as LibraryLocalResponse<Body, Params>;
    }

    try {
      const response = await this.makeRequest(url, data, params);
      return {
        response,
        body: response.data,
      };
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const error: any = new Error();

        error.code = err.code;
        error.config = err.config;

        if (err.response) {
          const {
            status,
            statusText,
            data: body,
          } = err.response;

          error.response = err.response;

          error.statusCode = status;
          error.statusText = statusText;

          const errorMessage = body?.ErrorMessage ?? err.message;
          error.originalMessage = errorMessage;
          error.message = `Unsuccessful: Status Code: "${error.statusCode}" Message: "${errorMessage}"`;

          if (body) {
            // https://dev.mailjet.com/email/guides/send-api-v31/#send-in-bulk
            const fullMessage = body.Messages?.[0]?.Errors?.[0]?.ErrorMessage;
            if (typeof fullMessage === 'string') {
              error.message += `;\n${fullMessage}`;
            }

            // v3.1 case
            // https://dev.mailjet.com/email/guides/send-api-v31/#sandbox-mode
            setValueIfNotNil(error, 'ErrorMessage', body.ErrorMessage);
            setValueIfNotNil(error, 'ErrorCode', body.ErrorCode);
            setValueIfNotNil(error, 'ErrorIdentifier', body.ErrorIdentifier);
            setValueIfNotNil(error, 'ErrorRelatedTo', body.ErrorRelatedTo);
          }
        } else {
          error.response = null;

          error.statusCode = null;
          error.statusText = null;

          error.originalMessage = err.message;
          error.message = `Unsuccessful: Error Code: "${error.code}" Message: "${err.message}"`;
        }

        throw error;
      }

      throw err;
    }
  }

  public static protocol = 'https://' as const;

  public static parseToJSONb(text: string) {
    if (typeof text !== 'string') {
      throw new Error('Argument "text" must be string');
    }

    let body;
    try {
      body = JSONb.parse(text);
    } catch (e) {
      body = {};
    }

    return body;
  }

  public static isBrowser() {
    return typeof window === 'object';
  }
}

export default Request;
