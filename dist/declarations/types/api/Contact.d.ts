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
    export type PostContactBody = {
        Email: string;
        IsExcludedFromCampaigns?: boolean;
        Name?: string;
    };
    export type PutContactBody = Omit<PostContactBody, 'Email'>;
    export type GetContactQueryParams = Partial<Common.IPagination> & {
        Campaign?: number;
        ContactsList?: number;
        IsExcludedFromCampaigns?: boolean;
    };
    type ContactResponse = {
        Count: number;
        Total: number;
        Data: IContact[];
    };
    export type PostContactResponse = ContactResponse;
    export type PutContactResponse = ContactResponse;
    export type GetContactResponse = ContactResponse;
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
    export type PostContactListBody = {
        Name: string;
        IsDeleted?: boolean;
    };
    export type PutContactListBody = Partial<PostContactListBody>;
    export type GetContactListQueryParams = Partial<Common.IPagination> & {
        Address?: string;
        ExcludeID?: number;
        IsDeleted?: boolean;
        Name?: string;
    };
    type ContactListResponse = Common.TResponse<IContactList[]>;
    export type PostContactListResponse = ContactListResponse;
    export type PutContactListResponse = ContactListResponse;
    export type GetContactListResponse = ContactListResponse;
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
    export type ContactBody<TProperties = Common.TUnknownRec> = {
        Email: string;
        Name?: string;
        IsExcludedFromCampaigns?: boolean;
        Properties?: TProperties;
    };
    export type PostContactManageManyContactsBody<TProperties = Common.TUnknownRec> = {
        Contacts: Array<ContactBody<TProperties>>;
        ContactsLists?: IContactList[];
    };
    export type PostContactsListImportListBody = {
        Action: ImportListAction;
        ListID: number;
    };
    export type PostContactsListManageManyContactsBody<TProperties = Common.TUnknownRec> = {
        Action: ManageContactsAction;
        Contacts: Array<ContactBody<TProperties>>;
    };
    export type PostCSVImportBody = {
        ContactsListID: number;
        DataID: number;
        ErrTreshold?: number;
        ImportOptions?: string;
        Method?: ImportCSVMethod;
    };
    export type PutCSVImportBody = Partial<PostCSVImportBody> & {
        Status?: CSVImportStatus;
    };
    export type GetCSVImportQueryParams = Partial<Common.IPagination>;
    type JobResponse = Common.TResponse<IJob[]>;
    type CSVImportResponse = Common.TResponse<ICSVImport[]>;
    type ContactManageManyContactsResponse = Common.TResponse<IContactManageManyContacts[]>;
    export type PostContactManageManyContactsResponse = JobResponse;
    export type GetContactManageManyContactsResponse = ContactManageManyContactsResponse;
    export type PostContactsListImportListResponse = JobResponse;
    export type GetContactsListImportListResponse = Common.TResponse<IContactsListImportList[]>;
    export type PostContactsListManageManyContactsResponse = JobResponse;
    export type GetContactsListManageManyContactsResponse = ContactManageManyContactsResponse;
    export type PostCSVImportResponse = CSVImportResponse;
    export type PutCSVImportResponse = CSVImportResponse;
    export type GetCSVImportResponse = CSVImportResponse;
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
    export type PostContactMetaDataBody = {
        Name: string;
        Datatype?: DataType;
        NameSpace?: NameSpace;
    };
    export type PutContactMetaDataBody = {
        Name?: string;
        Datatype?: DataType;
    };
    export type GetContactMetaDataQueryParams = Partial<Common.IPagination> & {
        DataType?: DataType;
        Namespace?: NameSpace;
    };
    export type PutContactDataBody = {
        Data: IContactProperty[];
    };
    export type GetContactDataQueryParams = Partial<Common.IPagination> & {
        Campaign?: number;
        ContactEmail?: string;
        ContactsList?: number;
        Fields?: string;
        LastActivityAt?: string;
    };
    type ContactDataResponse = Common.TResponse<IContactData[]>;
    type ContactMetaDataResponse = Common.TResponse<IContactMetaData[]>;
    export type PostContactMetaDataResponse = ContactMetaDataResponse;
    export type PutContactMetaDataResponse = ContactMetaDataResponse;
    export type GetContactMetaDataResponse = ContactMetaDataResponse;
    export type PutContactDataResponse = ContactDataResponse;
    export type GetContactDataResponse = ContactDataResponse;
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
    export type PostContactManageContactsListsBody = {
        ContactsLists: BulkContactManagement.IContactList[];
    };
    export type PostContactsListManageContactBody<TProperties = Common.TUnknownRec> = {
        Email: string;
        Action: BulkContactManagement.ManageContactsAction;
        Name?: string;
        Properties?: TProperties;
    };
    export type IPostListRecipientBody = {
        IsUnsubscribed?: boolean;
        ContactID: number;
        ContactAlt?: string;
        ListID: number;
        ListAlt?: string;
    };
    export type PutListRecipientBody = {
        IsUnsubscribed?: boolean;
    };
    export type GetListRecipientQueryParams = Partial<Common.IPagination> & {
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
    };
    export type GetContactsListSignupQueryParams = Partial<Common.IPagination> & {
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
    };
    type ListRecipientResponse = Common.TResponse<IListRecipient[]>;
    export type PostContactManageContactsListsResponse = Common.TResponse<Array<{
        ContactsLists: BulkContactManagement.IContactList[];
    }>>;
    export type PostContactsListManageContactResponse<TProperties = Common.TUnknownRec> = Common.TResponse<Array<IManageContacts<TProperties>>>;
    export type PostListRecipientResponse = ListRecipientResponse;
    export type PutListRecipientResponse = ListRecipientResponse;
    export type GetListRecipientResponse = ListRecipientResponse;
    export type GetContactGetContactsListsResponse = Common.TResponse<IContactsList[]>;
    export type GetContactsListSignupResponse = Common.TResponse<IContactsListSignup[]>;
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
    type GetContactsListVerifyResponse<TResult = Common.TUnknownRec, TRisk = Common.TUnknownRec> = Common.TResponse<Array<IContactsListVerification<TResult, TRisk>>>;
}
