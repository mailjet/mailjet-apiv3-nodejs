import { Common } from "./Common";
export declare namespace Sender {
    export enum EmailType {
        Transactional = "transactional",
        Bulk = "bulk",
        Unknown = "unknown"
    }
    export enum SenderStatus {
        Inactive = "Inactive",
        Active = "Active",
        Deleted = "Deleted"
    }
    export interface ISender {
        ID: number;
        EmailType: EmailType;
        IsDefaultSender: boolean;
        Name: string;
        CreatedAt: string;
        DNSID: number;
        Email: string;
        Filename: string;
        Status: SenderStatus;
    }
    export interface ISenderValidate {
        ValidationMethod: string;
        Errors: string;
        GlobalError: string;
    }
    export interface IPostSenderBody {
        Email: string;
        EmailType?: EmailType;
        IsDefaultSender?: boolean;
        Name?: string;
    }
    export interface IPutSenderBody extends Omit<IPostSenderBody, 'Email'> {
    }
    export interface IGetSenderQueryParams extends Partial<Common.IPagination> {
        DnsID?: number;
        Domain?: string;
        Email?: string;
        IsDomainSender?: boolean;
        LocalPart?: string;
        ShowDeleted?: boolean;
        Status?: SenderStatus;
    }
    type TSenderResponse = Common.IResponse<ISender[]>;
    export type TPostSenderResponse = TSenderResponse;
    export type TPutSenderResponse = TSenderResponse;
    export type TGetSenderResponse = TSenderResponse;
    export type TPostSenderValidateResponse = Common.IResponse<ISenderValidate[]>;
    export {};
}
export declare namespace Metasender {
    export interface IMetaSender {
        ID: number;
        Description: string;
        CreatedAt: string;
        Email: string;
        Filename: string;
        IsEnabled: boolean;
    }
    export interface IPostMetaSenderBody {
        Email: string;
        Description?: string;
    }
    export interface IPutMetaSenderBody extends Omit<IPostMetaSenderBody, 'Email'> {
    }
    export interface IGetMetaSenderQueryParams extends Partial<Common.IPagination> {
        DNS?: number;
    }
    type TMetaSenderResponse = Common.IResponse<IMetaSender[]>;
    export type TPostMetaSenderResponse = TMetaSenderResponse;
    export type TPutMetaSenderResponse = TMetaSenderResponse;
    export type TGetMetaSenderResponse = TMetaSenderResponse;
    export {};
}
export declare namespace DNS {
    enum DKIMConfigurationCheckStatus {
        OK = "OK",
        Error = "Error",
        NotChecked = "Not checked"
    }
    enum DKIMConfigurationStatus {
        OK = "OK",
        Error = "Error"
    }
    enum SPFConfigurationCheckStatus {
        OK = "OK",
        Error = "Error",
        NotChecked = "Not checked",
        NotFound = "Not found"
    }
    enum SPFConfigurationStatus {
        OK = "OK",
        Error = "Error"
    }
    interface IDNS {
        ID: number;
        DKIMRecordName: string;
        DKIMRecordValue: string;
        DKIMStatus: DKIMConfigurationCheckStatus;
        Domain: string;
        IsCheckInProgress: boolean;
        LastCheckAt: string;
        OwnerShipToken: string;
        OwnerShipTokenRecordName: string;
        SPFRecordValue: string;
        SPFStatus: SPFConfigurationCheckStatus;
    }
    interface IDNSCheck {
        DKIMErrors: string;
        DKIMRecordCurrentValue: string;
        DKIMStatus: DKIMConfigurationStatus;
        SPFErrors: string;
        SPFRecordCurrentValue: string;
        SPFStatus: SPFConfigurationStatus;
    }
    interface IGetDNSQueryParams extends Partial<Common.IPagination> {
        IsCheckInProgress?: boolean;
        IsSenderIdentified?: boolean;
        IsYahooFBL?: boolean;
        MaxLastCheckAt?: string;
        MinLastCheckAt?: string;
        SPFStatus?: SPFConfigurationCheckStatus;
    }
    type TGetDNSResponse = Common.IResponse<IDNS[]>;
    type TPostDNSCheckResponse = Common.IResponse<IDNSCheck[]>;
}
