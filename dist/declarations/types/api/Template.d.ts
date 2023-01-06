import { Common } from './Common';
export declare namespace Template {
    export enum Categories {
        Full = "full",
        Basic = "basic",
        NewsLetter = "newsletter",
        ECommerce = "e-commerce",
        Events = "events",
        Travel = "travel",
        Sports = "sports",
        Welcome = "welcome",
        ContactPropertyUpdate = "contact-property-update",
        Support = "support",
        Invoice = "invoice",
        Anniversary = "anniversary",
        Account = "account",
        Activation = "activation"
    }
    export enum CategoriesSelectionMethod {
        ContainsAny = "containsany",
        ContainsAll = "containsall",
        IsSubSet = "issubset"
    }
    export enum EditMode {
        DragAndDropBuilder = 1,
        HTMLBuilder = 2,
        SavedSectionBuilder = 3,
        MJMLBuilder = 4
    }
    export enum OwnerType {
        ApiKey = "apikey",
        User = "user",
        Global = "global"
    }
    export enum Purposes {
        Marketing = "marketing",
        Transactional = "transactional",
        Automation = "automation"
    }
    export enum PurposesSelectionMethod {
        ContainsAny = "containsany",
        ContainsAll = "containsall",
        IsSubSet = "issubset"
    }
    export interface Headers {
        From: string;
        Subject: string;
        'Reply-to': string;
    }
    export interface Template {
        Author: string;
        Categories: Categories;
        Copyright: string;
        Description: string;
        EditMode: EditMode;
        IsStarred: boolean;
        IsTextPartGenerationEnabled: boolean;
        Locale: string;
        Name: string;
        OwnerType: OwnerType;
        Presets: string;
        Purposes: Purposes;
        ID: number;
        OwnerId: number;
        Previews: string;
        CreatedAt: string;
        LastUpdatedAt: string;
    }
    export type TemplateDetailContent = {
        Headers: Headers;
        'Html-part': string;
        'Text-part': string;
        MJMLContent: string;
    };
    export type PostTemplateBody = Partial<Omit<Template, 'Name' | 'ID' | 'OwnerId' | 'Previews' | 'CreatedAt' | 'LastUpdatedAt'>> & {
        Name: string;
    };
    export type PutTemplateBody = Partial<PostTemplateBody>;
    export type GetTemplateQueryParams = Partial<Common.Pagination> & {
        Categories?: string;
        CategoriesSelectionMethod?: CategoriesSelectionMethod;
        EditMode?: EditMode;
        Name?: string;
        OwnerType?: OwnerType;
        Purposes?: Purposes;
        PurposesSelectionMethod?: PurposesSelectionMethod;
    };
    export type PostTemplateDetailContentBody = Partial<Omit<TemplateDetailContent, 'Headers'>> & {
        Headers?: Partial<Headers>;
    };
    export type PutTemplateDetailContentBody = PostTemplateDetailContentBody;
    type TemplateResponse = Common.Response<Template[]>;
    type TemplateDetailContentResponse = Common.Response<TemplateDetailContent[]>;
    export type PostTemplateResponse = TemplateResponse;
    export type PutTemplateResponse = TemplateResponse;
    export type GetTemplateResponse = TemplateResponse;
    export type PostTemplateDetailContentResponse = TemplateDetailContentResponse;
    export type PutTemplateDetailContentResponse = TemplateDetailContentResponse;
    export type GetTemplateDetailContentResponse = TemplateDetailContentResponse;
    export {};
}
