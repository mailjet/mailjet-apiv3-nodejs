import { Message } from "./Message";
import { Common } from "./Common";
export declare namespace MessageEvent {
    interface IBounceStatistic {
        ID: number;
        BouncedAt: string;
        CampaignID: number;
        ContactID: number;
        IsBlocked: boolean;
        IsStatePermanent: boolean;
        StateID: Message.MessageState;
    }
    interface IClickStatistic {
        ID: number;
        ClickedAt: string;
        ClickedDelay: number;
        ContactID: number;
        MessageID: number;
        Url: string;
        UserAgentID: number;
    }
    interface IOpenInformation {
        ArrivedAt: string;
        CampaignID: number;
        ContactID: number;
        MessageID: number;
        OpenedAt: string;
        UserAgentFull: string;
        UserAgentID: number;
    }
    interface IGetBounceStatisticsQueryParams extends Partial<Common.ITimestampPeriod>, Partial<Common.IPagination> {
        CampaignID?: number;
        ContactsList?: number;
        EventFromTs?: string;
        EventToTs?: string;
        Period?: Common.Period;
    }
    interface IGetClickStatisticsQueryParams extends Partial<Common.ITimestampPeriod>, Partial<Common.IPagination> {
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
    }
    interface IGetOpenInformationQueryParams extends Partial<Common.ITimestampPeriod>, Partial<Common.IPagination> {
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
    }
    type TGetBounceStatisticsResponse = Common.IResponse<IBounceStatistic[]>;
    type TGetClickStatisticsResponse = Common.IResponse<IClickStatistic[]>;
    type TGetOpenInformationResponse = Common.IResponse<IOpenInformation[]>;
}
