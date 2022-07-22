import { AxiosResponse } from 'axios';
export interface ILibraryResponse<TBody> {
    response: AxiosResponse<TBody>;
    body: TBody;
}
export interface ILibraryLocalResponse<TData, TParams> {
    body: TData;
    params: TParams;
    url: string;
}
