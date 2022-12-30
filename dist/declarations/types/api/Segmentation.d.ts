import { Common } from './Common';
export declare namespace Segmentation {
    export enum SegmentStatus {
        Used = "used",
        UnUsed = "unused",
        Deleted = "deleted"
    }
    export interface ContactFilter {
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
    export type GetContactFilterQueryParams = Partial<Common.Pagination> & {
        ShowDeleted?: boolean;
        Status?: SegmentStatus;
    };
    type ContactFilterResponse = Common.Response<ContactFilter[]>;
    export type PostContactFilterResponse = ContactFilterResponse;
    export type PutContactFilterResponse = ContactFilterResponse;
    export type GetContactFilterResponse = ContactFilterResponse;
    export {};
}
