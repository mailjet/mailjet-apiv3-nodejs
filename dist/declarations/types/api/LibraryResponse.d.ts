import { AxiosResponse } from 'axios';
export interface LibraryResponse<Body> {
    response: AxiosResponse<Body>;
    body: Body;
}
export interface LibraryLocalResponse<Data, Params> {
    body: Data;
    params: Params;
    url: string;
}
