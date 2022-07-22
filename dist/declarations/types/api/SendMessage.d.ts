export declare namespace SendMessage {
    interface ICost {
        Value: number;
        Currency: string;
    }
    interface ISendStatus {
        Code: number;
        Name: string;
        Description: string;
    }
    interface ISMS {
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
    interface IBody {
        From: string;
        To: string;
        Text: string;
    }
    type TResponse = ISMS;
}
