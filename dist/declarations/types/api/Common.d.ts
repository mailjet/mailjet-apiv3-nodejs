export declare namespace Common {
    type TUnknownRec = Record<string, unknown>;
    interface IPagination {
        countOnly: boolean;
        Limit: number;
        Offset: number;
        Sort: string;
    }
    interface ITimestampPeriod {
        FromTS: string | number;
        ToTS: string | number;
    }
    interface IResponse<TEntity> {
        Count: number;
        Total: number;
        Data: TEntity;
    }
    enum Period {
        Day = "Day",
        Week = "Week",
        Month = "Month",
        Year = "Year"
    }
}
