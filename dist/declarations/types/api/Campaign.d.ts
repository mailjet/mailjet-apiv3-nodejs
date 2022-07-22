import { Common } from "./Common";
export declare namespace DraftCampaign {
    export enum EditMode {
        Tool2 = "tool2",
        HTML2 = "html2",
        MJML = "mjml"
    }
    export enum CampaignDraftStatus {
        AXCanceled = -3,
        Deleted = -2,
        Archived = -1,
        Draft = 0,
        Programmed = 1,
        Sent = 2,
        AXTested = 3,
        AXSelected = 4
    }
    export enum CampaignDraftSendingStatus {
        AXCancelled = "AXCancelled",
        Deleted = "Deleted",
        Archived = "Archived",
        Draft = "Draft",
        Programmed = "Programmed",
        Sent = "Sent",
        AXTested = "AXTested",
        AXSelected = "AXSelected"
    }
    export interface IRecipient {
        Email: string;
        Name?: string;
    }
    export interface ICampaignDraft<TAXTesting = Common.TUnknownRec> {
        ID: number;
        AXFraction: number;
        AXFractionName: string;
        AXTesting: TAXTesting;
        Current: number;
        EditMode: EditMode;
        IsStarred: boolean;
        IsTextPartIncluded: boolean;
        ReplyEmail: string;
        SenderName: string;
        TemplateID: number;
        Title: string;
        CampaignID: number;
        ContactsListID: number;
        CreatedAt: string;
        DeliveredAt: string;
        Locale: string;
        ModifiedAt: string;
        Preset: string;
        SegmentationID: number;
        Sender: string;
        SenderEmail: string;
        Status: CampaignDraftStatus;
        Subject: string;
        Url: string;
        Used: boolean;
    }
    export interface ICampaignDraftDetailContent<THeaders = Common.TUnknownRec> {
        Headers: THeaders;
        'Html-part': string;
        'Text-part': string;
        MJMLContent: string;
    }
    export interface ICampaignDraftSchedule {
        Date: string;
        Status: string;
    }
    export interface IPostCampaignDraftBody<TAXTesting = Common.TUnknownRec> {
        Locale: string;
        Subject: string;
        AXFraction?: number;
        AXFractionName?: string;
        AXTesting?: TAXTesting;
        Current?: number;
        EditMode?: EditMode;
        IsStarred?: boolean;
        IsTextPartIncluded?: boolean;
        ReplyEmail?: string;
        SenderName?: string;
        TemplateID?: number;
        Title?: string;
        ContactsListID?: number;
        ContactsListAlt?: string;
        SegmentationID?: number;
        SegmentationAlt?: string;
        Sender?: string;
        SenderEmail?: string;
    }
    export interface IPutCampaignDraftBody<TAXTesting = Common.TUnknownRec> extends Omit<Partial<IPostCampaignDraftBody<TAXTesting>>, 'ContactsListAlt'> {
        Status?: CampaignDraftStatus;
    }
    export interface IGetCampaignDraftQueryParams extends Partial<Common.IPagination> {
        AXTesting?: number;
        Campaign?: number;
        ContactsList?: number;
        DeliveredAt?: string;
        EditMode?: EditMode;
        IsArchived?: boolean;
        IsCampaign?: boolean;
        IsDeleted?: boolean;
        IsHandled?: boolean;
        IsStarred?: boolean;
        Modified?: boolean;
        NewsLetterTemplate?: number;
        Status?: CampaignDraftStatus;
        Subject?: string;
        Template?: number;
    }
    export interface IPostCampaignDraftDetailContentBody<THeaders = Common.TUnknownRec> extends Partial<ICampaignDraftDetailContent<THeaders>> {
    }
    export interface IPostCampaignDraftScheduleBody {
        Date: string;
    }
    export interface IPutCampaignDraftScheduleBody extends Partial<IPostCampaignDraftScheduleBody> {
    }
    export interface IPostCampaignDraftTestBody {
        Recipients: IRecipient[];
    }
    type TCampaignDraftResponse = Common.IResponse<ICampaignDraft[]>;
    type TCampaignDraftScheduleResponse = Common.IResponse<ICampaignDraftSchedule[]>;
    type TCampaignDraftDetailContentResponse<THeaders = Common.TUnknownRec> = Common.IResponse<Array<ICampaignDraftDetailContent<THeaders>>>;
    type TCampaignDraftStatusResponse = Common.IResponse<Array<{
        Status: CampaignDraftSendingStatus;
    }>>;
    export type TPostCampaignDraftResponse = TCampaignDraftResponse;
    export type TPutCampaignDraftResponse = TCampaignDraftResponse;
    export type TGetCampaignDraftResponse = TCampaignDraftResponse;
    export type TPostCampaignDraftScheduleResponse = TCampaignDraftScheduleResponse;
    export type TPutCampaignDraftScheduleResponse = TCampaignDraftScheduleResponse;
    export type TGetCampaignDraftScheduleResponse = TCampaignDraftScheduleResponse;
    export type TPostCampaignDraftDetailContentResponse<THeaders = Common.TUnknownRec> = TCampaignDraftDetailContentResponse<THeaders>;
    export type TGetCampaignDraftDetailContentResponse<THeaders = Common.TUnknownRec> = TCampaignDraftDetailContentResponse<THeaders>;
    export type TPostCampaignDraftSend = TCampaignDraftStatusResponse;
    export type TPostCampaignDraftTest = TCampaignDraftStatusResponse;
    export type TGetCampaignDraftStatus = TCampaignDraftStatusResponse;
    export {};
}
export declare namespace SentCampaign {
    export enum CampaignType {
        Transactional = 1,
        Marketing = 2,
        Unknown = 3
    }
    export interface ICampaign {
        ID: number;
        IsDeleted: boolean;
        IsStarred: boolean;
        CampaignType: CampaignType;
        CreatedAt: string;
        CustomValue: string;
        FirstMessageID: number;
        FromEmail: string;
        FromID: number;
        FromName: string;
        HasHtmlCount: number;
        HasTxtCount: number;
        ListID: number;
        NewsLetterID: number;
        SegmentationID: number;
        SendEndAt: string;
        SendStartAt: string;
        SpamassScore: number;
        Subject: string;
        WorkflowID: number;
    }
    export interface IPutCampaignBody {
        IsDeleted?: boolean;
        IsStarred?: boolean;
    }
    export interface IGetCampaignQueryParams extends Partial<Common.ITimestampPeriod>, Partial<Common.IPagination> {
        CampaignID?: number;
        ContactsListID?: number;
        CustomCampaign?: string;
        From?: string;
        FromDomain?: string;
        FromID?: number;
        FromType?: CampaignType;
        IsDeleted?: boolean;
        IsNewsletterTool?: boolean;
        IsStarred?: boolean;
        Period?: Common.Period;
        WorkflowID?: number;
    }
    type TCampaignResponse = Common.IResponse<ICampaign[]>;
    export type TPutCampaignResponse = TCampaignResponse;
    export type TGetCampaignResponse = TCampaignResponse;
    export {};
}
