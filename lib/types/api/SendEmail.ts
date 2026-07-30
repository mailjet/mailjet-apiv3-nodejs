import { Common } from './Common';

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

  // A batch request can contain a mix of successful and failed messages -
  // the presence of `Error` results here does not mean the whole request
  // failed, and `Success` does not mean every message in the batch was sent.
  // Inspect `ResponseMessage.Status` for each entry in `Response.Messages`.
  export enum ResponseStatus {
    Success = 'success',
    Error = 'error',
  }

  // Only present on messages whose `Status` is `Error`. `StatusCode` mirrors
  // an HTTP status (e.g. >=500 generally indicates a transient/server-side
  // failure that may be safe to retry, while 4xx generally indicates the
  // message itself is invalid and retrying it unmodified will fail again).
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
  } | {
    Messages: Array<Omit<Message<Headers, Variables>, 'From'> & { From?: string }>;
    SandboxMode?: boolean;
    AdvanceErrorHandling?: boolean;
    Globals: {
      From: EmailAddressTo;
      [key: string]: unknown;
    };
  }

  // RESPONSE PART
  // One entry per message submitted in `Body.Messages`, in the same order.
  // Batch sending is NOT atomic: each message is validated and processed
  // independently, so one message can fail (`Status: 'error'`) while the
  // others in the same request succeed. Always check `Status`/`Errors` per
  // message rather than relying on the request's HTTP status alone.
  export interface ResponseMessage {
    Status: ResponseStatus;
    Errors: ResponseError[];
    CustomID: string;
    To: ResponseEmailAddressTo[];
    Cc: ResponseEmailAddressTo[];
    Bcc: ResponseEmailAddressTo[];
  }

  // `Messages` can contain a mix of `'success'` and `'error'` entries - a
  // 200 response does not guarantee every message was sent, and a batch
  // containing failures does not mean the whole request was rejected.
  export type Response = {
    Messages: ResponseMessage[];
  }
}
