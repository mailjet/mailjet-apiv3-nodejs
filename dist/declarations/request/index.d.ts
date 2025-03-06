import { TObject } from '../types';
import { LibraryResponse, LibraryLocalResponse } from '../types/api';
import HttpMethods from './HttpMethods';
import { RequestData, RequestParams, RequestConstructorConfig } from './Request';
import Client from '../client';
declare type UnknownRec = TObject.UnknownRec;
declare class Request {
    private readonly client;
    private readonly method;
    private readonly config;
    private readonly resource;
    private url;
    private subPath;
    private actionPath;
    constructor(client: Client, method: HttpMethods, resource: string, config?: RequestConstructorConfig);
    getUserAgent(): string;
    getCredentials(): {
        apiToken: string | undefined;
        apiKey: string | undefined;
        apiSecret: string | undefined;
    };
    private getContentType;
    private getRequestBody;
    private buildFullUrl;
    private buildSubPath;
    private makeRequest;
    private setBaseURL;
    id(value: string | number): this;
    action(name: string): this;
    request<Body extends RequestData>(data?: RequestData, params?: RequestParams, performAPICall?: true): Promise<LibraryResponse<Body>>;
    request<Body extends RequestData, Params extends UnknownRec>(data?: Body, params?: Params, performAPICall?: false): Promise<LibraryLocalResponse<Body, Params>>;
    static protocol: "https://";
    static parseToJSONb(text: string): any;
    static isBrowser(): boolean;
    private validateActionData;
}
export default Request;
