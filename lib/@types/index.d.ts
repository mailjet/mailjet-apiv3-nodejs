declare module '@mailjet/types' {
    export namespace TFunction {
        export type Args<T> = T extends (...args: infer U) => any ? U : never;
        export type Arg0<T> = T extends (arg1: infer U) => any ? U : never;
    }

    export namespace TObject {
        export type TKeys<T> = Array<keyof T>;
        export type TValues<TObject> = TObject extends Record<string, infer TKey> ? Array<TKey> : never;

        export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
        export type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

        export type MakeNil<T extends Record, TKeys extends keyof T> = {
            [TKey in TKeys]?: T[TKey] | null;
        };
        export type MakeNilAll<T extends Record> = {
            [TKey in keyof T]?: T[TKey] | null;
        };
    }

    export namespace TArray {
        export type TKeys<T> = Array<Exclude<keyof T, keyof Array<any>>>;
        export type TValues<T> = Array<T[number]>;

        export type SingleType<TValue> = TValue extends Array<infer TSingle> ? TSingle : TValue;

        export type PossibleArray<TValue> = TValue | Array<TValue>;

        export type Pair<T, K> = [T, K];
        export type Pairs<T, K> = Pair<T, K>[];
    }
}
