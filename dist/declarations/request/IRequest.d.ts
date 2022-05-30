import { TObject } from '@custom/types';
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
    filters?: TObject.TUnknownRec;
    [key: string]: unknown;
}
export declare type TRequestData = string | IRequestData;
