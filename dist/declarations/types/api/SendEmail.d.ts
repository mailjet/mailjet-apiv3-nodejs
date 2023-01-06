import { Common } from './Common';
export declare namespace SendEmailV3 {
    type MjTemplateErrorDeliver = '0' | 'deliver';
    type MjDeduplicateCampaign = 0 | 1;
    type MjTrackOpen = 0 | 1 | 2;
    interface Recipient {
        Email: string;
        Name?: string;
        Vars?: string;
    }
    interface Attachment {
        Filename: string;
        Content: string;
        'Content-type': string;
    }
    type BodyMj = {
        'Mj-TemplateID'?: number;
        'Mj-TemplateLanguage'?: boolean;
        'Mj-TemplateErrorReporting'?: string;
        'Mj-TemplateErrorDeliver'?: MjTemplateErrorDeliver;
        'Mj-prio'?: number;
        'Mj-campaign'?: string;
        'Mj-deduplicatecampaign'?: MjDeduplicateCampaign;
        'Mj-trackopen'?: MjTrackOpen;
        'Mj-CustomID'?: string;
        'Mj-EventPayload'?: string;
    };
    type Body<Headers = Common.UnknownRec, Vars = Common.UnknownRec> = BodyMj & {
        FromEmail?: string;
        FromName?: string;
        Recipients?: Recipient[];
        Sender?: boolean;
        Subject?: string;
        'Text-part'?: string;
        'Html-part'?: string;
        To?: string;
        Cc?: string;
        Bcc?: string;
        Attachments?: Attachment[];
        Inline_attachments?: Attachment[];
        Headers?: Headers;
        Vars?: Vars;
    };
    interface ResponseSent {
        Email: string;
        MessageID: number;
        MessageUUID: string;
    }
    type Response = {
        Sent: ResponseSent[];
    };
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
    interface EmailAddressTo {
        Email: string;
        Name?: string;
    }
    interface Attachment {
        Filename: string;
        ContentType: string;
        Base64Content: string;
    }
    interface InlinedAttachment extends Attachment {
        ContentID?: string;
    }
    interface Message<Headers = Common.UnknownRec, Variables = Common.UnknownRec> {
        From: EmailAddressTo;
        Sender?: EmailAddressTo;
        To: EmailAddressTo[];
        Cc?: EmailAddressTo[];
        Bcc?: EmailAddressTo[];
        ReplyTo?: EmailAddressTo;
        Subject?: string;
        TextPart?: string;
        HTMLPart?: string;
        TemplateID?: number;
        TemplateLanguage?: boolean;
        TemplateErrorReporting?: EmailAddressTo;
        TemplateErrorDeliver?: boolean;
        Attachments?: Attachment[];
        InlinedAttachments?: InlinedAttachment[];
        Priority?: number;
        CustomCampaign?: string;
        DeduplicateCampaign?: boolean;
        TrackOpens?: TrackOpens;
        TrackClicks?: TrackClicks;
        CustomID?: string;
        EventPayload?: string;
        URLTags?: string;
        Headers?: Headers;
        Variables?: Variables;
    }
    enum ResponseStatus {
        Success = "success",
        Error = "error"
    }
    interface ResponseError {
        ErrorIdentifier: string;
        ErrorCode: string;
        StatusCode: number;
        ErrorMessage: string;
        ErrorRelatedTo: Array<string>;
    }
    interface ResponseEmailAddressTo {
        Email: string;
        MessageUUID: string;
        MessageID: number;
        MessageHref: string;
    }
    type Body<Headers = Common.UnknownRec, Variables = Common.UnknownRec, Globals = Common.UnknownRec> = {
        Messages: Array<Message<Headers, Variables>>;
        SandboxMode?: boolean;
        AdvanceErrorHandling?: boolean;
        Globals?: Globals;
    } | {
        Messages: Array<Omit<Message<Headers, Variables>, 'From'> & {
            From?: string;
        }>;
        SandboxMode?: boolean;
        AdvanceErrorHandling?: boolean;
        Globals: {
            From: EmailAddressTo;
            [key: string]: unknown;
        };
    };
    interface ResponseMessage {
        Status: ResponseStatus;
        Errors: ResponseError[];
        CustomID: string;
        To: ResponseEmailAddressTo[];
        Cc: ResponseEmailAddressTo[];
        Bcc: ResponseEmailAddressTo[];
    }
    type Response = {
        Messages: ResponseMessage[];
    };
}
