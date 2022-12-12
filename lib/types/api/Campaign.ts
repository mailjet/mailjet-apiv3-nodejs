import { Common } from '@mailjet/types/api/Common';

export namespace DraftCampaign {
  export enum EditMode {
    Tool2 = 'tool2',
    HTML2 = 'html2',
    MJML = 'mjml'
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
    AXCancelled = 'AXCancelled',
    Deleted = 'Deleted',
    Archived = 'Archived',
    Draft = 'Draft',
    Programmed = 'Programmed',
    Sent = 'Sent',
    AXTested = 'AXTested',
    AXSelected = 'AXSelected'
  }

  export interface IRecipient {
    Email: string;
    Name?: string
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

  // REQUEST PART
  export type PostCampaignDraftBody<TAXTesting = Common.TUnknownRec> = {
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

  export type PutCampaignDraftBody<TAXTesting = Common.TUnknownRec> =
    Omit<Partial<PostCampaignDraftBody<TAXTesting>>, 'ContactsListAlt'> &
  {
    Status?: CampaignDraftStatus
  }

  export type GetCampaignDraftQueryParams = Partial<Common.IPagination> & {
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

  export type PostCampaignDraftDetailContentBody<THeaders = Common.TUnknownRec> =
    Partial<ICampaignDraftDetailContent<THeaders>>

  export type PostCampaignDraftScheduleBody = {
    Date: string;
  }

  export type PutCampaignDraftScheduleBody = Partial<PostCampaignDraftScheduleBody>

  export type PostCampaignDraftTestBody = {
    Recipients: IRecipient[]
  }

  // RESPONSE PART
  type CampaignDraftResponse = Common.TResponse<ICampaignDraft[]>;
  type CampaignDraftScheduleResponse = Common.TResponse<ICampaignDraftSchedule[]>;
  type CampaignDraftDetailContentResponse<THeaders = Common.TUnknownRec> =
    Common.TResponse<Array<ICampaignDraftDetailContent<THeaders>>>;
  type CampaignDraftStatusResponse =
    Common.TResponse<Array<{ Status: CampaignDraftSendingStatus }>>;

  export type PostCampaignDraftResponse = CampaignDraftResponse
  export type PutCampaignDraftResponse = CampaignDraftResponse
  export type GetCampaignDraftResponse = CampaignDraftResponse

  export type PostCampaignDraftScheduleResponse = CampaignDraftScheduleResponse
  export type PutCampaignDraftScheduleResponse = CampaignDraftScheduleResponse
  export type GetCampaignDraftScheduleResponse = CampaignDraftScheduleResponse

  export type PostCampaignDraftDetailContentResponse<THeaders = Common.TUnknownRec> =
    CampaignDraftDetailContentResponse<THeaders>
  export type GetCampaignDraftDetailContentResponse<THeaders = Common.TUnknownRec> =
    CampaignDraftDetailContentResponse<THeaders>

  export type PostCampaignDraftSend = CampaignDraftStatusResponse
  export type PostCampaignDraftTest = CampaignDraftStatusResponse
  export type GetCampaignDraftStatus = CampaignDraftStatusResponse
}

export namespace SentCampaign {
  export enum CampaignType {
    Transactional = 1,
    Marketing = 2,
    Unknown = 3,
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

  // REQUEST PART
  export type PutCampaignBody = {
    IsDeleted?: boolean;
    IsStarred?: boolean;
  }

  export type GetCampaignQueryParams = Partial<Common.ITimestampPeriod> &
    Partial<Common.IPagination> &
  {
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

  // RESPONSE PART
  type CampaignResponse = Common.TResponse<ICampaign[]>;

  export type PutCampaignResponse = CampaignResponse
  export type GetCampaignResponse = CampaignResponse
}
