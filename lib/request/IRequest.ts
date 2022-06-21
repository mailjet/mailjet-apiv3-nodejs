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

export type TRequestData = string | TObject.TUnknownRec;
export type TRequestParams = TObject.TUnknownRec;

export type TRequestMethodOptions<
  TBody extends TRequestData,
  TParams extends TObject.TUnknownRec,
> = {
  data?: TRequestData | TBody;
  params?: TRequestParams | TParams;
  performAPICall?: boolean;
};

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

export type TSubPath = 'REST' | 'DATA' | '';
