import { Common } from '@mailjet/types/api/Common';

export namespace Parse {
  export interface IParseRoute {
    ID: number;
    APIKeyID: number;
    Email: string;
    Url: string;
  }

  // REQUEST PART
  export interface IPostParseRouteBody {
    Url: string;
    APIKeyID?: number;
    Email?: string;
  }

  export interface IPutParseRouteBody extends Partial<IPostParseRouteBody> {}

  export interface IGetParseRouteQueryParams extends Partial<Common.IPagination> {}

  // RESPONSE PART
  type TParseRouteResponse = Common.IResponse<IParseRoute[]>;

  export type TPostParseRouteResponse = TParseRouteResponse
  export type TPutParseRouteResponse = TParseRouteResponse
  export type TGetParseRouteResponse = TParseRouteResponse
}
