import { SendMessage } from "./SendMessage";
import { Common } from "./Common";
export declare namespace SMSMessage {
    interface ISMS extends Omit<SendMessage.ISMS, 'Text'> {
    }
    interface ISMSExport {
        ID: number;
        URL: string;
        Status: SendMessage.ISendStatus;
        CreationTS: number;
        ExpirationTS: number;
    }
    interface IPostSMSExportBody extends Common.ITimestampPeriod {
    }
    interface IGetSMSQueryParams extends Partial<Common.ITimestampPeriod>, Partial<Pick<Common.IPagination, 'Limit' | 'Offset'>> {
        StatusCode?: Array<string>;
        To?: string;
        IDs?: string;
    }
    interface IGetSMSCountQueryParams extends Partial<Common.ITimestampPeriod> {
        StatusCode?: Array<string>;
        To?: string;
    }
    type TPostSMSExportResponse = ISMSExport;
    type TGetSMSExportResponse = ISMSExport;
    type TGetSMSResponse = {
        Data: ISMS[];
    };
    type TGetSMSCountResponse = {
        Count: number;
    };
}
