import { AxiosProxyConfig, AxiosRequestConfig, RawAxiosRequestHeaders, ResponseType } from 'axios';
import { TObject } from '../types';
export interface RequestConfig {
    host: string;
    version: string;
    output: ResponseType;
}
export interface RequestOptions {
    timeout?: number;
    proxy?: AxiosProxyConfig;
    headers?: RawAxiosRequestHeaders;
    maxBodyLength?: number;
    maxContentLength?: number;
}
export declare type SubPath = 'REST' | 'DATA' | '';
export declare type RequestData = string | TObject.UnknownRec;
export declare type RequestParams = TObject.UnknownRec;
export declare type RequestConstructorConfig = null | Partial<RequestConfig>;
export declare type RequestAxiosConfig = Required<Pick<AxiosRequestConfig, 'url' | 'data' | 'params' | 'method' | 'headers' | 'responseType' | 'transformResponse'>> & Pick<AxiosRequestConfig, 'auth' | 'timeout' | 'proxy' | 'maxBodyLength' | 'maxContentLength'>;
