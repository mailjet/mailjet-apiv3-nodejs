export namespace SendMessage {
  export interface Cost {
    Value: number;
    Currency: string;
  }

  export interface SendStatus {
    Code: number;
    Name: string;
    Description: string;
  }

  // REQUEST PART
  export type Body = {
    From: string;
    To: string;
    Text: string;
  }

  // RESPONSE PART
  export type Response = {
    From: string;
    To: string;
    Text: string;
    MessageID: string | number;
    SMSCount: number;
    CreationTS: number;
    SentTS: number;
    Cost: Cost;
    Status: SendStatus;
  };
}
