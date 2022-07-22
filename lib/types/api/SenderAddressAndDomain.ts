import { Common } from '@mailjet/types/api/Common';

export namespace Sender {
  export enum EmailType {
    Transactional = 'transactional',
    Bulk = 'bulk',
    Unknown = 'unknown'
  }

  export enum SenderStatus {
    Inactive = 'Inactive',
    Active = 'Active',
    Deleted = 'Deleted',
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

  // REQUEST PART
  export interface IPostSenderBody {
    Email: string;
    EmailType?: EmailType;
    IsDefaultSender?: boolean;
    Name?: string;
  }

  export interface IPutSenderBody extends Omit<IPostSenderBody, 'Email'> {}

  export interface IGetSenderQueryParams extends Partial<Common.IPagination> {
    DnsID?: number;
    Domain?: string;
    Email?: string;
    IsDomainSender?: boolean;
    LocalPart?: string;
    ShowDeleted?: boolean;
    Status?: SenderStatus;
  }

  // RESPONSE PART
  type TSenderResponse = Common.IResponse<ISender[]>;

  export type TPostSenderResponse = TSenderResponse
  export type TPutSenderResponse = TSenderResponse
  export type TGetSenderResponse = TSenderResponse

  export type TPostSenderValidateResponse = Common.IResponse<ISenderValidate[]>;
}

export namespace Metasender {
  export interface IMetaSender {
    ID: number;
    Description: string;
    CreatedAt: string;
    Email: string;
    Filename: string;
    IsEnabled: boolean;
  }

  // REQUEST PART
  export interface IPostMetaSenderBody {
    Email: string;
    Description?: string;
  }

  export interface IPutMetaSenderBody extends Omit<IPostMetaSenderBody, 'Email'> {}

  export interface IGetMetaSenderQueryParams extends Partial<Common.IPagination> {
    DNS?: number;
  }

  // RESPONSE PART
  type TMetaSenderResponse = Common.IResponse<IMetaSender[]>;

  export type TPostMetaSenderResponse = TMetaSenderResponse
  export type TPutMetaSenderResponse = TMetaSenderResponse
  export type TGetMetaSenderResponse = TMetaSenderResponse
}

export namespace DNS {
  export enum DKIMConfigurationCheckStatus {
    OK = 'OK',
    Error = 'Error',
    NotChecked = 'Not checked'
  }

  export enum DKIMConfigurationStatus {
    OK = 'OK',
    Error = 'Error'
  }

  export enum SPFConfigurationCheckStatus {
    OK = 'OK',
    Error = 'Error',
    NotChecked = 'Not checked',
    NotFound = 'Not found',
  }

  export enum SPFConfigurationStatus {
    OK = 'OK',
    Error = 'Error'
  }

  export interface IDNS {
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

  export interface IDNSCheck {
    DKIMErrors: string;
    DKIMRecordCurrentValue: string;
    DKIMStatus: DKIMConfigurationStatus;
    SPFErrors: string;
    SPFRecordCurrentValue: string;
    SPFStatus: SPFConfigurationStatus;
  }

  // REQUEST PART
  export interface IGetDNSQueryParams extends Partial<Common.IPagination> {
    IsCheckInProgress?: boolean;
    IsSenderIdentified?: boolean;
    IsYahooFBL?: boolean;
    MaxLastCheckAt?: string;
    MinLastCheckAt?: string;
    SPFStatus?: SPFConfigurationCheckStatus;
  }

  // RESPONSE PART
  export type TGetDNSResponse = Common.IResponse<IDNS[]>;
  export type TPostDNSCheckResponse = Common.IResponse<IDNSCheck[]>;
}
