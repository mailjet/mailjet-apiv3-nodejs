import * as superagent from 'superagent';
import { TObject } from '@custom/types';
import { IAPILocalResponse, IAPIResponse } from '@mailjet/types/api/Response';
import HttpMethods from './HttpMethods';
import { IRequestConfig, IRequestData, TRequestData } from './IRequest';
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
    getContentType(url: string): "application/json" | "text/plain";
    getCredentials(): {
        apiToken: string | undefined;
        apiKey: string | undefined;
        apiSecret: string | undefined;
    };
    getParams(params: string | IRequestData): {
        [x: string]: unknown;
        filters?: TObject.TUnknownRec | undefined;
    };
    getRequest(url: string): superagent.SuperAgentRequest;
    buildPath(params: IRequestData): string;
    buildSubPath(): "" | "REST" | "DATA";
    parseToJSONb(text: string): any;
    id(value: string | number): this;
    action(name: string): this;
    request<TBody extends TUnknownRec>(data?: TRequestData, performAPICall?: true): Promise<IAPIResponse<TBody>>;
    request<TBody extends TRequestData>(data?: TBody, performAPICall?: false): Promise<IAPILocalResponse<TBody>>;
    static protocol: "https://";
}
export default Request;
