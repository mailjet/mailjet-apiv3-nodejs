import { AxiosResponse } from 'axios';
export interface IAPIResponse<TBody> {
    response: AxiosResponse<TBody>;
    body: TBody;
}
export interface IAPILocalResponse<TData, TParams> {
    body: TData;
    params: TParams;
    url: string;
}
