/*external modules*/
import { AxiosResponse } from 'axios';
/*types*/
/*utils*/
/*lib*/
/*other*/

export interface IAPIResponse<TBody> {
  response: AxiosResponse<TBody>,
  body: TBody;
}

export interface IAPILocalResponse<TData, TParams> {
  body: TData;
  params: TParams;
  url: string;
}
