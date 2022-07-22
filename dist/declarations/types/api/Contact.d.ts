import { Common } from "./Common";
export declare namespace Contact {
    export interface IContact {
        ID: number;
        IsExcludedFromCampaigns: boolean;
        Name: string;
        CreatedAt: string;
        DeliveredCount: number;
        Email: string;
        ExclusionFromCampaignsUpdatedAt: string;
        IsOptInPending: boolean;
        IsSpamComplaining: boolean;
        LastActivityAt: string;
        LastUpdateAt: string;
    }
    export interface IPostContactBody {
        Email: string;
        IsExcludedFromCampaigns?: boolean;
        Name?: string;
    }
    export interface IPutContactBody extends Omit<IPostContactBody, 'Email'> {
    }
    export interface IGetContactQueryParams extends Partial<Common.IPagination> {
        Campaign?: number;
        ContactsList?: number;
        IsExcludedFromCampaigns?: boolean;
    }
    type TContactResponse = Common.IResponse<IContact[]>;
    export type TPostContactResponse = TContactResponse;
    export type IPutContactResponse = TContactResponse;
    export type TGetContactResponse = TContactResponse;
    export {};
}
export declare namespace ContactList {
    export interface IContactList {
        ID: number;
        IsDeleted: boolean;
        Name: string;
        Address: string;
        CreatedAt: string;
        SubscriberCount: number;
    }
    export interface IPostContactListBody {
        Name: string;
        IsDeleted?: boolean;
    }
    export interface IPutContactListBody extends Partial<IPostContactListBody> {
    }
    export interface IGetContactListQueryParams extends Partial<Common.IPagination> {
        Address?: string;
        ExcludeID?: number;
        IsDeleted?: boolean;
        Name?: string;
    }
    type TContactListResponse = Common.IResponse<IContactList[]>;
    export type TPostContactListResponse = TContactListResponse;
    export type TPutContactListResponse = TContactListResponse;
    export type TGetContactListResponse = TContactListResponse;
    export {};
}
export declare namespace BulkContactManagement {
    export enum ManageContactsAction {
        AddForce = "addforce",
        AddNoForce = "addnoforce",
        Remove = "remove",
        UnSub = "unsub"
    }
    export enum ImportListAction {
        AddForce = "addforce",
        AddNoForce = "addnoforce",
        UnSub = "unsub",
        DuplicateOverride = "duplicate-override",
        DuplicateNoOverride = "duplicate-no-override"
    }
    export enum ImportCSVMethod {
        AddForce = "addforce",
        AddNoForce = "addnoforce",
        Remove = "remove",
        UnSub = "unsub",
        ExcludeMarketing = "excludemarketing",
        IncludeMarketing = "includemarketing"
    }
    export enum CSVImportStatus {
        Upload = "Upload",
        Completed = "Completed",
        Abort = "Abort"
    }
    export enum JobStatus {
        Completed = "Completed",
        InProgress = "In Progress",
        Error = "Error"
    }
    export interface IJob {
        JobID: number;
    }
    export interface ICSVImport {
        ID: number;
        ErrTreshold: number;
        ImportOptions: string;
        Method: ImportCSVMethod;
        AliveAt: string;
        ContactsListID: number;
        Count: number;
        Current: number;
        DataID: number;
        Errcount: number;
        JobEnd: string;
        JobStart: string;
        RequestAt: string;
        Status: CSVImportStatus;
    }
    export interface IContactList {
        ListID: number;
        Action: ManageContactsAction;
    }
    export interface IContactManageManyContacts {
        ContactsLists: IContactList[];
        Count: number;
        Error: string;
        ErrorFile: string;
        JobEnd: string;
        JobStart: string;
        Status: JobStatus;
    }
    export interface IContactsListImportList {
        JobID: number;
        Action: ImportListAction;
        ListID: number;
    }
    export interface IContactBody<TProperties = Common.TUnknownRec> {
        Email: string;
        Name?: string;
        IsExcludedFromCampaigns?: boolean;
        Properties?: TProperties;
    }
    export interface IPostContactManageManyContactsBody<TProperties = Common.TUnknownRec> {
        Contacts: Array<IContactBody<TProperties>>;
        ContactsLists?: IContactList[];
    }
    export interface IPostContactsListImportListBody {
        Action: ImportListAction;
        ListID: number;
    }
    export interface IPostContactsListManageManyContactsBody<TProperties = Common.TUnknownRec> {
        Action: ManageContactsAction;
        Contacts: Array<IContactBody<TProperties>>;
    }
    export interface IPostCSVImportBody {
        ContactsListID: number;
        DataID: number;
        ErrTreshold?: number;
        ImportOptions?: string;
        Method?: ImportCSVMethod;
    }
    export interface IPutCSVImportBody extends Partial<IPostCSVImportBody> {
        Status?: CSVImportStatus;
    }
    export interface IGetCSVImportQueryParams extends Partial<Common.IPagination> {
    }
    type TJobResponse = Common.IResponse<IJob[]>;
    type TCSVImportResponse = Common.IResponse<ICSVImport[]>;
    type TContactManageManyContactsResponse = Common.IResponse<IContactManageManyContacts[]>;
    export type TPostContactManageManyContactsResponse = TJobResponse;
    export type TGetContactManageManyContactsResponse = TContactManageManyContactsResponse;
    export type TPostContactsListImportListResponse = TJobResponse;
    export type TGetContactsListImportListResponse = Common.IResponse<IContactsListImportList[]>;
    export type TPostContactsListManageManyContactsResponse = TJobResponse;
    export type TGetContactsListManageManyContactsResponse = TContactManageManyContactsResponse;
    export type TPostCSVImportResponse = TCSVImportResponse;
    export type TPutCSVImportResponse = TCSVImportResponse;
    export type TGetCSVImportResponse = TCSVImportResponse;
    export {};
}
export declare namespace ContactProperties {
    export enum DataType {
        Str = "str",
        Int = "int",
        Float = "float",
        Bool = "bool",
        DateTime = "datetime"
    }
    export enum NameSpace {
        Static = "static",
        Historic = "historic"
    }
    export interface IContactProperty {
        Name: string;
        Value: string;
    }
    export interface IContactData {
        ID: number;
        ContactID: number;
        Data: IContactProperty[];
    }
    export interface IContactMetaData {
        ID: number;
        Datatype: DataType;
        Name: string;
        NameSpace: NameSpace;
    }
    export interface IPostContactMetaDataBody {
        Name: string;
        Datatype?: DataType;
        NameSpace?: NameSpace;
    }
    export interface IPutContactMetaDataBody {
        Name?: string;
        Datatype?: DataType;
    }
    export interface IGetContactMetaDataQueryParams extends Partial<Common.IPagination> {
        DataType?: DataType;
        Namespace?: NameSpace;
    }
    export interface IPutContactDataBody {
        Data: IContactProperty[];
    }
    export interface IGetContactDataQueryParams extends Partial<Common.IPagination> {
        Campaign?: number;
        ContactEmail?: string;
        ContactsList?: number;
        Fields?: string;
        LastActivityAt?: string;
    }
    type TContactDataResponse = Common.IResponse<IContactData[]>;
    type TContactMetaDataResponse = Common.IResponse<IContactMetaData[]>;
    export type TPostContactMetaDataResponse = TContactMetaDataResponse;
    export type TPutContactMetaDataResponse = TContactMetaDataResponse;
    export type TGetContactMetaDataResponse = TContactMetaDataResponse;
    export type TPutContactDataResponse = TContactDataResponse;
    export type TGetContactDataResponse = TContactDataResponse;
    export {};
}
export declare namespace ContactSubscription {
    export interface IManageContacts<TProperties = Common.TUnknownRec> {
        Email: string;
        Action: BulkContactManagement.ManageContactsAction;
        Name: string;
        Properties: TProperties;
    }
    export interface IListRecipient {
        ID: number;
        IsUnsubscribed: boolean;
        ContactID: number;
        ListID: number;
        ListName: string;
        SubscribedAt: string;
        UnsubscribedAt: string;
    }
    export interface IContactsList {
        ListID: number;
        IsUnsub: boolean;
        SubscribedAt: string;
    }
    export interface IContactsListSignup {
        ID: number;
        ConfirmAt: number;
        ConfirmIp: string;
        ContactID: number;
        Email: string;
        ListID: number;
        SignupAt: number;
        SignupIp: string;
        SignupKey: string;
        SourceId: number;
        Source: string;
    }
    export interface IPostContactManageContactsListsBody {
        ContactsLists: BulkContactManagement.IContactList[];
    }
    export interface IPostContactsListManageContactBody<TProperties = Common.TUnknownRec> {
        Email: string;
        Action: BulkContactManagement.ManageContactsAction;
        Name?: string;
        Properties?: TProperties;
    }
    export interface IPostListRecipientBody {
        IsUnsubscribed?: boolean;
        ContactID: number;
        ContactAlt?: string;
        ListID: number;
        ListAlt?: string;
    }
    export interface IPutListRecipientBody {
        IsUnsubscribed?: boolean;
    }
    export interface IGetListRecipientQueryParams extends Partial<Common.IPagination> {
        Blocked?: boolean;
        Contact?: number;
        ContactEmail?: string;
        ContactsList?: number;
        IgnoreDeleted?: boolean;
        IsExcludedFromCampaigns?: boolean;
        LastActivityAt?: string;
        ListName?: string;
        Opened?: boolean;
        Unsub?: boolean;
    }
    export interface IGetContactsListSignupQueryParams extends Partial<Common.IPagination> {
        Contact?: number;
        ContactsList?: number;
        Domain?: string;
        Email?: string;
        LocalPart?: string;
        MaxConfirmAt?: number;
        MinConfirmAt?: number;
        MaxSignupAt?: number;
        MinSignupAt?: number;
        SignupIp?: string;
        Source?: string;
        SourceID?: number;
    }
    type TListRecipientResponse = Common.IResponse<IListRecipient[]>;
    export type TPostContactManageContactsListsResponse = Common.IResponse<Array<{
        ContactsLists: BulkContactManagement.IContactList[];
    }>>;
    export type TPostContactsListManageContactResponse<TProperties = Common.TUnknownRec> = Common.IResponse<Array<IManageContacts<TProperties>>>;
    export type TPostListRecipientResponse = TListRecipientResponse;
    export type TPutListRecipientResponse = TListRecipientResponse;
    export type TGetListRecipientResponse = TListRecipientResponse;
    export type TGetContactGetContactsListsResponse = Common.IResponse<IContactsList[]>;
    export type TGetContactsListSignupResponse = Common.IResponse<IContactsListSignup[]>;
    export {};
}
export declare namespace ContactVerification {
    interface IVerificationSummary<TResult = Common.TUnknownRec, TRisk = Common.TUnknownRec> {
        result: TResult;
        risk: TRisk;
    }
    interface IContactsListVerification<TResult = Common.TUnknownRec, TRisk = Common.TUnknownRec> {
        Akid: number;
        ContactListID: number;
        Count: number;
        Error: string;
        ID: number;
        JobEnd: string;
        JobStart: string;
        Method: string;
        ResponseURL: string;
        Status: string;
        Summary: IVerificationSummary<TResult, TRisk>;
    }
    type TGetContactsListVerifyResponse<TResult = Common.TUnknownRec, TRisk = Common.TUnknownRec> = Common.IResponse<Array<IContactsListVerification<TResult, TRisk>>>;
}
