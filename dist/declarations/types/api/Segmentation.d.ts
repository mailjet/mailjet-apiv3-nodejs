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
    export type PostContactFilterBody = {
        Name: string;
        Expression: string;
        Description?: string;
    };
    export type PutContactFilterBody = Partial<PostContactFilterBody> & {
        Status?: SegmentStatus;
    };
    export type GetContactFilterQueryParams = Partial<Common.IPagination> & {
        ShowDeleted?: boolean;
        Status?: SegmentStatus;
    };
    type ContactFilterResponse = Common.TResponse<IContactFilter[]>;
    export type PostContactFilterResponse = ContactFilterResponse;
    export type PutContactFilterResponse = ContactFilterResponse;
    export type GetContactFilterResponse = ContactFilterResponse;
    export {};
}
