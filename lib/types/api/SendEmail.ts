import { Common } from '@mailjet/types/api/Common';

export namespace SendEmailV3 {
  export type TMjTemplateErrorDeliver = '0' | 'deliver'
  export type TMjDeduplicateCampaign = 0 | 1;
  export type TMjTrackOpen = 0 | 1 | 2;

  export interface IRecipient {
    Email: string;
    Name?: string
    Vars?: string;
  }

  export interface IAttachment {
    Filename: string;
    Content: string;
    'Content-type': string;
  }

  export interface IBodyMj {
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

  // REQUEST PART
  export interface IBody<
    THeaders = Common.TUnknownRec,
    TVars = Common.TUnknownRec
    > extends IBodyMj {
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

  // RESPONSE PART
  export interface IResponseSent {
    Email: string;
    MessageID: number;
    MessageUUID: string;
  }

  export interface IResponse {
    Sent: IResponseSent[];
  }
}

export namespace SendEmailV3_1 {
  export enum TrackOpens {
    AccountDefault = 'account_default',
    Disabled = 'disabled',
    Enabled = 'enabled',
  }

  export enum TrackClicks {
    AccountDefault = 'account_default',
    Disabled = 'disabled',
    Enabled = 'enabled',
  }

  export interface IEmailAddressTo {
    Email: string;
    Name?: string;
  }

  export interface IAttachment {
    Filename: string;
    ContentType: string;
    Base64Content: string;
  }

  export interface IInlinedAttachment extends IAttachment {
    ContentID?: string;
  }

  export interface IMessage<THeaders = Common.TUnknownRec, TVariables = Common.TUnknownRec> {
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

  export enum ResponseStatus {
    Success = 'success',
    Error = 'error',
  }

  export interface IResponseError {
    ErrorIdentifier: string;
    ErrorCode: string;
    StatusCode: number;
    ErrorMessage: string;
    ErrorRelatedTo: Array<string>;
  }

  export interface IResponseEmailAddressTo {
    Email: string;
    MessageUUID: string;
    MessageID: number;
    MessageHref: string;
  }

  // REQUEST PART
  export interface IBody<
    THeaders = Common.TUnknownRec,
    TVariables = Common.TUnknownRec,
    TGlobals = Common.TUnknownRec,
    > {
    Messages: Array<IMessage<THeaders, TVariables>>;
    SandboxMode?: boolean;
    AdvanceErrorHandling?: boolean;
    Globals?: TGlobals;
  }

  // RESPONSE PART
  export interface IResponseMessage {
    Status: ResponseStatus;
    Errors: IResponseError[];
    CustomID: string;
    To: IResponseEmailAddressTo[];
    Cc: IResponseEmailAddressTo[];
    Bcc: IResponseEmailAddressTo[];
  }

  export interface IResponse {
    Messages: IResponseMessage[];
  }
}
