import { Common } from "./Common";
export declare namespace APIKeyConfiguration {
    export enum RunLevel {
        Normal = "Normal",
        SoftLock = "Softlock",
        HardLock = "Hardlock"
    }
    export interface IApiKey {
        ID: number;
        ACL: string;
        IsActive: boolean;
        APIKey: string;
        CreatedAt: string;
        IsMaster: boolean;
        Name: string;
        QuarantineValue: number;
        Runlevel: RunLevel;
        SecretKey: string;
        TrackHost: string;
        UserID: number;
    }
    export interface IPostApiKeyBody {
        Name: string;
        ACL?: string;
        IsActive?: boolean;
    }
    export interface IPutApiKeyBody extends Partial<IPostApiKeyBody> {
    }
    export interface IGetApiKeyQueryParams extends Partial<Common.IPagination> {
        APIKey?: string;
        IsActive?: boolean;
        IsMaster?: boolean;
        Name?: string;
    }
    type TApiKeyResponse = Common.IResponse<IApiKey[]>;
    export type TPostApiKeyResponse = TApiKeyResponse;
    export type TPutApiKeyResponse = TApiKeyResponse;
    export type TGetApiKeyResponse = TApiKeyResponse;
    export {};
}
export declare namespace AccountSetting {
    export interface IMyProfile {
        ID: number;
        AddressCity: string;
        AddressCountry: string;
        AddressPostalCode: string;
        AddressState: string;
        AddressStreet: string;
        BillingEmail: string;
        BirthdayAt: string;
        CompanyName: string;
        CompanyNumOfEmployees: string;
        ContactPhone: string;
        EstimatedVolume: number;
        Features: string;
        Firstname: string;
        Industry: number;
        JobTitle: string;
        Lastname: string;
        VATNumber: string;
        Website: string;
        VAT: number;
        UserID: number;
    }
    export interface IUser {
        ID: number;
        ACL: string;
        Email: string;
        LastLoginAt: string;
        Locale: string;
        Timezone: string;
        CreatedAt: string;
        FirstIp: string;
        LastIp: string;
        MaxAllowedAPIKeys: number;
        Username: string;
        WarnedRatelimitAt: string;
    }
    export interface IPutMyProfileBody extends Partial<Omit<IMyProfile, 'ID' | 'VAT' | 'UserID'>> {
    }
    export interface IPutUserBody extends Partial<Omit<IUser, 'ID' | 'CreatedAt' | 'FirstIp' | 'MaxAllowedAPIKeys' | 'WarnedRatelimitAt'>> {
    }
    type TMyProfileResponse = Common.IResponse<IMyProfile[]>;
    type TUserResponse = Common.IResponse<IUser[]>;
    export type TPutMyProfileResponse = TMyProfileResponse;
    export type TGetMyProfileResponse = TMyProfileResponse;
    export type TPutUserResponse = TUserResponse;
    export type TGetUserResponse = TUserResponse;
    export {};
}
