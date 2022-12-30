import { Common } from './Common';
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
    export interface Sender {
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
    export interface SenderValidate {
        ValidationMethod: string;
        Errors: string;
        GlobalError: string;
    }
    export type PostSenderBody = {
        Email: string;
        EmailType?: EmailType;
        IsDefaultSender?: boolean;
        Name?: string;
    };
    export type PutSenderBody = Omit<PostSenderBody, 'Email'>;
    export type GetSenderQueryParams = Partial<Common.Pagination> & {
        DnsID?: number;
        Domain?: string;
        Email?: string;
        IsDomainSender?: boolean;
        LocalPart?: string;
        ShowDeleted?: boolean;
        Status?: SenderStatus;
    };
    type SenderResponse = Common.Response<Sender[]>;
    export type PostSenderResponse = SenderResponse;
    export type PutSenderResponse = SenderResponse;
    export type GetSenderResponse = SenderResponse;
    export type PostSenderValidateResponse = Common.Response<SenderValidate[]>;
    export {};
}
export declare namespace Metasender {
    export interface MetaSender {
        ID: number;
        Description: string;
        CreatedAt: string;
        Email: string;
        Filename: string;
        IsEnabled: boolean;
    }
    export type PostMetaSenderBody = {
        Email: string;
        Description?: string;
    };
    export type PutMetaSenderBody = Omit<PostMetaSenderBody, 'Email'>;
    export type GetMetaSenderQueryParams = Partial<Common.Pagination> & {
        DNS?: number;
    };
    type MetaSenderResponse = Common.Response<MetaSender[]>;
    export type PostMetaSenderResponse = MetaSenderResponse;
    export type PutMetaSenderResponse = MetaSenderResponse;
    export type GetMetaSenderResponse = MetaSenderResponse;
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
    interface DNS {
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
    interface DNSCheck {
        DKIMErrors: string;
        DKIMRecordCurrentValue: string;
        DKIMStatus: DKIMConfigurationStatus;
        SPFErrors: string;
        SPFRecordCurrentValue: string;
        SPFStatus: SPFConfigurationStatus;
    }
    type GetDNSQueryParams = Partial<Common.Pagination> & {
        IsCheckInProgress?: boolean;
        IsSenderIdentified?: boolean;
        IsYahooFBL?: boolean;
        MaxLastCheckAt?: string;
        MinLastCheckAt?: string;
        SPFStatus?: SPFConfigurationCheckStatus;
    };
    type GetDNSResponse = Common.Response<DNS[]>;
    type PostDNSCheckResponse = Common.Response<DNSCheck[]>;
}
