import { SendMessage } from '@mailjet/types/api/SendMessage';
import { Common } from '@mailjet/types/api/Common';

export namespace SMSMessage {
  export interface ISMS extends Omit<SendMessage.ISMS, 'Text'> {}

  export interface ISMSExport {
    ID: number;
    URL: string;
    Status: SendMessage.ISendStatus;
    CreationTS: number;
    ExpirationTS: number;
  }

  // REQUEST PART
  export interface IPostSMSExportBody extends Common.ITimestampPeriod {}

  export interface IGetSMSQueryParams extends
    Partial<Common.ITimestampPeriod>,
    Partial<Pick<Common.IPagination, 'Limit' | 'Offset'>>
  {
    StatusCode?: Array<string>;
    To?: string;
    IDs?: string;
  }

  export interface IGetSMSCountQueryParams extends
    Partial<Common.ITimestampPeriod>
  {
    StatusCode?: Array<string>;
    To?: string;
  }

  // RESPONSE PART
  export type TPostSMSExportResponse = ISMSExport;
  export type TGetSMSExportResponse = ISMSExport;

  export type TGetSMSResponse = { Data: ISMS[] }
  export type TGetSMSCountResponse = { Count: number }
}
