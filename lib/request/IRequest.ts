/*external modules*/
import {
  AxiosProxyConfig,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  ResponseType,
} from 'axios';
/*types*/
import { TObject } from '@custom/types';
/*utils*/
/*lib*/
/*other*/

export interface IRequestConfig {
  host: string;
  version: string;
  output: ResponseType;
}

export interface IRequestOptions {
  timeout?: number;
  proxy?: AxiosProxyConfig;
  headers?: AxiosRequestHeaders;
  maxBodyLength?: number;
  maxContentLength?: number;
}

export type TSubPath = 'REST' | 'DATA' | '';

export type TRequestData = string | TObject.TUnknownRec;
export type TRequestParams = TObject.TUnknownRec;
export type TRequestConstructorConfig = null | Partial<IRequestConfig>;

export type TRequestAxiosConfig = Required<Pick<
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
