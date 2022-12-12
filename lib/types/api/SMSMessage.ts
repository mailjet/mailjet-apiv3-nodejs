import { SendMessage } from '@mailjet/types/api/SendMessage';
import { Common } from '@mailjet/types/api/Common';

export namespace SMSMessage {
  export type SMS = {
    From: string;
    To: string;
    MessageID: string | number;
    SMSCount: number;
    CreationTS: number;
    SentTS: number;
    Cost: SendMessage.ICost;
    Status: SendMessage.ISendStatus;
  }

  export type SMSExport = {
    ID: number;
    URL: string;
    Status: SendMessage.ISendStatus;
    CreationTS: number;
    ExpirationTS: number;
  }

  // REQUEST PART
  export type PostSMSExportBody = Common.ITimestampPeriod

  export type GetSMSQueryParams =
    Partial<Common.ITimestampPeriod> &
    Partial<Pick<Common.IPagination, 'Limit' | 'Offset'>> &
  {
    StatusCode?: Array<string>;
    To?: string;
    IDs?: string;
  }

  export type GetSMSCountQueryParams =
    Partial<Common.ITimestampPeriod> &
  {
    StatusCode?: Array<string>;
    To?: string;
  }

  // RESPONSE PART
  export type PostSMSExportResponse = SMSExport;
  export type GetSMSExportResponse = SMSExport;

  export type GetSMSResponse = { Data: SMS[] }
  export type GetSMSCountResponse = { Count: number }
}
