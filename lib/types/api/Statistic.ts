import { Common } from '@mailjet/types/api/Common';
import { Message } from '@mailjet/types/api/Message';

export namespace Statistic {
  export enum CampaignOverviewIDType {
    SentCampaign = 'Campaign',
    ABTesting = 'AX',
    Draft = 'NL'
  }

  export enum CampaignOverviewEditMode {
    Tool = 'tool',
    HTML = 'html',
    Tool2 = 'tool2',
    HTML2 = 'html2',
    MJML = 'mjml',
  }

  export enum CampaignOverviewEditType {
    Full = 'full',
    Unknown = 'unknown'
  }

  export enum CounterSource {
    Campaign = 'Campaign',
    APIKey = 'APIKey',
    List = 'List',
    Sender = 'Sender'
  }

  export enum CounterResolution {
    Highest = 'Highest',
    Hour = 'Hour',
    Day = 'Day',
    Lifetime = 'Lifetime'
  }

  export enum CounterTiming {
    Message = 'Message',
    Event = 'Event'
  }

  export enum EmailEvent {
    Open = 'open',
    Click = 'click'
  }

  export interface CampaignOverview {
    ClickedCount: number;
    DeliveredCount: number;
    EditMode: CampaignOverviewEditMode;
    EditType: CampaignOverviewEditType;
    ID: number;
    IDType: CampaignOverviewIDType;
    OpenedCount: number;
    ProcessedCount: number;
    SendTimeStart: number;
    Starred: boolean;
    Subject: string;
    Title: string;
  }

  export interface ContactStatistic {
    BlockedCount: number;
    BouncedCount: number;
    ClickedCount: number;
    ContactID: number;
    DeferredCount: number;
    DeliveredCount: number;
    HardbouncedCount: number;
    LastActivityAt: string;
    MarketingContacts: number;
    OpenedCount: number;
    ProcessedCount: number;
    QueuedCount: number;
    SoftbouncedCount: number;
    SpamComplaintCount: number;
    UnsubscribedCount: number;
    UserMarketingContacts: number;
    WorkFlowExitedCount: number;
  }

  export interface GEOStatistic {
    ClickedCount: number;
    OpenedCount: number;
    Country: string;
  }

  export interface ListRecipientStatistic<Data = Array<unknown>> {
    BlockedCount: number;
    BouncedCount: number;
    ClickedCount: number;
    Data: Data;
    DeferredCount: number;
    DeliveredCount: number;
    HardbouncedCount: number;
    LastActivityAt: string;
    ListRecipientID: number;
    OpenedCount: number;
    PreQueuedCount: number;
    ProcessedCount: number;
    QueuedCount: number;
    SoftbouncedCount: number;
    SpamComplaintCount: number;
    UnsubscribedCount: number;
    WorkFlowExitedCount: number;
  }

  export interface StatCounter {
    APIKeyID: number;
    EventClickDelay: number;
    EventClickedCount: number;
    EventOpenDelay: number;
    EventOpenedCount: number;
    EventSpamCount: number;
    EventUnsubscribedCount: number;
    EventWorkflowExitedCount: number;
    MessageBlockedCount: number;
    MessageClickedCount: number;
    MessageDeferredCount: number;
    MessageHardBouncedCount: number;
    MessageOpenedCount: number;
    MessageQueuedCount: number;
    MessageSentCount: number;
    MessageSoftBouncedCount: number;
    MessageSpamCount: number;
    MessageUnsubscribedCount: number;
    MessageWorkFlowExitedCount: number;
    SourceID: number;
    Timeslice: string;
    Total: number;
  }

  export interface LinkClickStatistic {
    ClickedEventsCount: number;
    ClickedMessagesCount: number;
    PositionIndex: number;
    URL: string;
  }

  export interface RecipientESPStatistic {
    AttemptedMessagesCount?: number;
    ClickedMessagesCount?: number;
    DeferredMessagesCount?: number;
    DeliveredMessagesCount?: number;
    HardBouncedMessagesCount?: number;
    ESPName?: string;
    OpenedMessagesCount?: number;
    SoftBouncedMessagesCount?: number;
    SpamReportsCount?: number;
    UnsubscribedMessagesCount?: number;
    OpenRate?: number;
    ClickThroughRate?: number;
    SoftBouncedRate?: number;
    HardBouncedRate?: number;
    UnsubscribedRate?: number;
    SpamReportsRate?: number;
    DeferredRate?: number;
  }

  export interface TopLinkClicked {
    ClickedCount: number;
    LinkId: number;
    Url: string;
  }

  export interface UserAgentStatistic {
    Count: number;
    DistinctCount: number;
    Platform: string;
    UserAgent: string;
  }

