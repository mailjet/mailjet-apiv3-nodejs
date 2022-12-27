export namespace Common {
  export type UnknownRec = Record<string, unknown>

  export interface Pagination {
    countOnly: boolean;

    Limit: number;
    Offset: number;
    Sort: string;
  }

  export interface TimestampPeriod {
    FromTS: string | number;
    ToTS: string | number;
  }

  export type Response<Entity> = {
    Count: number;
    Total: number;
    Data: Entity;
  }

  export enum Period {
    Day = 'Day',
    Week = 'Week',
    Month = 'Month',
    Year = 'Year',
  }
}
