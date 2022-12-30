/*external modules*/
import {
  AxiosProxyConfig,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  ResponseType,
} from 'axios';
/*types*/
import { TObject } from '../types';
/*utils*/
/*lib*/
/*other*/

export interface RequestConfig {
  host: string;
  version: string;
  output: ResponseType;
}

export interface RequestOptions {
  timeout?: number;
  proxy?: AxiosProxyConfig;
  headers?: AxiosRequestHeaders;
  maxBodyLength?: number;
  maxContentLength?: number;
}

export type SubPath = 'REST' | 'DATA' | '';

export type RequestData = string | TObject.UnknownRec;
export type RequestParams = TObject.UnknownRec;
export type RequestConstructorConfig = null | Partial<RequestConfig>;

export type RequestAxiosConfig = Required<Pick<
    AxiosRequestConfig,
    | 'url'
    | 'data'
    | 'params'
    | 'method'
    | 'headers'
    | 'responseType'
    | 'transformResponse'
  >
> & Pick<AxiosRequestConfig, 'auth' | 'timeout' | 'proxy' | 'maxBodyLength' | 'maxContentLength'>
