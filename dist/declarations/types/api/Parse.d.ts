import { Common } from './Common';
export declare namespace Parse {
    export interface ParseRoute {
        ID: number;
        APIKeyID: number;
        Email: string;
        Url: string;
    }
    export type PostParseRouteBody = {
        Url: string;
        APIKeyID?: number;
        Email?: string;
    };
    export type PutParseRouteBody = Partial<PostParseRouteBody>;
    export type GetParseRouteQueryParams = Partial<Common.Pagination>;
    type ParseRouteResponse = Common.Response<ParseRoute[]>;
    export type PostParseRouteResponse = ParseRouteResponse;
    export type PutParseRouteResponse = ParseRouteResponse;
    export type GetParseRouteResponse = ParseRouteResponse;
    export {};
}
