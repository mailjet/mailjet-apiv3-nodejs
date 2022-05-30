import { IRequestOptions, IRequestConfig } from '../request/IRequest';
export interface IClientParams {
    apiKey?: string;
    apiSecret?: string;
    apiToken?: string;
    options?: null | IRequestOptions;
    config?: null | Partial<IRequestConfig>;
}
