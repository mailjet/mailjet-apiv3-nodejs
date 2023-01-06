import { Common } from './Common';
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
    export interface Recipient {
        Email: string;
        Name?: string;
    }
    export interface CampaignDraft<AXTesting = Common.UnknownRec> {
        ID: number;
        AXFraction: number;
        AXFractionName: string;
        AXTesting: AXTesting;
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
    export interface CampaignDraftDetailContent<Headers = Common.UnknownRec> {
        Headers: Headers;
        'Html-part': string;
        'Text-part': string;
        MJMLContent: string;
    }
    export interface CampaignDraftSchedule {
        Date: string;
        Status: string;
    }
    export type PostCampaignDraftBody<AXTesting = Common.UnknownRec> = {
        Locale: string;
        Subject: string;
        AXFraction?: number;
        AXFractionName?: string;
        AXTesting?: AXTesting;
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
    };
    export type PutCampaignDraftBody<AXTesting = Common.UnknownRec> = Omit<Partial<PostCampaignDraftBody<AXTesting>>, 'ContactsListAlt'> & {
        Status?: CampaignDraftStatus;
    };
    export type GetCampaignDraftQueryParams = Partial<Common.Pagination> & {
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
    };
    export type PostCampaignDraftDetailContentBody<Headers = Common.UnknownRec> = Partial<CampaignDraftDetailContent<Headers>>;
    export type PostCampaignDraftScheduleBody = {
        Date: string;
    };
    export type PutCampaignDraftScheduleBody = Partial<PostCampaignDraftScheduleBody>;
    export type PostCampaignDraftTestBody = {
        Recipients: Recipient[];
    };
    type CampaignDraftResponse = Common.Response<CampaignDraft[]>;
    type CampaignDraftScheduleResponse = Common.Response<CampaignDraftSchedule[]>;
    type CampaignDraftDetailContentResponse<Headers = Common.UnknownRec> = Common.Response<Array<CampaignDraftDetailContent<Headers>>>;
    type CampaignDraftStatusResponse = Common.Response<Array<{
        Status: CampaignDraftSendingStatus;
    }>>;
    export type PostCampaignDraftResponse = CampaignDraftResponse;
    export type PutCampaignDraftResponse = CampaignDraftResponse;
    export type GetCampaignDraftResponse = CampaignDraftResponse;
    export type PostCampaignDraftScheduleResponse = CampaignDraftScheduleResponse;
    export type PutCampaignDraftScheduleResponse = CampaignDraftScheduleResponse;
    export type GetCampaignDraftScheduleResponse = CampaignDraftScheduleResponse;
    export type PostCampaignDraftDetailContentResponse<Headers = Common.UnknownRec> = CampaignDraftDetailContentResponse<Headers>;
    export type GetCampaignDraftDetailContentResponse<Headers = Common.UnknownRec> = CampaignDraftDetailContentResponse<Headers>;
    export type PostCampaignDraftSend = CampaignDraftStatusResponse;
    export type PostCampaignDraftTest = CampaignDraftStatusResponse;
    export type GetCampaignDraftStatus = CampaignDraftStatusResponse;
    export {};
}
export declare namespace SentCampaign {
    export enum CampaignType {
        Transactional = 1,
        Marketing = 2,
        Unknown = 3
    }
    export interface Campaign {
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
    export type PutCampaignBody = {
        IsDeleted?: boolean;
        IsStarred?: boolean;
    };
    export type GetCampaignQueryParams = Partial<Common.TimestampPeriod> & Partial<Common.Pagination> & {
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
    };
    type CampaignResponse = Common.Response<Campaign[]>;
    export type PutCampaignResponse = CampaignResponse;
    export type GetCampaignResponse = CampaignResponse;
    export {};
}
