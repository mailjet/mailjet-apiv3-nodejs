/*external modules*/
import qs from 'qs';
import urlJoin from 'url-join';
import * as superagent from 'superagent';
import JSONBigInt from 'json-bigint';
/*utils*/
import {
  isNull,
  isPureObject,
  setValueIfNotNil,
} from '@utils/index';
/*types*/
import { TObject } from '@custom/types';
import { IAPILocalResponse, IAPIResponse } from '@mailjet/types/api/Response';
import HttpMethods from './HttpMethods';
import { IRequestConfig, IRequestData, TRequestData } from './IRequest';
/*lib*/
import Client from '../client';
/*other*/

type TUnknownRec = TObject.TUnknownRec
export type TRequestConstructorConfig = null | Partial<IRequestConfig>;

const JSONb = JSONBigInt({ storeAsString: true });

class Request {
  private readonly client: Client;
  private readonly method: HttpMethods;
  private readonly config: Partial<IRequestConfig>;
  private readonly resource: string;
  private url: string;
  private subPath: 'REST' | 'DATA' | '';
  private actionPath: string | null;

  constructor(
    client: Client,
    method: HttpMethods,
    resource: string,
    config?: null | Partial<IRequestConfig>,
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

    // https://github.com/visionmedia/superagent/blob/master/docs/index.md#parsing-response-bodies
    superagent.parse['application/json'] = (result, cb) => {
      if (typeof result === 'string') {
        // browser
        return this.parseToJSONb(result);
      }
      // node
      const data: Uint8Array[] = [];

      result.on('data', (chunk) => data.push(chunk));
      result.on('end', () => {
        const responseText = Buffer.concat(data).toString('utf-8');
        result.text = responseText;

        cb(null, this.parseToJSONb(responseText));
      });

      return undefined;
    };
  }

  getUserAgent() {
    return `mailjet-api-v3-nodejs/${this.client['version']}`;
  }

  getContentType(url: string) {
    if (typeof url !== 'string') {
      throw new Error('Argument "url" must be string');
    }

    return url.indexOf('text:plain') > -1
      ? 'text/plain'
      : 'application/json';
  }

  getCredentials() {
    return {
      apiToken: this.client['apiToken'],
      apiKey: this.client['apiKey'],
      apiSecret: this.client['apiSecret'],
    };
  }

  getParams(params: string | IRequestData) {
    if (typeof params !== 'object' || isNull(params)) {
      return {};
    }

    if (params.filters) {
      return {
        ...params.filters,
      };
    } if (this.method === 'get') {
      return {
        ...params,
      };
    }

    return {};
  }

  getRequest(url: string) {
    if (typeof url !== 'string') {
      throw new Error('Argument "url" must be string');
    }

    const credentials = this.getCredentials();

    const clientConfig = this.client['config'];
    const clientOptions = this.client['options'];

    const request = superagent[this.method](url);

    request
      .set('user-agent', this.getUserAgent())
      .set('Content-type', this.getContentType(url));

    // https://github.com/visionmedia/superagent/blob/master/docs/index.md#authentication
    if (credentials.apiToken) {
      request.auth(credentials.apiToken, { type: 'bearer' });
    } else {
      request.auth(credentials.apiKey as string, credentials.apiSecret as string, { type: 'auto' });
    }

    if (clientOptions.requestHeaders && Object.keys(clientOptions.requestHeaders).length > 0) {
      // https://github.com/visionmedia/superagent/blob/master/docs/index.md#forcing-specific-connection-ip-address
      request.set({ ...clientOptions.requestHeaders });
    }

    if (clientOptions.timeout) {
      // https://github.com/visionmedia/superagent/blob/master/docs/index.md#forcing-specific-connection-ip-address
      request.timeout({ response: clientOptions.timeout });
    }

    if (clientOptions.proxyUrl) {
      // https://github.com/visionmedia/superagent/blob/master/docs/index.md#forcing-specific-connection-ip-address
      (request as any).connect({ '*': clientOptions.proxyUrl });
    }

    const output = this.config.output ?? clientConfig.output;
    if (output) {
      // https://github.com/visionmedia/superagent/blob/master/docs/index.md#setting-accept
      request.accept(output);
    }

    return request;
  }

