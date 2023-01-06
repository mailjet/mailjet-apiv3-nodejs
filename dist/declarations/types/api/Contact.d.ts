import { Common } from './Common';
export declare namespace Contact {
    export interface Contact {
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
    export type GetContactQueryParams = Partial<Common.Pagination> & {
        Campaign?: number;
        ContactsList?: number;
        IsExcludedFromCampaigns?: boolean;
    };
    type ContactResponse = {
        Count: number;
        Total: number;
        Data: Contact[];
    };
    export type PostContactResponse = ContactResponse;
    export type PutContactResponse = ContactResponse;
    export type GetContactResponse = ContactResponse;
    export {};
}
export declare namespace ContactList {
    export interface ContactList {
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
    export type GetContactListQueryParams = Partial<Common.Pagination> & {
        Address?: string;
        ExcludeID?: number;
        IsDeleted?: boolean;
        Name?: string;
    };
    type ContactListResponse = Common.Response<ContactList[]>;
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
    export interface Job {
        JobID: number;
    }
    export interface CSVImport {
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
    export interface ContactList {
        ListID: number;
        Action: ManageContactsAction;
    }
    export interface ContactManageManyContacts {
        ContactsLists: ContactList[];
        Count: number;
        Error: string;
        ErrorFile: string;
        JobEnd: string;
        JobStart: string;
        Status: JobStatus;
    }
    export interface ContactsListImportList {
        JobID: number;
        Action: ImportListAction;
        ListID: number;
    }
    export type ContactBody<Properties = Common.UnknownRec> = {
        Email: string;
        Name?: string;
        IsExcludedFromCampaigns?: boolean;
        Properties?: Properties;
    };
    export type PostContactManageManyContactsBody<Properties = Common.UnknownRec> = {
        Contacts: Array<ContactBody<Properties>>;
        ContactsLists?: ContactList[];
    };
    export type PostContactsListImportListBody = {
        Action: ImportListAction;
        ListID: number;
    };
    export type PostContactsListManageManyContactsBody<Properties = Common.UnknownRec> = {
        Action: ManageContactsAction;
        Contacts: Array<ContactBody<Properties>>;
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
    export type GetCSVImportQueryParams = Partial<Common.Pagination>;
    type JobResponse = Common.Response<Job[]>;
    type CSVImportResponse = Common.Response<CSVImport[]>;
    type ContactManageManyContactsResponse = Common.Response<ContactManageManyContacts[]>;
    export type PostContactManageManyContactsResponse = JobResponse;
    export type GetContactManageManyContactsResponse = ContactManageManyContactsResponse;
    export type PostContactsListImportListResponse = JobResponse;
    export type GetContactsListImportListResponse = Common.Response<ContactsListImportList[]>;
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
    export interface ContactProperty {
        Name: string;
        Value: string;
    }
    export interface ContactData {
        ID: number;
        ContactID: number;
        Data: ContactProperty[];
    }
    export interface ContactMetaData {
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
    export type GetContactMetaDataQueryParams = Partial<Common.Pagination> & {
        DataType?: DataType;
        Namespace?: NameSpace;
    };
    export type PutContactDataBody = {
        Data: ContactProperty[];
    };
    export type GetContactDataQueryParams = Partial<Common.Pagination> & {
        Campaign?: number;
        ContactEmail?: string;
        ContactsList?: number;
        Fields?: string;
        LastActivityAt?: string;
    };
    type ContactDataResponse = Common.Response<ContactData[]>;
    type ContactMetaDataResponse = Common.Response<ContactMetaData[]>;
    export type PostContactMetaDataResponse = ContactMetaDataResponse;
    export type PutContactMetaDataResponse = ContactMetaDataResponse;
    export type GetContactMetaDataResponse = ContactMetaDataResponse;
    export type PutContactDataResponse = ContactDataResponse;
    export type GetContactDataResponse = ContactDataResponse;
    export {};
}
export declare namespace ContactSubscription {
    export interface ManageContacts<Properties = Common.UnknownRec> {
        Email: string;
        Action: BulkContactManagement.ManageContactsAction;
        Name: string;
        Properties: Properties;
    }
    export interface ListRecipient {
        ID: number;
        IsUnsubscribed: boolean;
        ContactID: number;
        ListID: number;
        ListName: string;
        SubscribedAt: string;
        UnsubscribedAt: string;
    }
    export interface ContactsList {
        ListID: number;
        IsUnsub: boolean;
        SubscribedAt: string;
    }
    export interface ContactsListSignup {
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
        ContactsLists: BulkContactManagement.ContactList[];
    };
    export type PostContactsListManageContactBody<Properties = Common.UnknownRec> = {
        Email: string;
        Action: BulkContactManagement.ManageContactsAction;
        Name?: string;
        Properties?: Properties;
    };
    export type PostListRecipientBody = {
        IsUnsubscribed?: boolean;
        ContactID: number;
        ContactAlt?: string;
        ListID: number;
        ListAlt?: string;
    };
    export type PutListRecipientBody = {
        IsUnsubscribed?: boolean;
    };
    export type GetListRecipientQueryParams = Partial<Common.Pagination> & {
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
    export type GetContactsListSignupQueryParams = Partial<Common.Pagination> & {
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
    type ListRecipientResponse = Common.Response<ListRecipient[]>;
    export type PostContactManageContactsListsResponse = Common.Response<Array<{
        ContactsLists: BulkContactManagement.ContactList[];
    }>>;
    export type PostContactsListManageContactResponse<Properties = Common.UnknownRec> = Common.Response<Array<ManageContacts<Properties>>>;
    export type PostListRecipientResponse = ListRecipientResponse;
    export type PutListRecipientResponse = ListRecipientResponse;
    export type GetListRecipientResponse = ListRecipientResponse;
    export type GetContactGetContactsListsResponse = Common.Response<ContactsList[]>;
    export type GetContactsListSignupResponse = Common.Response<ContactsListSignup[]>;
    export {};
}
export declare namespace ContactVerification {
    interface VerificationSummary<Result = Common.UnknownRec, Risk = Common.UnknownRec> {
        result: Result;
        risk: Risk;
    }
    interface ContactsListVerification<Result = Common.UnknownRec, Risk = Common.UnknownRec> {
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
        Summary: VerificationSummary<Result, Risk>;
    }
    type GetContactsListVerifyResponse<Result = Common.UnknownRec, Risk = Common.UnknownRec> = Common.Response<Array<ContactsListVerification<Result, Risk>>>;
}
