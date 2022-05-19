/*external modules*/
/*types*/
import { TObject } from '@custom/types';
/*utils*/
/*lib*/
/*other*/

export interface IRequestConfig {
  host: string;
  version: string;
  output: string;
}

export interface IRequestOptions {
  requestHeaders?: TObject.TUnknownRec;
  timeout?: number;
  proxyUrl?: string;
}

export interface IRequestData {
  filters?: TObject.TUnknownRec
  [key: string]: unknown;
}

export type TRequestData = string | IRequestData;
