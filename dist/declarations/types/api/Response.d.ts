import { Response } from 'superagent';
import { TObject } from "..";
export interface IAPIResponse<TBody extends TObject.TUnknownRec> {
    response: Response;
    body: TBody;
}
export interface IAPILocalResponse<TData> {
    body: TData;
    url: string;
}
