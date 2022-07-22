/*external modules*/
import { AxiosResponse } from 'axios';
/*types*/
/*utils*/
/*lib*/
/*other*/

export interface ILibraryResponse<TBody> {
  response: AxiosResponse<TBody>,
  body: TBody;
}

export interface ILibraryLocalResponse<TData, TParams> {
  body: TData;
  params: TParams;
  url: string;
}
