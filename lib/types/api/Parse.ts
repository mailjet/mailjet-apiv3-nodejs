import { Common } from '@mailjet/types/api/Common';

export namespace Parse {
  export interface IParseRoute {
    ID: number;
    APIKeyID: number;
    Email: string;
    Url: string;
  }

  // REQUEST PART
  export type PostParseRouteBody = {
    Url: string;
    APIKeyID?: number;
    Email?: string;
  }

  export type PutParseRouteBody = Partial<PostParseRouteBody>

  export type GetParseRouteQueryParams = Partial<Common.IPagination>

  // RESPONSE PART
  type ParseRouteResponse = Common.TResponse<IParseRoute[]>;

  export type PostParseRouteResponse = ParseRouteResponse
  export type PutParseRouteResponse = ParseRouteResponse
  export type GetParseRouteResponse = ParseRouteResponse
}
