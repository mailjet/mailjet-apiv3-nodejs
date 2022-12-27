export declare namespace SendMessage {
    interface Cost {
        Value: number;
        Currency: string;
    }
    interface SendStatus {
        Code: number;
        Name: string;
        Description: string;
    }
    type Body = {
        From: string;
        To: string;
        Text: string;
    };
    type Response = {
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
