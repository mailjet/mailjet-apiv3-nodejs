import { Common } from "./Common";
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
    export interface IHeaders {
        From: string;
        Subject: string;
        'Reply-to': string;
    }
    export interface ITemplate {
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
    export interface ITemplateDetailContent {
        Headers: IHeaders;
        'Html-part': string;
        'Text-part': string;
        MJMLContent: string;
    }
    export interface IPostTemplateBody extends Partial<Omit<ITemplate, 'Name' | 'ID' | 'OwnerId' | 'Previews' | 'CreatedAt' | 'LastUpdatedAt'>> {
        Name: string;
    }
    export interface IPutTemplateBody extends Partial<IPostTemplateBody> {
    }
    export interface IGetTemplateQueryParams extends Partial<Common.IPagination> {
        Categories?: string;
        CategoriesSelectionMethod?: CategoriesSelectionMethod;
        EditMode?: EditMode;
        Name?: string;
        OwnerType?: OwnerType;
        Purposes?: Purposes;
        PurposesSelectionMethod?: PurposesSelectionMethod;
    }
    export interface IPostTemplateDetailContentBody extends Partial<Omit<ITemplateDetailContent, 'Headers'>> {
        Headers?: Partial<IHeaders>;
    }
    export interface IPutTemplateDetailContentBody extends IPostTemplateDetailContentBody {
    }
    type TTemplateResponse = Common.IResponse<ITemplate[]>;
    type TTemplateDetailContentResponse = Common.IResponse<ITemplateDetailContent[]>;
    export type TPostTemplateResponse = TTemplateResponse;
    export type TPutTemplateResponse = TTemplateResponse;
    export type TGetTemplateResponse = TTemplateResponse;
    export type TPostTemplateDetailContentResponse = TTemplateDetailContentResponse;
    export type TPutTemplateDetailContentResponse = TTemplateDetailContentResponse;
    export type TGetTemplateDetailContentResponse = TTemplateDetailContentResponse;
    export {};
}
