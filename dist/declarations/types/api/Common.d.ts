export declare namespace Common {
    type UnknownRec = Record<string, unknown>;
    interface Pagination {
        countOnly: boolean;
        Limit: number;
        Offset: number;
        Sort: string;
    }
    interface TimestampPeriod {
        FromTS: string | number;
        ToTS: string | number;
    }
    type Response<Entity> = {
        Count: number;
        Total: number;
        Data: Entity;
    };
    enum Period {
        Day = "Day",
        Week = "Week",
        Month = "Month",
        Year = "Year"
    }
}
