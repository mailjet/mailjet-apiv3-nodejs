export declare namespace TFunction {
    type Args<T> = T extends (...args: infer U) => unknown ? U : never;
    type Arg0<T> = T extends (arg1: infer U) => unknown ? U : never;
}
export declare namespace TObject {
    type TKeys<T> = Array<keyof T>;
    type TValues<TObj> = TObj extends Record<string, infer TKey> ? Array<TKey> : never;
    type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
    type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
    type MakeNil<T extends Record<string, unknown>, TObjKeys extends keyof T> = {
        [TKey in TObjKeys]?: T[TKey] | null;
    };
    type MakeNilAll<T extends Record<string, unknown>> = {
        [TKey in keyof T]?: T[TKey] | null;
    };
    type UnknownRec = Record<string, unknown>;
}
export declare namespace TArray {
    type TKeys<T extends Array<unknown>> = Array<Exclude<keyof T, keyof Array<unknown>>>;
    type TValues<T extends Array<unknown>> = Array<T[number]>;
    type SingleType<TValue> = TValue extends Array<infer TSingle> ? TSingle : TValue;
    type PossibleArray<TValue> = TValue | Array<TValue>;
    type Pair<T, K> = [T, K];
    type Pairs<T, K> = Pair<T, K>[];
}
