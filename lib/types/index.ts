/* eslint-disable @typescript-eslint/no-namespace */

export namespace TFunction {
    export type Args<T> = T extends (...args: infer U) => unknown ? U : never;
    export type Arg0<T> = T extends (arg1: infer U) => unknown ? U : never;
}

export namespace TObject {
    export type TKeys<T> = Array<keyof T>;
    export type TValues<TObj> = TObj extends Record<string, infer TKey>
      ? Array<TKey>
      : never;

    export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
    export type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

    export type MakeNil<T extends Record<string, unknown>, TObjKeys extends keyof T> = {
        [TKey in TObjKeys]?: T[TKey] | null;
    };
    export type MakeNilAll<T extends Record<string, unknown>> = {
        [TKey in keyof T]?: T[TKey] | null;
    };

    export type TUnknownRec = Record<string, unknown>
}

export namespace TArray {
    export type TKeys<T extends Array<unknown>> = Array<Exclude<keyof T, keyof Array<unknown>>>;
    export type TValues<T extends Array<unknown>> = Array<T[number]>;

    export type SingleType<TValue> = TValue extends Array<infer TSingle> ? TSingle : TValue;

    export type PossibleArray<TValue> = TValue | Array<TValue>;

    export type Pair<T, K> = [T, K];
    export type Pairs<T, K> = Pair<T, K>[];
}
