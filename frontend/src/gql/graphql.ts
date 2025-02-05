/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export enum AccessRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export enum Action {
  Create = 'CREATE',
  Update = 'UPDATE'
}

export type AssetDto = {
  __typename?: 'AssetDto';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type AssetPagedArrayDto = {
  __typename?: 'AssetPagedArrayDto';
  items: Array<AssetDto>;
  totalCount: Scalars['Int']['output'];
};

export type AuthTokensDto = {
  __typename?: 'AuthTokensDto';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type CatalogFiltrationInput = {
  searchText?: InputMaybe<Scalars['String']['input']>;
};

export enum InventoryAttribute {
  AssetId = 'assetId',
  Description = 'description',
  LocationId = 'locationId',
  ResponsibleId = 'responsibleId',
  SerialNumber = 'serialNumber'
}

export type InventoryLogDto = {
  __typename?: 'InventoryLogDto';
  action: Action;
  attribute?: Maybe<InventoryAttribute>;
  author?: Maybe<UserDto>;
  id: Scalars['Int']['output'];
  inventoryRecord: InventoryRecordDto;
  nextValue?: Maybe<Scalars['String']['output']>;
  prevValue?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTime']['output'];
};

export type InventoryLogOrGroupDto = InventoryLogDto | InventoryLogsGroupDto;

export type InventoryLogsFiltrationInput = {
  action?: InputMaybe<Action>;
  attribute?: InputMaybe<InventoryAttribute>;
  authorId?: InputMaybe<Scalars['Int']['input']>;
  inventoryRecordIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  nextValue?: InputMaybe<Scalars['String']['input']>;
  prevValue?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['DateTime']['input']>;
};

export type InventoryLogsGroupDto = {
  __typename?: 'InventoryLogsGroupDto';
  action: Action;
  attribute?: Maybe<InventoryAttribute>;
  author?: Maybe<UserDto>;
  count: Scalars['Int']['output'];
  nextValue?: Maybe<Scalars['String']['output']>;
  prevValue?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTime']['output'];
};

export type InventoryLogsOrGroupsPagedDto = {
  __typename?: 'InventoryLogsOrGroupsPagedDto';
  items: Array<InventoryLogOrGroupDto>;
  totalCount: Scalars['Int']['output'];
  usedLocations: Array<LocationDto>;
  usedResponsibles: Array<ResponsibleDto>;
};

export type InventoryLogsPagedDto = {
  __typename?: 'InventoryLogsPagedDto';
  items: Array<InventoryLogDto>;
  totalCount: Scalars['Int']['output'];
  usedLocations: Array<LocationDto>;
  usedResponsibles: Array<ResponsibleDto>;
};

export type InventoryRecordDto = {
  __typename?: 'InventoryRecordDto';
  asset: AssetDto;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  location: LocationDto;
  responsible: ResponsibleDto;
  serialNumber?: Maybe<Scalars['String']['output']>;
};

export type InventoryRecordOrGroupDto = InventoryRecordDto | InventoryRecordsGroupDto;

export type InventoryRecordsFiltrationInput = {
  assetIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  descriptionSearchText?: InputMaybe<Scalars['String']['input']>;
  locationIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  responsibleIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  serialNumberSearchText?: InputMaybe<Scalars['String']['input']>;
};

export type InventoryRecordsGroupDto = {
  __typename?: 'InventoryRecordsGroupDto';
  asset: AssetDto;
  count: Scalars['Int']['output'];
  location: LocationDto;
  responsible: ResponsibleDto;
};

export type InventoryRecordsOrGroupsPagedDto = {
  __typename?: 'InventoryRecordsOrGroupsPagedDto';
  items: Array<InventoryRecordOrGroupDto>;
  totalCount: Scalars['Int']['output'];
};

export type InventoryRecordsPagedDto = {
  __typename?: 'InventoryRecordsPagedDto';
  items: Array<InventoryRecordDto>;
  totalCount: Scalars['Int']['output'];
};

export type LocationDto = {
  __typename?: 'LocationDto';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type LocationPagedArrayDto = {
  __typename?: 'LocationPagedArrayDto';
  items: Array<LocationDto>;
  totalCount: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAsset: Scalars['Boolean']['output'];
  createInventoryRecord: Scalars['Boolean']['output'];
  createInventoryRecordsBatch: Scalars['Boolean']['output'];
  createLocation: Scalars['Boolean']['output'];
  createResponsible: Scalars['Boolean']['output'];
  deleteAsset: Scalars['Boolean']['output'];
  deleteInventoryRecordsBatch: Scalars['Boolean']['output'];
  deleteInventoryRecordsByFiltration: Scalars['Boolean']['output'];
  deleteLocation: Scalars['Boolean']['output'];
  deleteResponsible: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  refresh: AuthTokensDto;
  signIn: AuthTokensDto;
  signUp: Scalars['Boolean']['output'];
  updateAsset: Scalars['Boolean']['output'];
  updateInventoryRecord: Scalars['Boolean']['output'];
  updateInventoryRecordsBatch: Scalars['Boolean']['output'];
  updateInventoryRecordsByFiltration: Scalars['Boolean']['output'];
  updateLocation: Scalars['Boolean']['output'];
  updatePassword: Scalars['Boolean']['output'];
  updateResponsible: Scalars['Boolean']['output'];
};


export type MutationCreateAssetArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateInventoryRecordArgs = {
  assetId: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  locationId: Scalars['Int']['input'];
  responsibleId: Scalars['Int']['input'];
  serialNumber?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateInventoryRecordsBatchArgs = {
  assetId: Scalars['Int']['input'];
  count: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  locationId: Scalars['Int']['input'];
  responsibleId: Scalars['Int']['input'];
};


export type MutationCreateLocationArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateResponsibleArgs = {
  name: Scalars['String']['input'];
};


export type MutationDeleteAssetArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteInventoryRecordsBatchArgs = {
  ids: Array<Scalars['Int']['input']>;
};


export type MutationDeleteInventoryRecordsByFiltrationArgs = {
  filtration: InventoryRecordsFiltrationInput;
};


export type MutationDeleteLocationArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteResponsibleArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRefreshArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationSignInArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateAssetArgs = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdateInventoryRecordArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  locationId: Scalars['Int']['input'];
  responsibleId: Scalars['Int']['input'];
  serialNumber?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateInventoryRecordsBatchArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  ids: Array<Scalars['Int']['input']>;
  locationId?: InputMaybe<Scalars['Int']['input']>;
  responsibleId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateInventoryRecordsByFiltrationArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  filtration: InventoryRecordsFiltrationInput;
  locationId?: InputMaybe<Scalars['Int']['input']>;
  responsibleId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateLocationArgs = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdatePasswordArgs = {
  id: Scalars['Int']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateResponsibleArgs = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type PagingInput = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

export enum Privilege {
  Inventory = 'INVENTORY',
  Users = 'USERS'
}

export type PrivilegeAccessDto = {
  __typename?: 'PrivilegeAccessDto';
  name: Privilege;
  permissions: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  assets: AssetPagedArrayDto;
  currentUserWithPrivileges?: Maybe<UserWithPrivilegesDto>;
  inventoryLogs: InventoryLogsPagedDto;
  inventoryLogsOrGroups: InventoryLogsOrGroupsPagedDto;
  inventoryRecordById?: Maybe<InventoryRecordDto>;
  inventoryRecords: InventoryRecordsPagedDto;
  inventoryRecordsOrGroups: InventoryRecordsOrGroupsPagedDto;
  locations: LocationPagedArrayDto;
  responsibles: ResponsiblePagedArrayDto;
  users: UserPagedArrayDto;
};


export type QueryAssetsArgs = {
  filtration?: InputMaybe<CatalogFiltrationInput>;
  paging: PagingInput;
};


export type QueryInventoryLogsArgs = {
  filtration?: InputMaybe<InventoryLogsFiltrationInput>;
  paging: PagingInput;
};


export type QueryInventoryLogsOrGroupsArgs = {
  filtration?: InputMaybe<InventoryLogsFiltrationInput>;
  paging: PagingInput;
};


export type QueryInventoryRecordByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryInventoryRecordsArgs = {
  filtration?: InputMaybe<InventoryRecordsFiltrationInput>;
  paging: PagingInput;
};


export type QueryInventoryRecordsOrGroupsArgs = {
  filtration?: InputMaybe<InventoryRecordsFiltrationInput>;
  paging: PagingInput;
};


export type QueryLocationsArgs = {
  filtration?: InputMaybe<CatalogFiltrationInput>;
  paging: PagingInput;
};


export type QueryResponsiblesArgs = {
  filtration?: InputMaybe<CatalogFiltrationInput>;
  paging: PagingInput;
};


export type QueryUsersArgs = {
  filtration?: InputMaybe<UsersFiltrationInput>;
  paging: PagingInput;
};

export type ResponsibleDto = {
  __typename?: 'ResponsibleDto';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type ResponsiblePagedArrayDto = {
  __typename?: 'ResponsiblePagedArrayDto';
  items: Array<ResponsibleDto>;
  totalCount: Scalars['Int']['output'];
};

export type UserDto = {
  __typename?: 'UserDto';
  accessRole: AccessRole;
  id: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};

export type UserPagedArrayDto = {
  __typename?: 'UserPagedArrayDto';
  items: Array<UserDto>;
  totalCount: Scalars['Int']['output'];
};

export type UserWithPrivilegesDto = {
  __typename?: 'UserWithPrivilegesDto';
  privileges: Array<PrivilegeAccessDto>;
  user: UserDto;
};

export type UsersFiltrationInput = {
  searchText?: InputMaybe<Scalars['String']['input']>;
};

export type CurrentUserWithPrivilegesQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserWithPrivilegesQuery = { __typename?: 'Query', currentUserWithPrivileges?: { __typename?: 'UserWithPrivilegesDto', user: { __typename?: 'UserDto', id: number, username: string, accessRole: AccessRole }, privileges: Array<{ __typename?: 'PrivilegeAccessDto', name: Privilege, permissions: number }> } | null };

export type CreateAssetMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateAssetMutation = { __typename?: 'Mutation', createAsset: boolean };

export type UpdateAssetMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
}>;


export type UpdateAssetMutation = { __typename?: 'Mutation', updateAsset: boolean };

export type DeleteAssetMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteAssetMutation = { __typename?: 'Mutation', deleteAsset: boolean };

export type AssetsQueryVariables = Exact<{
  paging: PagingInput;
  filtration?: InputMaybe<CatalogFiltrationInput>;
}>;


export type AssetsQuery = { __typename?: 'Query', assets: { __typename?: 'AssetPagedArrayDto', totalCount: number, items: Array<{ __typename?: 'AssetDto', id: number, name: string }> } };

export type CreateLocationMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateLocationMutation = { __typename?: 'Mutation', createLocation: boolean };

export type UpdateLocationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
}>;


export type UpdateLocationMutation = { __typename?: 'Mutation', updateLocation: boolean };

export type DeleteLocationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteLocationMutation = { __typename?: 'Mutation', deleteLocation: boolean };

export type LocationsQueryVariables = Exact<{
  paging: PagingInput;
  filtration?: InputMaybe<CatalogFiltrationInput>;
}>;


export type LocationsQuery = { __typename?: 'Query', locations: { __typename?: 'LocationPagedArrayDto', totalCount: number, items: Array<{ __typename?: 'LocationDto', id: number, name: string }> } };

export type CreateResponsibleMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateResponsibleMutation = { __typename?: 'Mutation', createResponsible: boolean };

export type UpdateResponsibleMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
}>;


export type UpdateResponsibleMutation = { __typename?: 'Mutation', updateResponsible: boolean };

export type DeleteResponsibleMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteResponsibleMutation = { __typename?: 'Mutation', deleteResponsible: boolean };

export type ResponsiblesQueryVariables = Exact<{
  paging: PagingInput;
  filtration?: InputMaybe<CatalogFiltrationInput>;
}>;


export type ResponsiblesQuery = { __typename?: 'Query', responsibles: { __typename?: 'ResponsiblePagedArrayDto', totalCount: number, items: Array<{ __typename?: 'ResponsibleDto', id: number, name: string }> } };

export type InventoryLogsOrGroupsQueryVariables = Exact<{
  paging: PagingInput;
  filtration?: InputMaybe<InventoryLogsFiltrationInput>;
}>;


export type InventoryLogsOrGroupsQuery = { __typename?: 'Query', inventoryLogsOrGroups: { __typename?: 'InventoryLogsOrGroupsPagedDto', totalCount: number, items: Array<{ __typename?: 'InventoryLogDto', id: number, timestamp: any, action: Action, attribute?: InventoryAttribute | null, prevValue?: string | null, nextValue?: string | null, inventoryRecord: { __typename?: 'InventoryRecordDto', id: number }, author?: { __typename?: 'UserDto', id: number, username: string } | null } | { __typename?: 'InventoryLogsGroupDto', count: number, timestamp: any, action: Action, attribute?: InventoryAttribute | null, prevValue?: string | null, nextValue?: string | null, author?: { __typename?: 'UserDto', id: number, username: string } | null }>, usedLocations: Array<{ __typename?: 'LocationDto', id: number, name: string }>, usedResponsibles: Array<{ __typename?: 'ResponsibleDto', id: number, name: string }> } };

export type InventoryLogsQueryVariables = Exact<{
  paging: PagingInput;
  filtration?: InputMaybe<InventoryLogsFiltrationInput>;
}>;


export type InventoryLogsQuery = { __typename?: 'Query', inventoryLogs: { __typename?: 'InventoryLogsPagedDto', totalCount: number, items: Array<{ __typename?: 'InventoryLogDto', id: number, timestamp: any, action: Action, attribute?: InventoryAttribute | null, prevValue?: string | null, nextValue?: string | null, inventoryRecord: { __typename?: 'InventoryRecordDto', id: number }, author?: { __typename?: 'UserDto', id: number, username: string } | null }>, usedLocations: Array<{ __typename?: 'LocationDto', id: number, name: string }>, usedResponsibles: Array<{ __typename?: 'ResponsibleDto', id: number, name: string }> } };

export type InventoryRecordsOrGroupsQueryVariables = Exact<{
  paging: PagingInput;
  filtration?: InputMaybe<InventoryRecordsFiltrationInput>;
}>;


export type InventoryRecordsOrGroupsQuery = { __typename?: 'Query', inventoryRecordsOrGroups: { __typename?: 'InventoryRecordsOrGroupsPagedDto', totalCount: number, items: Array<{ __typename?: 'InventoryRecordDto', id: number, serialNumber?: string | null, description?: string | null, location: { __typename?: 'LocationDto', id: number, name: string }, asset: { __typename?: 'AssetDto', id: number, name: string }, responsible: { __typename?: 'ResponsibleDto', id: number, name: string } } | { __typename?: 'InventoryRecordsGroupDto', count: number, location: { __typename?: 'LocationDto', id: number, name: string }, asset: { __typename?: 'AssetDto', id: number, name: string }, responsible: { __typename?: 'ResponsibleDto', id: number, name: string } }> } };

export type InventoryRecordsQueryVariables = Exact<{
  paging: PagingInput;
  filtration?: InputMaybe<InventoryRecordsFiltrationInput>;
}>;


export type InventoryRecordsQuery = { __typename?: 'Query', inventoryRecords: { __typename?: 'InventoryRecordsPagedDto', totalCount: number, items: Array<{ __typename?: 'InventoryRecordDto', id: number, serialNumber?: string | null, description?: string | null, location: { __typename?: 'LocationDto', id: number, name: string }, asset: { __typename?: 'AssetDto', id: number, name: string }, responsible: { __typename?: 'ResponsibleDto', id: number, name: string } }> } };

export type InventoryRecordByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type InventoryRecordByIdQuery = { __typename?: 'Query', inventoryRecordById?: { __typename?: 'InventoryRecordDto', id: number, serialNumber?: string | null, location: { __typename?: 'LocationDto', id: number, name: string }, asset: { __typename?: 'AssetDto', id: number, name: string }, responsible: { __typename?: 'ResponsibleDto', id: number, name: string } } | null };

export type CreateInventoryRecordMutationVariables = Exact<{
  locationId: Scalars['Int']['input'];
  responsibleId: Scalars['Int']['input'];
  assetId: Scalars['Int']['input'];
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateInventoryRecordMutation = { __typename?: 'Mutation', createInventoryRecord: boolean };

export type CreateInventoryRecordsBatchMutationVariables = Exact<{
  locationId: Scalars['Int']['input'];
  responsibleId: Scalars['Int']['input'];
  assetId: Scalars['Int']['input'];
  count: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateInventoryRecordsBatchMutation = { __typename?: 'Mutation', createInventoryRecordsBatch: boolean };

export type UpdateInventoryRecordMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  locationId: Scalars['Int']['input'];
  responsibleId: Scalars['Int']['input'];
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateInventoryRecordMutation = { __typename?: 'Mutation', updateInventoryRecord: boolean };

export type UpdateInventoryRecordsBatchMutationVariables = Exact<{
  ids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
  locationId?: InputMaybe<Scalars['Int']['input']>;
  responsibleId?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateInventoryRecordsBatchMutation = { __typename?: 'Mutation', updateInventoryRecordsBatch: boolean };

export type UpdateInventoryRecordsByFiltrationMutationVariables = Exact<{
  filtration: InventoryRecordsFiltrationInput;
  locationId: Scalars['Int']['input'];
  responsibleId: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateInventoryRecordsByFiltrationMutation = { __typename?: 'Mutation', updateInventoryRecordsByFiltration: boolean };

export type DeleteInventoryRecordsBatchMutationVariables = Exact<{
  ids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type DeleteInventoryRecordsBatchMutation = { __typename?: 'Mutation', deleteInventoryRecordsBatch: boolean };

export type DeleteInventoryRecordsByFiltrationMutationVariables = Exact<{
  filtration: InventoryRecordsFiltrationInput;
}>;


export type DeleteInventoryRecordsByFiltrationMutation = { __typename?: 'Mutation', deleteInventoryRecordsByFiltration: boolean };

export type SignInMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'AuthTokensDto', accessToken: string, refreshToken: string } };

export type SignUpMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: boolean };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type UpdatePasswordMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  password: Scalars['String']['input'];
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', updatePassword: boolean };

export type UsersQueryVariables = Exact<{
  paging: PagingInput;
  filtration?: InputMaybe<UsersFiltrationInput>;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'UserPagedArrayDto', totalCount: number, items: Array<{ __typename?: 'UserDto', id: number, username: string, accessRole: AccessRole }> } };

export type RefreshTokensMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokensMutation = { __typename?: 'Mutation', refresh: { __typename?: 'AuthTokensDto', accessToken: string, refreshToken: string } };


export const CurrentUserWithPrivilegesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CurrentUserWithPrivileges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUserWithPrivileges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"accessRole"}}]}},{"kind":"Field","name":{"kind":"Name","value":"privileges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}}]}}]}}]}}]} as unknown as DocumentNode<CurrentUserWithPrivilegesQuery, CurrentUserWithPrivilegesQueryVariables>;
export const CreateAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<CreateAssetMutation, CreateAssetMutationVariables>;
export const UpdateAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<UpdateAssetMutation, UpdateAssetMutationVariables>;
export const DeleteAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteAssetMutation, DeleteAssetMutationVariables>;
export const AssetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Assets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paging"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PagingInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CatalogFiltrationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paging"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paging"}}},{"kind":"Argument","name":{"kind":"Name","value":"filtration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<AssetsQuery, AssetsQueryVariables>;
export const CreateLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<CreateLocationMutation, CreateLocationMutationVariables>;
export const UpdateLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<UpdateLocationMutation, UpdateLocationMutationVariables>;
export const DeleteLocationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLocation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLocation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteLocationMutation, DeleteLocationMutationVariables>;
export const LocationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Locations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paging"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PagingInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CatalogFiltrationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paging"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paging"}}},{"kind":"Argument","name":{"kind":"Name","value":"filtration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<LocationsQuery, LocationsQueryVariables>;
export const CreateResponsibleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateResponsible"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createResponsible"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<CreateResponsibleMutation, CreateResponsibleMutationVariables>;
export const UpdateResponsibleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateResponsible"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateResponsible"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<UpdateResponsibleMutation, UpdateResponsibleMutationVariables>;
export const DeleteResponsibleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteResponsible"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteResponsible"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteResponsibleMutation, DeleteResponsibleMutationVariables>;
export const ResponsiblesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Responsibles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paging"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PagingInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CatalogFiltrationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"responsibles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paging"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paging"}}},{"kind":"Argument","name":{"kind":"Name","value":"filtration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<ResponsiblesQuery, ResponsiblesQueryVariables>;
export const InventoryLogsOrGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InventoryLogsOrGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paging"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PagingInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryLogsFiltrationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inventoryLogsOrGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paging"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paging"}}},{"kind":"Argument","name":{"kind":"Name","value":"filtration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryLogDto"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inventoryRecord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"attribute"}},{"kind":"Field","name":{"kind":"Name","value":"prevValue"}},{"kind":"Field","name":{"kind":"Name","value":"nextValue"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryLogsGroupDto"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"attribute"}},{"kind":"Field","name":{"kind":"Name","value":"prevValue"}},{"kind":"Field","name":{"kind":"Name","value":"nextValue"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"usedLocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usedResponsibles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<InventoryLogsOrGroupsQuery, InventoryLogsOrGroupsQueryVariables>;
export const InventoryLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InventoryLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paging"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PagingInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryLogsFiltrationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inventoryLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paging"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paging"}}},{"kind":"Argument","name":{"kind":"Name","value":"filtration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inventoryRecord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"attribute"}},{"kind":"Field","name":{"kind":"Name","value":"prevValue"}},{"kind":"Field","name":{"kind":"Name","value":"nextValue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"usedLocations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"usedResponsibles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<InventoryLogsQuery, InventoryLogsQueryVariables>;
export const InventoryRecordsOrGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InventoryRecordsOrGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paging"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PagingInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryRecordsFiltrationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inventoryRecordsOrGroups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paging"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paging"}}},{"kind":"Argument","name":{"kind":"Name","value":"filtration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryRecordsGroupDto"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryRecordDto"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<InventoryRecordsOrGroupsQuery, InventoryRecordsOrGroupsQueryVariables>;
export const InventoryRecordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InventoryRecords"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paging"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PagingInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryRecordsFiltrationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inventoryRecords"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paging"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paging"}}},{"kind":"Argument","name":{"kind":"Name","value":"filtration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<InventoryRecordsQuery, InventoryRecordsQueryVariables>;
export const InventoryRecordByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"InventoryRecordById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inventoryRecordById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"responsible"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serialNumber"}}]}}]}}]} as unknown as DocumentNode<InventoryRecordByIdQuery, InventoryRecordByIdQueryVariables>;
export const CreateInventoryRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInventoryRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"responsibleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serialNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInventoryRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"responsibleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"responsibleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"assetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"serialNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serialNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}]}]}}]} as unknown as DocumentNode<CreateInventoryRecordMutation, CreateInventoryRecordMutationVariables>;
export const CreateInventoryRecordsBatchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInventoryRecordsBatch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"responsibleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInventoryRecordsBatch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"responsibleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"responsibleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"assetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}]}]}}]} as unknown as DocumentNode<CreateInventoryRecordsBatchMutation, CreateInventoryRecordsBatchMutationVariables>;
export const UpdateInventoryRecordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInventoryRecord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"responsibleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"serialNumber"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInventoryRecord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"responsibleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"responsibleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"serialNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"serialNumber"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}]}]}}]} as unknown as DocumentNode<UpdateInventoryRecordMutation, UpdateInventoryRecordMutationVariables>;
export const UpdateInventoryRecordsBatchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInventoryRecordsBatch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"responsibleId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInventoryRecordsBatch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}},{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"responsibleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"responsibleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}]}]}}]} as unknown as DocumentNode<UpdateInventoryRecordsBatchMutation, UpdateInventoryRecordsBatchMutationVariables>;
export const UpdateInventoryRecordsByFiltrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateInventoryRecordsByFiltration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryRecordsFiltrationInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"responsibleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInventoryRecordsByFiltration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filtration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}}},{"kind":"Argument","name":{"kind":"Name","value":"locationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"locationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"responsibleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"responsibleId"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}]}]}}]} as unknown as DocumentNode<UpdateInventoryRecordsByFiltrationMutation, UpdateInventoryRecordsByFiltrationMutationVariables>;
export const DeleteInventoryRecordsBatchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteInventoryRecordsBatch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInventoryRecordsBatch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<DeleteInventoryRecordsBatchMutation, DeleteInventoryRecordsBatchMutationVariables>;
export const DeleteInventoryRecordsByFiltrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteInventoryRecordsByFiltration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InventoryRecordsFiltrationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteInventoryRecordsByFiltration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filtration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}}}]}]}}]} as unknown as DocumentNode<DeleteInventoryRecordsByFiltrationMutation, DeleteInventoryRecordsByFiltrationMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const UpdatePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<UpdatePasswordMutation, UpdatePasswordMutationVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Users"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"paging"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PagingInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UsersFiltrationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"paging"},"value":{"kind":"Variable","name":{"kind":"Name","value":"paging"}}},{"kind":"Argument","name":{"kind":"Name","value":"filtration"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filtration"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"accessRole"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const RefreshTokensDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshTokens"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokensMutation, RefreshTokensMutationVariables>;