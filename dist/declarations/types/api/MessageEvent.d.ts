import { Message } from './Message';
import { Common } from './Common';
export declare namespace MessageEvent {
    interface BounceStatistic {
        ID: number;
        BouncedAt: string;
        CampaignID: number;
        ContactID: number;
        IsBlocked: boolean;
        IsStatePermanent: boolean;
        StateID: Message.MessageState;
    }
    interface ClickStatistic {
        ID: number;
        ClickedAt: string;
        ClickedDelay: number;
        ContactID: number;
        MessageID: number;
        Url: string;
        UserAgentID: number;
    }
    interface OpenInformation {
        ArrivedAt: string;
        CampaignID: number;
        ContactID: number;
        MessageID: number;
        OpenedAt: string;
        UserAgentFull: string;
        UserAgentID: number;
    }
    type GetBounceStatisticsQueryParams = Partial<Common.TimestampPeriod> & Partial<Common.Pagination> & {
        CampaignID?: number;
        ContactsList?: number;
        EventFromTs?: string;
        EventToTs?: string;
        Period?: Common.Period;
    };
    type GetClickStatisticsQueryParams = Partial<Common.TimestampPeriod> & Partial<Common.Pagination> & {
        CampaignID?: number;
        ContactsList?: number;
        CustomCampaign?: string;
        EventFromTs?: string;
        EventToTs?: string;
        From?: string;
        FromDomain?: string;
        FromID?: number;
        FromType?: Message.FromType;
        IsDeleted?: boolean;
        IsNewsletterTool?: boolean;
        MessageID?: number;
        MessageStatus?: Message.MessageStatus;
        Period?: Common.Period;
    };
    type GetOpenInformationQueryParams = Partial<Common.TimestampPeriod> & Partial<Common.Pagination> & {
        CampaignID?: number;
        ContactsList?: number;
        CustomCampaign?: string;
        EventFromTs?: string;
        EventToTs?: string;
        From?: string;
        FromDomain?: string;
        FromID?: number;
        FromType?: Message.FromType;
        IsDeleted?: boolean;
        MessageStatus?: Message.MessageStatus;
        Period?: Common.Period;
    };
    type GetBounceStatisticsResponse = Common.Response<BounceStatistic[]>;
    type GetClickStatisticsResponse = Common.Response<ClickStatistic[]>;
    type GetOpenInformationResponse = Common.Response<OpenInformation[]>;
}
