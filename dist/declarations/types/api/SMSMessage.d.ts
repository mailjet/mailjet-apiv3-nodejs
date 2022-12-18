import { SendMessage } from "./SendMessage";
import { Common } from "./Common";
export declare namespace SMSMessage {
    type SMS = {
        From: string;
        To: string;
        MessageID: string | number;
        SMSCount: number;
        CreationTS: number;
        SentTS: number;
        Cost: SendMessage.ICost;
        Status: SendMessage.ISendStatus;
    };
    type SMSExport = {
        ID: number;
        URL: string;
        Status: SendMessage.ISendStatus;
        CreationTS: number;
        ExpirationTS: number;
    };
    type PostSMSExportBody = Common.ITimestampPeriod;
    type GetSMSQueryParams = Partial<Common.ITimestampPeriod> & Partial<Pick<Common.IPagination, 'Limit' | 'Offset'>> & {
        StatusCode?: Array<string>;
        To?: string;
        IDs?: string;
    };
    type GetSMSCountQueryParams = Partial<Common.ITimestampPeriod> & {
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
