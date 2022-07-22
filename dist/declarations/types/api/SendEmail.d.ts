import { Common } from "./Common";
export declare namespace SendEmailV3 {
    type TMjTemplateErrorDeliver = '0' | 'deliver';
    type TMjDeduplicateCampaign = 0 | 1;
    type TMjTrackOpen = 0 | 1 | 2;
    interface IRecipient {
        Email: string;
        Name?: string;
        Vars?: string;
    }
    interface IAttachment {
        Filename: string;
        Content: string;
        'Content-type': string;
    }
    interface IBodyMj {
        'Mj-TemplateID'?: number;
        'Mj-TemplateLanguage'?: boolean;
        'Mj-TemplateErrorReporting'?: string;
        'Mj-TemplateErrorDeliver'?: TMjTemplateErrorDeliver;
        'Mj-prio'?: number;
        'Mj-campaign'?: string;
        'Mj-deduplicatecampaign'?: TMjDeduplicateCampaign;
        'Mj-trackopen'?: TMjTrackOpen;
        'Mj-CustomID'?: string;
        'Mj-EventPayload'?: string;
    }
    interface IBody<THeaders = Common.TUnknownRec, TVars = Common.TUnknownRec> extends IBodyMj {
        FromEmail?: string;
        FromName?: string;
        Recipients?: IRecipient[];
        Sender?: boolean;
        Subject?: string;
        'Text-part'?: string;
        'Html-part'?: string;
        To?: string;
        Cc?: string;
        Bcc?: string;
        Attachments?: IAttachment[];
        Inline_attachments?: IAttachment[];
        Headers?: THeaders;
        Vars?: TVars;
    }
    interface IResponseSent {
        Email: string;
        MessageID: number;
        MessageUUID: string;
    }
    interface IResponse {
        Sent: IResponseSent[];
    }
}
export declare namespace SendEmailV3_1 {
    enum TrackOpens {
        AccountDefault = "account_default",
        Disabled = "disabled",
        Enabled = "enabled"
    }
    enum TrackClicks {
        AccountDefault = "account_default",
        Disabled = "disabled",
        Enabled = "enabled"
    }
    interface IEmailAddressTo {
        Email: string;
        Name?: string;
    }
    interface IAttachment {
        Filename: string;
        ContentType: string;
        Base64Content: string;
    }
    interface IInlinedAttachment extends IAttachment {
        ContentID?: string;
    }
    interface IMessage<THeaders = Common.TUnknownRec, TVariables = Common.TUnknownRec> {
        From: IEmailAddressTo;
        Sender?: IEmailAddressTo;
        To: IEmailAddressTo[];
        Cc?: IEmailAddressTo[];
        Bcc?: IEmailAddressTo[];
        ReplyTo?: IEmailAddressTo;
        Subject?: string;
        TextPart?: string;
        HTMLPart?: string;
        TemplateID?: number;
        TemplateLanguage?: boolean;
        TemplateErrorReporting?: IEmailAddressTo;
        TemplateErrorDeliver?: boolean;
        Attachments?: IAttachment[];
        InlinedAttachments?: IInlinedAttachment[];
        Priority?: number;
        CustomCampaign?: string;
        DeduplicateCampaign?: boolean;
        TrackOpens?: TrackOpens;
        TrackClicks?: TrackClicks;
        CustomID?: string;
        EventPayload?: string;
        URLTags?: string;
        Headers?: THeaders;
        Variables?: TVariables;
    }
    enum ResponseStatus {
        Success = "success",
        Error = "error"
    }
    interface IResponseError {
        ErrorIdentifier: string;
        ErrorCode: string;
        StatusCode: number;
        ErrorMessage: string;
        ErrorRelatedTo: Array<string>;
    }
    interface IResponseEmailAddressTo {
        Email: string;
        MessageUUID: string;
        MessageID: number;
        MessageHref: string;
    }
    interface IBody<THeaders = Common.TUnknownRec, TVariables = Common.TUnknownRec, TGlobals = Common.TUnknownRec> {
        Messages: Array<IMessage<THeaders, TVariables>>;
        SandboxMode?: boolean;
        AdvanceErrorHandling?: boolean;
        Globals?: TGlobals;
    }
    interface IResponseMessage {
        Status: ResponseStatus;
        Errors: IResponseError[];
        CustomID: string;
        To: IResponseEmailAddressTo[];
        Cc: IResponseEmailAddressTo[];
        Bcc: IResponseEmailAddressTo[];
    }
    interface IResponse {
        Messages: IResponseMessage[];
    }
}
