import { RequestOptions, RequestConfig } from '../request/Request';
export interface ClientParams {
    apiKey?: string;
    apiSecret?: string;
    apiToken?: string;
    options?: null | RequestOptions;
    config?: null | Partial<RequestConfig>;
}
