import { Common } from "./Common";
export declare namespace Segmentation {
    export enum SegmentStatus {
        Used = "used",
        UnUsed = "unused",
        Deleted = "deleted"
    }
    export interface IContactFilter {
        ID: number;
        Description: string;
        Expression: string;
        Name: string;
        Status: SegmentStatus;
    }
    export interface IPostContactFilterBody {
        Name: string;
        Expression: string;
        Description?: string;
    }
    export interface IPutContactFilterBody extends Partial<IPostContactFilterBody> {
        Status?: SegmentStatus;
    }
    export interface IGetContactFilterQueryParams extends Partial<Common.IPagination> {
        ShowDeleted?: boolean;
        Status?: SegmentStatus;
    }
    type TContactFilterResponse = Common.IResponse<IContactFilter[]>;
    export type TPostContactFilterResponse = TContactFilterResponse;
    export type TPutContactFilterResponse = TContactFilterResponse;
    export type TGetContactFilterResponse = TContactFilterResponse;
    export {};
}
