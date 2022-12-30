import { SendMessage } from './SendMessage';
import { Common } from './Common';
export declare namespace SMSMessage {
    type SMS = {
        From: string;
        To: string;
        MessageID: string | number;
        SMSCount: number;
        CreationTS: number;
        SentTS: number;
        Cost: SendMessage.Cost;
        Status: SendMessage.SendStatus;
    };
    type SMSExport = {
        ID: number;
        URL: string;
        Status: SendMessage.SendStatus;
        CreationTS: number;
        ExpirationTS: number;
    };
    type PostSMSExportBody = Common.TimestampPeriod;
    type GetSMSQueryParams = Partial<Common.TimestampPeriod> & Partial<Pick<Common.Pagination, 'Limit' | 'Offset'>> & {
        StatusCode?: Array<string>;
        To?: string;
        IDs?: string;
    };
    type GetSMSCountQueryParams = Partial<Common.TimestampPeriod> & {
        StatusCode?: Array<string>;
        To?: string;
    };
    type PostSMSExportResponse = SMSExport;
    type GetSMSExportResponse = SMSExport;
    type GetSMSResponse = {
        Data: SMS[];
    };
    type GetSMSCountResponse = {
        Count: number;
    };
}
