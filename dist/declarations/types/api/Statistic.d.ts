import { Common } from "./Common";
import { Message } from "./Message";
export declare namespace Statistic {
    enum CampaignOverViewIDType {
        SentCampaign = "Campaign",
        ABTesting = "AX",
        Draft = "NL"
    }
    enum CampaignOverViewEditMode {
        Tool = "tool",
        HTML = "html",
        Tool2 = "tool2",
        HTML2 = "html2",
        MJML = "mjml"
    }
    enum CampaignOverViewEditType {
        Full = "full",
        Unknown = "unknown"
    }
    enum CounterSource {
        Campaign = "Campaign",
        APIKey = "APIKey",
        List = "List",
        Sender = "Sender"
    }
    enum CounterResolution {
        Highest = "Highest",
        Hour = "Hour",
        Day = "Day",
        Lifetime = "Lifetime"
    }
    enum CounterTiming {
        Message = "Message",
        Event = "Event"
    }
    enum EmailEvent {
        Open = "open",
        Click = "click"
    }
    interface ICampaignOverView {
        ClickedCount: number;
        DeliveredCount: number;
        EditMode: CampaignOverViewEditMode;
        EditType: CampaignOverViewEditType;
        ID: number;
        IDType: CampaignOverViewIDType;
        OpenedCount: number;
        ProcessedCount: number;
        SendTimeStart: number;
        Starred: boolean;
        Subject: string;
        Title: string;
    }
    interface IContactStatistic {
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
    interface IGEOStatistic {
        ClickedCount: number;
        OpenedCount: number;
        Country: string;
    }
    interface IListRecipientStatistic<TData = Array<unknown>> {
        BlockedCount: number;
        BouncedCount: number;
        ClickedCount: number;
        Data: TData;
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
    interface IStatCounter {
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
    interface ILinkClickStatistic {
        ClickedEventsCount: number;
        ClickedMessagesCount: number;
        PositionIndex: number;
        URL: string;
    }
    interface IRecipientESPStatistic {
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
    interface ITopLinkClicked {
        ClickedCount: number;
        LinkId: number;
        Url: string;
    }
    interface IUserAgentStatistic {
        Count: number;
        DistinctCount: number;
        Platform: string;
        UserAgent: string;
    }
    interface IGetCampaignOverViewQueryParams extends Partial<Common.IPagination> {
        All?: boolean;
        Archived?: boolean;
        Drafts?: boolean;
        ID?: number;
        IDType?: CampaignOverViewIDType;
        Programmed?: boolean;
        Sent?: boolean;
        Starred?: boolean;
        Subject?: string;
    }
    interface IGetContactStatisticsQueryParams extends Partial<Common.IPagination> {
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
    interface IGetGEOStatisticsQueryParams extends Partial<Common.ITimestampPeriod>, Partial<Common.IPagination> {
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
    interface IGetListRecipientStatisticsQueryParams extends Partial<Common.IPagination> {
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
    interface IGetStatCountersQueryParams extends Partial<Common.ITimestampPeriod>, Partial<Common.IPagination> {
        CounterSource: CounterSource;
        CounterResolution: CounterResolution;
        CounterTiming: CounterTiming;
        SourceID?: number;
    }
    interface IGetLinkClickStatisticsQueryParams extends Partial<Common.IPagination> {
        CampaignID: number;
    }
    interface IGetRecipientESPStatisticsQueryParams extends IGetLinkClickStatisticsQueryParams {
        ESP_Name?: number;
    }
    interface IGetTopLinkClickedQueryParams extends Partial<Common.ITimestampPeriod>, Partial<Common.IPagination> {
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
    interface IGetUserAgentStatisticsQueryParams extends Partial<Common.ITimestampPeriod>, Partial<Common.IPagination> {
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
    type TGetCampaignOverViewResponse = Common.IResponse<ICampaignOverView[]>;
    type TGetContactStatisticsResponse = Common.IResponse<IContactStatistic[]>;
    type TGetGEOStatisticsResponse = Common.IResponse<IGEOStatistic[]>;
    type TGetListRecipientStatisticsResponse<TData = Array<unknown>> = Common.IResponse<Array<IListRecipientStatistic<TData>>>;
    type TGetStatCountersResponse = Common.IResponse<IStatCounter[]>;
    type TGetLinkClickStatisticsResponse = Common.IResponse<ILinkClickStatistic[]>;
    type TGetRecipientESPStatisticsResponse = Common.IResponse<IRecipientESPStatistic[]>;
    type TGetTopLinkClickedResponse = Common.IResponse<ITopLinkClicked[]>;
    type TGetUserAgentStatisticsResponse = Common.IResponse<IUserAgentStatistic[]>;
}
