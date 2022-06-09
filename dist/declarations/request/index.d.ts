import { TObject } from "../types";
import { IAPILocalResponse, IAPIResponse } from "../types/api/Response";
import HttpMethods from './HttpMethods';
import { IRequestConfig, TRequestData } from './IRequest';
import Client from '../client';
declare type TUnknownRec = TObject.TUnknownRec;
export declare type TRequestConstructorConfig = null | Partial<IRequestConfig>;
declare class Request {
    private readonly client;
    private readonly method;
    private readonly config;
    private readonly resource;
    private url;
    private subPath;
    private actionPath;
    constructor(client: Client, method: HttpMethods, resource: string, config?: null | Partial<IRequestConfig>);
    getUserAgent(): string;
    getCredentials(): {
        apiToken: string | undefined;
        apiKey: string | undefined;
        apiSecret: string | undefined;
    };
    private getContentType;
    private getParams;
    private getRequest;
    private buildPath;
    private buildSubPath;
    private parseToJSONb;
    id(value: string | number): this;
    action(name: string): this;
    request<TBody extends TUnknownRec>(data?: TRequestData, performAPICall?: true): Promise<IAPIResponse<TBody>>;
    request<TBody extends TRequestData>(data?: TBody, performAPICall?: false): Promise<IAPILocalResponse<TBody>>;
    static protocol: "https://";
}
export default Request;