  // REQUEST PART
  export type GetCampaignOverviewQueryParams = Partial<Common.Pagination> & {
    All?: boolean;
    Archived?: boolean;
    Drafts?: boolean;
    ID?: number;
    IDType?: CampaignOverviewIDType;
    Programmed?: boolean;
    Sent?: boolean;
    Starred?: boolean;
    Subject?: string;
  }

  export type GetContactStatisticsQueryParams = Partial<Common.Pagination> & {
    Blocked?: boolean;
    Bounced?: boolean;
    Click?: boolean;
    Deferred?: boolean;
    Hardbounced?: boolean;
    LastActivityAt?: string;
    MaxLastActivityAt?: string;
    MinLastActivityAt?: string;
    Open?: boolean;
    Queued?: boolean;
    Sent?: boolean;
    Spam?: boolean;
    Softbounced?: boolean;
    Unsubscribed?: boolean;
  }

  export type GetGEOStatisticsQueryParams = Partial<Common.TimestampPeriod> &
    Partial<Common.Pagination> &
  {
    CampaignID?: number;
    ContactsList?: number;
    CustomCampaign?: string;
    From?: string;
    FromDomain?: string;
    FromID?: number;
    FromType?: Message.FromType;
    IsDeleted?: boolean;
    IsNewsletterTool?: boolean;
    IsStarred?: boolean;
    MessageStatus?: Message.MessageStatus;
    Period?: Common.Period;
  }

  export type GetListRecipientStatisticsQueryParams = Partial<Common.Pagination> & {
    Blocked?: boolean;
    Bounced?: boolean;
    Click?: boolean;
    Contact?: number;
    ContactsList?: number;
    IsExcludedFromCampaigns?: boolean;
    IsUnsubscribed?: boolean;
    LastActivityAt?: string;
    MaxLastActivityAt?: string;
    MinLastActivityAt?: string;
    MaxUnsubscribedAt?: string;
    MinUnsubscribedAt?: string;
    Open?: boolean;
    Queued?: boolean;
    Sent?: boolean;
    ShowExtraData?: boolean;
    Spam?: boolean;
    TimeZone?: string;
    Unsubscribed?: boolean;
  }

  export type GetStatCountersQueryParams = Partial<Common.TimestampPeriod> &
    Partial<Common.Pagination> &
  {
    CounterSource: CounterSource;
    CounterResolution: CounterResolution;
    CounterTiming: CounterTiming;
    SourceID?: number;
  }

  export type GetLinkClickStatisticsQueryParams = Partial<Common.Pagination> & {
    CampaignID: number;
  }

  export type GetRecipientESPStatisticsQueryParams = GetLinkClickStatisticsQueryParams &
  {
    ESP_Name?: number;
  }

  export type GetTopLinkClickedQueryParams = Partial<Common.TimestampPeriod> &
    Partial<Common.Pagination> &
  {
    ActualClicks?: boolean;
    CampaignID?: number;
    Contact?: number;
    ContactsList?: number;
    CustomCampaign?: string;
    From?: string;
    FromDomain?: string;
    FromID?: number;
    FromType?: Message.FromType;
    IsDeleted?: boolean;
    IsNewsletterTool?: boolean;
    IsStarred?: boolean;
    Message?: number;
    Period?: Common.Period;
  }

  export type GetUserAgentStatisticsQueryParams = Partial<Common.TimestampPeriod> &
    Partial<Common.Pagination> &
  {
    CampaignID?: number;
    ContactsList?: number;
    CustomCampaign?: string;
    Event?: EmailEvent;
    ExcludePlatform?: string;
    From?: string;
    FromDomain?: string;
    FromID?: number;
    FromType?: Message.FromType;
    IsDeleted?: boolean;
    IsNewsletterTool?: boolean;
    IsStarred?: boolean;
    Period?: Common.Period;
    Platform?: string;
  }

  // RESPONSE PART
  export type GetCampaignOverviewResponse = Common.Response<CampaignOverview[]>;

  export type GetContactStatisticsResponse = Common.Response<ContactStatistic[]>;

  export type GetGEOStatisticsResponse = Common.Response<GEOStatistic[]>;

  export type GetListRecipientStatisticsResponse<Data = Array<unknown>> =
    Common.Response<Array<ListRecipientStatistic<Data>>>;

  export type GetStatCountersResponse = Common.Response<StatCounter[]>;

  export type GetLinkClickStatisticsResponse = Common.Response<LinkClickStatistic[]>;

  export type GetRecipientESPStatisticsResponse = Common.Response<RecipientESPStatistic[]>;

  export type GetTopLinkClickedResponse = Common.Response<TopLinkClicked[]>;

  export type GetUserAgentStatisticsResponse = Common.Response<UserAgentStatistic[]>;
}
