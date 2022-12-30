import { SendMessage } from './SendMessage';
import { Common } from './Common';

export namespace SMSMessage {
  export type SMS = {
    From: string;
    To: string;
    MessageID: string | number;
    SMSCount: number;
    CreationTS: number;
    SentTS: number;
    Cost: SendMessage.Cost;
    Status: SendMessage.SendStatus;
  }

  export type SMSExport = {
    ID: number;
    URL: string;
    Status: SendMessage.SendStatus;
    CreationTS: number;
    ExpirationTS: number;
  }

  // REQUEST PART
  export type PostSMSExportBody = Common.TimestampPeriod

  export type GetSMSQueryParams =
    Partial<Common.TimestampPeriod> &
    Partial<Pick<Common.Pagination, 'Limit' | 'Offset'>> &
  {
    StatusCode?: Array<string>;
    To?: string;
    IDs?: string;
  }

  export type GetSMSCountQueryParams =
    Partial<Common.TimestampPeriod> &
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