  buildPath(params: IRequestData) {
    if (!isPureObject(params)) {
      throw new Error('Argument "params" must be object');
    }

    const clientConfig = this.client['config'];

    const host = this.config.host ?? clientConfig.host;
    const version = this.config.version ?? clientConfig.version;

    const base = urlJoin(version, this.subPath);
    const path = urlJoin(host, base, this.url);

    if (Object.keys(params).length === 0) {
      return path;
    }

    const querystring = qs.stringify(params);
    return `${path}?${querystring}`;
  }

  buildSubPath() {
    if (this.actionPath) {
      const isContactListWithCSV = this.resource === 'contactslist' && this.actionPath === 'csvdata/text:plain';
      const isBatchJobWithCSV = this.resource === 'batchjob' && this.actionPath === 'csverror/text:csv';

      return (isContactListWithCSV || isBatchJobWithCSV) ? 'DATA' : this.subPath;
    }
    const isSendResource = this.resource === 'send';
    const resourceContainSMS = this.resource.indexOf('sms') > -1;

    return (!isSendResource && !resourceContainSMS) ? 'REST' : '';
  }

  parseToJSONb(text: string) {
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

  id(value: string | number) {
    if (!['string', 'number'].includes(typeof value)) {
      throw new Error('Argument "value" must be string or number');
    }

    this.url = urlJoin(this.url, value.toString());

    return this;
  }

  action(name: string) {
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

  async request<TBody extends TUnknownRec>(
    data?: TRequestData,
    performAPICall?: true,
  ): Promise<IAPIResponse<TBody>>

  async request<TBody extends TRequestData>(
    data?: TBody,
    performAPICall?: false,
  ): Promise<IAPILocalResponse<TBody>>

  async request<TBody extends TUnknownRec>(
    data?: TRequestData | TBody,
    performAPICall = true,
  ): Promise<IAPIResponse<TBody> | IAPILocalResponse<TBody>> {
    const params = this.getParams(data ?? {});
    const url = `${Request.protocol}${this.buildPath(params)}`;

    this.url = this.resource;

    if (!performAPICall) {
      const body = ['post', 'put'].includes(this.method) ? data : {};
      return { body, url } as IAPILocalResponse<TBody>;
    }

    const request = this.getRequest(url);
    if (['post', 'put'].includes(this.method) && data) {
      request.send(data);
    }

    try {
      const response = await request;
      return {
        response,
        body: response.body,
      };
    } catch (err: any) {
      const result = err.response;
      const body = result?.body ?? {};
      const errorMessage = body.ErrorMessage ?? err.message;

      const error: any = new Error();

      error.response = result ?? null;
      error.statusCode = err.status ?? null;
      error.message = `Unsuccessful: Status Code: "${error.statusCode}" Message: "${errorMessage}"`;

      if (result) {
        // https://dev.mailjet.com/email/guides/send-api-v31/#send-in-bulk
        const fullMessage = body.Messages?.[0]?.Errors?.[0]?.ErrorMessage;
        if (typeof fullMessage === 'string') {
          error.message += `;\n${fullMessage}`;
        }

        // https://github.com/visionmedia/superagent/blob/master/docs/index.md#response-status
        error.statuses = {
          ok: result.ok,
          clientError: result.clientError,
          serverError: result.serverError,
        };
      }

      // timeout case
      // https://github.com/visionmedia/superagent/blob/master/docs/index.md#timeouts
      setValueIfNotNil(error, 'timeout', err.timeout);
      setValueIfNotNil(error, 'code', err.code);
      setValueIfNotNil(error, 'errno', err.errno);

      // v3.1 case
      // https://dev.mailjet.com/email/guides/send-api-v31/#sandbox-mode
      setValueIfNotNil(error, 'ErrorMessage', errorMessage);
      setValueIfNotNil(error, 'ErrorCode', body.ErrorCode);
      setValueIfNotNil(error, 'ErrorIdentifier', body.ErrorIdentifier);
      setValueIfNotNil(error, 'ErrorRelatedTo', body.ErrorRelatedTo);

      throw error;
    }
  }

  static protocol = 'https://' as const;
}

export default Request;
