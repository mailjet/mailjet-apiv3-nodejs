import { Message } from '@mailjet/types/api/Message';
import { Common } from '@mailjet/types/api/Common';

export namespace MessageEvent {
  export interface IBounceStatistic {
    ID: number;
    BouncedAt: string;
    CampaignID: number;
    ContactID: number;
    IsBlocked: boolean;
    IsStatePermanent: boolean;
    StateID: Message.MessageState
  }

  export interface IClickStatistic {
    ID: number;
    ClickedAt: string;
    ClickedDelay: number;
    ContactID: number;
    MessageID: number;
    Url: string;
    UserAgentID: number;
  }

  export interface IOpenInformation {
    ArrivedAt: string;
    CampaignID: number;
    ContactID: number;
    MessageID: number;
    OpenedAt: string;
    UserAgentFull: string;
    UserAgentID: number;
  }

  // REQUEST PART
  export interface IGetBounceStatisticsQueryParams extends
    Partial<Common.ITimestampPeriod>,
    Partial<Common.IPagination>
  {
    CampaignID?: number;
    ContactsList?: number;
    EventFromTs?: string;
    EventToTs?: string;
    Period?: Common.Period;
  }

  export interface IGetClickStatisticsQueryParams extends
    Partial<Common.ITimestampPeriod>,
    Partial<Common.IPagination>
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

  export interface IGetOpenInformationQueryParams extends
    Partial<Common.ITimestampPeriod>,
    Partial<Common.IPagination>
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
  export type TGetBounceStatisticsResponse = Common.IResponse<IBounceStatistic[]>;

  export type TGetClickStatisticsResponse = Common.IResponse<IClickStatistic[]>;

  export type TGetOpenInformationResponse = Common.IResponse<IOpenInformation[]>;
}
