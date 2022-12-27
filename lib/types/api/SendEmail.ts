import { Common } from '@mailjet/types/api/Common';

export namespace SendEmailV3 {
  export type MjTemplateErrorDeliver = '0' | 'deliver'
  export type MjDeduplicateCampaign = 0 | 1;
  export type MjTrackOpen = 0 | 1 | 2;

  export interface Recipient {
    Email: string;
    Name?: string
    Vars?: string;
  }

  export interface Attachment {
    Filename: string;
    Content: string;
    'Content-type': string;
  }

  export type BodyMj = {
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
  }

  // REQUEST PART
  export type Body<
    Headers = Common.UnknownRec,
    Vars = Common.UnknownRec
    > = BodyMj & {
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
  }

  // RESPONSE PART
  export interface ResponseSent {
    Email: string;
    MessageID: number;
    MessageUUID: string;
  }

  export type Response = {
    Sent: ResponseSent[];
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

  export interface EmailAddressTo {
    Email: string;
    Name?: string;
  }

  export interface Attachment {
    Filename: string;
    ContentType: string;
    Base64Content: string;
  }

  export interface InlinedAttachment extends Attachment {
    ContentID?: string;
  }

  export interface Message<Headers = Common.UnknownRec, Variables = Common.UnknownRec> {
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

  export enum ResponseStatus {
    Success = 'success',
    Error = 'error',
  }

  export interface ResponseError {
    ErrorIdentifier: string;
    ErrorCode: string;
    StatusCode: number;
    ErrorMessage: string;
    ErrorRelatedTo: Array<string>;
  }

  export interface ResponseEmailAddressTo {
    Email: string;
    MessageUUID: string;
    MessageID: number;
    MessageHref: string;
  }

  // REQUEST PART
  export type Body<
    Headers = Common.UnknownRec,
    Variables = Common.UnknownRec,
    Globals = Common.UnknownRec,
    > = {
    Messages: Array<Message<Headers, Variables>>;
    SandboxMode?: boolean;
    AdvanceErrorHandling?: boolean;
    Globals?: Globals;
  }

  // RESPONSE PART
  export interface ResponseMessage {
    Status: ResponseStatus;
    Errors: ResponseError[];
    CustomID: string;
    To: ResponseEmailAddressTo[];
    Cc: ResponseEmailAddressTo[];
    Bcc: ResponseEmailAddressTo[];
  }

  export type Response = {
    Messages: ResponseMessage[];
  }
}
