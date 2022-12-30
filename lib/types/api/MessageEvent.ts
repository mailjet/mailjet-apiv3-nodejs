import { Message } from './Message';
import { Common } from './Common';

export namespace MessageEvent {
  export interface BounceStatistic {
    ID: number;
    BouncedAt: string;
    CampaignID: number;
    ContactID: number;
    IsBlocked: boolean;
    IsStatePermanent: boolean;
    StateID: Message.MessageState
  }

  export interface ClickStatistic {
    ID: number;
    ClickedAt: string;
    ClickedDelay: number;
    ContactID: number;
    MessageID: number;
    Url: string;
    UserAgentID: number;
  }

  export interface OpenInformation {
    ArrivedAt: string;
    CampaignID: number;
    ContactID: number;
    MessageID: number;
    OpenedAt: string;
    UserAgentFull: string;
    UserAgentID: number;
  }

  // REQUEST PART
  export type GetBounceStatisticsQueryParams = Partial<Common.TimestampPeriod> &
    Partial<Common.Pagination> &
  {
    CampaignID?: number;
    ContactsList?: number;
    EventFromTs?: string;
    EventToTs?: string;
    Period?: Common.Period;
  }

  export type GetClickStatisticsQueryParams = Partial<Common.TimestampPeriod> &
    Partial<Common.Pagination> &
  {
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

  export type GetOpenInformationQueryParams = Partial<Common.TimestampPeriod> &
    Partial<Common.Pagination> &
  {
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

  // RESPONSE PART
  export type GetBounceStatisticsResponse = Common.Response<BounceStatistic[]>;

  export type GetClickStatisticsResponse = Common.Response<ClickStatistic[]>;

  export type GetOpenInformationResponse = Common.Response<OpenInformation[]>;
}
