import { Common } from '@mailjet/types/api/Common';

export namespace APIKeyConfiguration {
  export enum RunLevel {
    Normal = 'Normal',
    SoftLock = 'Softlock',
    HardLock = 'Hardlock'
  }

  export interface IApiKey {
    ID: number;
    ACL: string;
    IsActive: boolean;
    APIKey: string;
    CreatedAt: string;
    IsMaster: boolean;
    Name: string;
    QuarantineValue: number;
    Runlevel: RunLevel;
    SecretKey: string;
    TrackHost: string;
    UserID: number;
  }

  // REQUEST PART
  export type PostApiKeyBody = {
    Name: string;
    ACL?: string;
    IsActive?: boolean;
  }

  export type PutApiKeyBody = Partial<PostApiKeyBody>

  export type GetApiKeyQueryParams = Partial<Common.IPagination> & {
    APIKey?: string;
    IsActive?: boolean;
    IsMaster?: boolean;
    Name?: string;
  }

  // RESPONSE PART
  type ApiKeyResponse = Common.TResponse<IApiKey[]>;

  export type PostApiKeyResponse = ApiKeyResponse
  export type PutApiKeyResponse = ApiKeyResponse
  export type GetApiKeyResponse =ApiKeyResponse
}

export namespace AccountSetting {
  export interface IMyProfile {
    ID: number;
    AddressCity: string;
    AddressCountry: string;
    AddressPostalCode: string;
    AddressState: string;
    AddressStreet: string;
    BillingEmail: string;
    BirthdayAt: string;
    CompanyName: string;
    CompanyNumOfEmployees: string;
    ContactPhone: string;
    EstimatedVolume: number;
    Features: string;
    Firstname: string;
    Industry: number;
    JobTitle: string;
    Lastname: string;
    VATNumber: string;
    Website: string;
    VAT: number;
    UserID: number;
  }

  export interface IUser {
    ID: number;
    ACL: string;
    Email: string;
    LastLoginAt: string;
    Locale: string;
    Timezone: string;
    CreatedAt: string;
    FirstIp: string;
    LastIp: string;
    MaxAllowedAPIKeys: number;
    Username: string;
    WarnedRatelimitAt: string;
  }

  // REQUEST PART
  export type PutMyProfileBody = Partial<Omit<IMyProfile, 'ID' | 'VAT' | 'UserID'>>

  export type PutUserBody =
    Partial<Omit<IUser, 'ID' | 'CreatedAt' | 'FirstIp' | 'MaxAllowedAPIKeys' | 'WarnedRatelimitAt'>>

  // RESPONSE PART
  type MyProfileResponse = Common.TResponse<IMyProfile[]>;
  type UserResponse = Common.TResponse<IUser[]>;

  export type PutMyProfileResponse = MyProfileResponse
  export type GetMyProfileResponse = MyProfileResponse

  export type PutUserResponse = UserResponse
  export type GetUserResponse = UserResponse
}
