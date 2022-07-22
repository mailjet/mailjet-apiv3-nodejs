import { Common } from "./Common";
export declare namespace Parse {
    export interface IParseRoute {
        ID: number;
        APIKeyID: number;
        Email: string;
        Url: string;
    }
    export interface IPostParseRouteBody {
        Url: string;
        APIKeyID?: number;
        Email?: string;
    }
    export interface IPutParseRouteBody extends Partial<IPostParseRouteBody> {
    }
    export interface IGetParseRouteQueryParams extends Partial<Common.IPagination> {
    }
    type TParseRouteResponse = Common.IResponse<IParseRoute[]>;
    export type TPostParseRouteResponse = TParseRouteResponse;
    export type TPutParseRouteResponse = TParseRouteResponse;
    export type TGetParseRouteResponse = TParseRouteResponse;
    export {};
}
