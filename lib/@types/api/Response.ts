/*external modules*/
import { Response } from 'superagent';
/*types*/
import { TObject } from '@custom/types';
/*utils*/
/*lib*/
/*other*/

export interface IAPIResponse<TBody extends TObject.TUnknownRec> {
  response: Response,
  body: TBody;
}

export interface IAPILocalResponse<TData> {
  body: TData;
  url: string;
}
