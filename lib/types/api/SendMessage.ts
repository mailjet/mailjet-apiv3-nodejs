export namespace SendMessage {
  export interface ICost {
    Value: number;
    Currency: string;
  }

  export interface ISendStatus {
    Code: number;
    Name: string;
    Description: string;
  }

  export interface ISMS {
    From: string;
    To: string;
    Text: string;
    MessageID: string | number;
    SMSCount: number;
    CreationTS: number;
    SentTS: number;
    Cost: ICost;
    Status: ISendStatus;
  }

  // REQUEST PART
  export interface IBody {
    From: string;
    To: string;
    Text: string;
  }

  // RESPONSE PART
  export type TResponse = ISMS;
}
