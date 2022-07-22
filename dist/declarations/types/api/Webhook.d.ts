import { Common } from "./Common";
export declare namespace Webhook {
    export enum EventType {
        Open = "open",
        Click = "click",
        Bounce = "bounce",
        Spam = "spam",
        Blocked = "blocked",
        UnSub = "unsub",
        Sent = "sent"
    }
    export enum EventTypeValue {
        Click = 1,
        Bounce = 2,
        Spam = 3,
        Blocked = 4,
        Unsubscribe = 5,
        Open = 6,
        Sent = 7
    }
    export enum Status {
        Dead = "dead",
        Alive = "alive"
    }
    export type TVersion = 1 | 2;
    export interface IEventCallbackUrl {
        ID: number;
        EventType: EventType;
        IsBackup: boolean;
        Status: Status;
        APIKeyID: number;
        Version: TVersion;
        Url: string;
    }
    export interface IPostEventCallbackUrlBody {
        Url: string;
        EventType?: EventType;
        IsBackup?: boolean;
        Status?: Status;
    }
    export interface IPutEventCallbackUrlBody extends Partial<IPostEventCallbackUrlBody> {
    }
    export interface IGetEventCallbackUrlQueryParams extends Partial<Common.IPagination> {
        Backup?: boolean;
        EventType?: EventTypeValue;
        Status?: string;
        Version?: TVersion;
    }
    type TEventCallbackUrlResponse = Common.IResponse<IEventCallbackUrl[]>;
    export type TPostEventCallbackUrlResponse = TEventCallbackUrlResponse;
    export type TPutEventCallbackUrlResponse = TEventCallbackUrlResponse;
    export type TGetEventCallbackUrlResponse = TEventCallbackUrlResponse;
    export {};
}
