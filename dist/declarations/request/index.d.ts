import { TObject } from "../types";
import { ILibraryResponse, ILibraryLocalResponse } from "../types/api/LibraryResponse";
import HttpMethods from './HttpMethods';
import { TRequestData, TRequestParams, TRequestConstructorConfig } from './IRequest';
import Client from '../client';
declare type TUnknownRec = TObject.TUnknownRec;
declare class Request {
    private readonly client;
    private readonly method;
    private readonly config;
    private readonly resource;
    private url;
    private subPath;
    private actionPath;
    constructor(client: Client, method: HttpMethods, resource: string, config?: TRequestConstructorConfig);
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
    request<TBody extends TRequestData>(data?: TRequestData, params?: TRequestParams, performAPICall?: true): Promise<ILibraryResponse<TBody>>;
    request<TBody extends TRequestData, TParams extends TUnknownRec>(data?: TBody, params?: TParams, performAPICall?: false): Promise<ILibraryLocalResponse<TBody, TParams>>;
    static protocol: "https://";
    static parseToJSONb(text: string): any;
    static isBrowser(): boolean;
}
export default Request;
