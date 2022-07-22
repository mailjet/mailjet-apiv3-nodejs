export namespace Common {
  export type TUnknownRec = Record<string, unknown>

  export interface IPagination {
    countOnly: boolean;

    Limit: number;
    Offset: number;
    Sort: string;
  }

  export interface ITimestampPeriod {
    FromTS: string | number;
    ToTS: string | number;
  }

  export interface IResponse<TEntity> {
    Count: number;
    Total: number;
    Data: TEntity;
  }

  export enum Period {
    Day = 'Day',
    Week = 'Week',
    Month = 'Month',
    Year = 'Year',
  }
}
