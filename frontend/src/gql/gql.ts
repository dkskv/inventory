/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "query CurrentUserWithPrivileges {\n  currentUserWithPrivileges {\n    user {\n      id\n      username\n      accessRole\n    }\n    privileges {\n      name\n      permissions\n    }\n  }\n}": types.CurrentUserWithPrivilegesDocument,
    "mutation CreateAsset($name: String!) {\n  createAsset(name: $name)\n}\n\nmutation UpdateAsset($id: Int!, $name: String!) {\n  updateAsset(id: $id, name: $name)\n}\n\nmutation DeleteAsset($id: Int!) {\n  deleteAsset(id: $id)\n}\n\nquery Assets($paging: PagingInput!, $filtration: CatalogFiltrationInput) {\n  assets(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      name\n    }\n    totalCount\n  }\n}": types.CreateAssetDocument,
    "mutation CreateLocation($name: String!) {\n  createLocation(name: $name)\n}\n\nmutation UpdateLocation($id: Int!, $name: String!) {\n  updateLocation(id: $id, name: $name)\n}\n\nmutation DeleteLocation($id: Int!) {\n  deleteLocation(id: $id)\n}\n\nquery Locations($paging: PagingInput!, $filtration: CatalogFiltrationInput) {\n  locations(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      name\n    }\n    totalCount\n  }\n}": types.CreateLocationDocument,
    "mutation CreateResponsible($name: String!) {\n  createResponsible(name: $name)\n}\n\nmutation UpdateResponsible($id: Int!, $name: String!) {\n  updateResponsible(id: $id, name: $name)\n}\n\nmutation DeleteResponsible($id: Int!) {\n  deleteResponsible(id: $id)\n}\n\nquery Responsibles($paging: PagingInput!, $filtration: CatalogFiltrationInput) {\n  responsibles(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      name\n    }\n    totalCount\n  }\n}": types.CreateResponsibleDocument,
    "mutation CreateStatus($name: String!, $color: String!) {\n  createStatus(name: $name, color: $color)\n}\n\nmutation UpdateStatus($id: Int!, $name: String, $color: String) {\n  updateStatus(id: $id, name: $name, color: $color)\n}\n\nmutation DeleteStatus($id: Int!) {\n  deleteStatus(id: $id)\n}\n\nquery Statuses($paging: PagingInput!, $filtration: CatalogFiltrationInput) {\n  statuses(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      name\n      color\n    }\n    totalCount\n  }\n}": types.CreateStatusDocument,
    "query InventoryLogsOrGroups($paging: PagingInput!, $filtration: InventoryLogsFiltrationInput) {\n  inventoryLogsOrGroups(paging: $paging, filtration: $filtration) {\n    items {\n      ... on InventoryLogDto {\n        id\n        inventoryRecordId\n        asset {\n          id\n          name\n        }\n        serialNumbers\n        author {\n          id\n          username\n        }\n        timestamp\n        action\n        attribute\n        prevValue\n        nextValue\n      }\n      ... on InventoryLogsGroupDto {\n        count\n        asset {\n          id\n          name\n        }\n        serialNumbers\n        author {\n          id\n          username\n        }\n        timestamp\n        action\n        attribute\n        prevValue\n        nextValue\n      }\n    }\n    totalCount\n    usedLocations {\n      id\n      name\n    }\n    usedResponsibles {\n      id\n      name\n    }\n  }\n}\n\nquery InventoryLogs($paging: PagingInput!, $filtration: InventoryLogsFiltrationInput) {\n  inventoryLogs(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      inventoryRecordId\n      asset {\n        id\n        name\n      }\n      serialNumbers\n      author {\n        id\n        username\n      }\n      timestamp\n      action\n      attribute\n      prevValue\n      nextValue\n    }\n    totalCount\n    usedLocations {\n      id\n      name\n    }\n    usedResponsibles {\n      id\n      name\n    }\n  }\n}": types.InventoryLogsOrGroupsDocument,
    "query InventoryRecordsOrGroups($paging: PagingInput!, $filtration: InventoryRecordsFiltrationInput) {\n  inventoryRecordsOrGroups(paging: $paging, filtration: $filtration) {\n    items {\n      ... on InventoryRecordsGroupDto {\n        location {\n          id\n          name\n        }\n        asset {\n          id\n          name\n        }\n        responsible {\n          id\n          name\n        }\n        count\n      }\n      ... on InventoryRecordDto {\n        id\n        location {\n          id\n          name\n        }\n        asset {\n          id\n          name\n        }\n        responsible {\n          id\n          name\n        }\n        serialNumber\n        description\n        statuses {\n          id\n          name\n          color\n        }\n      }\n    }\n    totalCount\n  }\n}\n\nquery InventoryRecords($paging: PagingInput!, $filtration: InventoryRecordsFiltrationInput) {\n  inventoryRecords(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      location {\n        id\n        name\n      }\n      asset {\n        id\n        name\n      }\n      responsible {\n        id\n        name\n      }\n      serialNumber\n      description\n      statuses {\n        id\n        name\n        color\n      }\n    }\n    totalCount\n  }\n}\n\nquery InventoryRecordsDetailedGroups($filtration: InventoryRecordsFiltrationInput) {\n  inventoryRecordsDetailedGroups(filtration: $filtration) {\n    location {\n      name\n    }\n    asset {\n      name\n    }\n    responsible {\n      name\n    }\n    count\n    serialNumbers\n  }\n}\n\nquery InventoryRecordById($id: Int!) {\n  inventoryRecordById(id: $id) {\n    id\n    location {\n      id\n      name\n    }\n    asset {\n      id\n      name\n    }\n    responsible {\n      id\n      name\n    }\n  }\n}\n\nmutation CreateInventoryRecord($locationId: Int!, $responsibleId: Int!, $assetId: Int!, $serialNumber: String, $description: String, $statusesIds: [Int!]) {\n  createInventoryRecord(\n    locationId: $locationId\n    responsibleId: $responsibleId\n    assetId: $assetId\n    serialNumber: $serialNumber\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation CreateInventoryRecordsBatch($locationId: Int!, $responsibleId: Int!, $assetId: Int!, $count: Int!, $description: String, $statusesIds: [Int!]) {\n  createInventoryRecordsBatch(\n    locationId: $locationId\n    responsibleId: $responsibleId\n    assetId: $assetId\n    count: $count\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation UpdateInventoryRecord($id: Int!, $locationId: Int!, $responsibleId: Int!, $serialNumber: String, $description: String, $statusesIds: [Int!]) {\n  updateInventoryRecord(\n    id: $id\n    locationId: $locationId\n    responsibleId: $responsibleId\n    serialNumber: $serialNumber\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation UpdateInventoryRecordsBatch($ids: [Int!]!, $locationId: Int, $responsibleId: Int, $description: String, $statusesIds: [Int!]) {\n  updateInventoryRecordsBatch(\n    ids: $ids\n    locationId: $locationId\n    responsibleId: $responsibleId\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation UpdateInventoryRecordsByFiltration($filtration: InventoryRecordsFiltrationInput!, $locationId: Int!, $responsibleId: Int!, $description: String, $statusesIds: [Int!]) {\n  updateInventoryRecordsByFiltration(\n    filtration: $filtration\n    locationId: $locationId\n    responsibleId: $responsibleId\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation DeleteInventoryRecordsBatch($ids: [Int!]!) {\n  deleteInventoryRecordsBatch(ids: $ids)\n}\n\nmutation DeleteInventoryRecordsByFiltration($filtration: InventoryRecordsFiltrationInput!) {\n  deleteInventoryRecordsByFiltration(filtration: $filtration)\n}": types.InventoryRecordsOrGroupsDocument,
    "mutation SignIn($username: String!, $password: String!) {\n  signIn(username: $username, password: $password) {\n    accessToken\n    refreshToken\n  }\n}": types.SignInDocument,
    "mutation SignUp($username: String!, $password: String!) {\n  signUp(username: $username, password: $password)\n}\n\nmutation DeleteUser($id: Int!) {\n  deleteUser(id: $id)\n}\n\nmutation UpdatePassword($id: Int!, $password: String!) {\n  updatePassword(id: $id, password: $password)\n}\n\nquery Users($paging: PagingInput!, $filtration: UsersFiltrationInput) {\n  users(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      username\n      accessRole\n    }\n    totalCount\n  }\n}": types.SignUpDocument,
    "mutation RefreshTokens($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken) {\n    accessToken\n    refreshToken\n  }\n}": types.RefreshTokensDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CurrentUserWithPrivileges {\n  currentUserWithPrivileges {\n    user {\n      id\n      username\n      accessRole\n    }\n    privileges {\n      name\n      permissions\n    }\n  }\n}"): (typeof documents)["query CurrentUserWithPrivileges {\n  currentUserWithPrivileges {\n    user {\n      id\n      username\n      accessRole\n    }\n    privileges {\n      name\n      permissions\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateAsset($name: String!) {\n  createAsset(name: $name)\n}\n\nmutation UpdateAsset($id: Int!, $name: String!) {\n  updateAsset(id: $id, name: $name)\n}\n\nmutation DeleteAsset($id: Int!) {\n  deleteAsset(id: $id)\n}\n\nquery Assets($paging: PagingInput!, $filtration: CatalogFiltrationInput) {\n  assets(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      name\n    }\n    totalCount\n  }\n}"): (typeof documents)["mutation CreateAsset($name: String!) {\n  createAsset(name: $name)\n}\n\nmutation UpdateAsset($id: Int!, $name: String!) {\n  updateAsset(id: $id, name: $name)\n}\n\nmutation DeleteAsset($id: Int!) {\n  deleteAsset(id: $id)\n}\n\nquery Assets($paging: PagingInput!, $filtration: CatalogFiltrationInput) {\n  assets(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      name\n    }\n    totalCount\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateLocation($name: String!) {\n  createLocation(name: $name)\n}\n\nmutation UpdateLocation($id: Int!, $name: String!) {\n  updateLocation(id: $id, name: $name)\n}\n\nmutation DeleteLocation($id: Int!) {\n  deleteLocation(id: $id)\n}\n\nquery Locations($paging: PagingInput!, $filtration: CatalogFiltrationInput) {\n  locations(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      name\n    }\n    totalCount\n  }\n}"): (typeof documents)["mutation CreateLocation($name: String!) {\n  createLocation(name: $name)\n}\n\nmutation UpdateLocation($id: Int!, $name: String!) {\n  updateLocation(id: $id, name: $name)\n}\n\nmutation DeleteLocation($id: Int!) {\n  deleteLocation(id: $id)\n}\n\nquery Locations($paging: PagingInput!, $filtration: CatalogFiltrationInput) {\n  locations(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      name\n    }\n    totalCount\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateResponsible($name: String!) {\n  createResponsible(name: $name)\n}\n\nmutation UpdateResponsible($id: Int!, $name: String!) {\n  updateResponsible(id: $id, name: $name)\n}\n\nmutation DeleteResponsible($id: Int!) {\n  deleteResponsible(id: $id)\n}\n\nquery Responsibles($paging: PagingInput!, $filtration: CatalogFiltrationInput) {\n  responsibles(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      name\n    }\n    totalCount\n  }\n}"): (typeof documents)["mutation CreateResponsible($name: String!) {\n  createResponsible(name: $name)\n}\n\nmutation UpdateResponsible($id: Int!, $name: String!) {\n  updateResponsible(id: $id, name: $name)\n}\n\nmutation DeleteResponsible($id: Int!) {\n  deleteResponsible(id: $id)\n}\n\nquery Responsibles($paging: PagingInput!, $filtration: CatalogFiltrationInput) {\n  responsibles(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      name\n    }\n    totalCount\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateStatus($name: String!, $color: String!) {\n  createStatus(name: $name, color: $color)\n}\n\nmutation UpdateStatus($id: Int!, $name: String, $color: String) {\n  updateStatus(id: $id, name: $name, color: $color)\n}\n\nmutation DeleteStatus($id: Int!) {\n  deleteStatus(id: $id)\n}\n\nquery Statuses($paging: PagingInput!, $filtration: CatalogFiltrationInput) {\n  statuses(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      name\n      color\n    }\n    totalCount\n  }\n}"): (typeof documents)["mutation CreateStatus($name: String!, $color: String!) {\n  createStatus(name: $name, color: $color)\n}\n\nmutation UpdateStatus($id: Int!, $name: String, $color: String) {\n  updateStatus(id: $id, name: $name, color: $color)\n}\n\nmutation DeleteStatus($id: Int!) {\n  deleteStatus(id: $id)\n}\n\nquery Statuses($paging: PagingInput!, $filtration: CatalogFiltrationInput) {\n  statuses(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      name\n      color\n    }\n    totalCount\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query InventoryLogsOrGroups($paging: PagingInput!, $filtration: InventoryLogsFiltrationInput) {\n  inventoryLogsOrGroups(paging: $paging, filtration: $filtration) {\n    items {\n      ... on InventoryLogDto {\n        id\n        inventoryRecordId\n        asset {\n          id\n          name\n        }\n        serialNumbers\n        author {\n          id\n          username\n        }\n        timestamp\n        action\n        attribute\n        prevValue\n        nextValue\n      }\n      ... on InventoryLogsGroupDto {\n        count\n        asset {\n          id\n          name\n        }\n        serialNumbers\n        author {\n          id\n          username\n        }\n        timestamp\n        action\n        attribute\n        prevValue\n        nextValue\n      }\n    }\n    totalCount\n    usedLocations {\n      id\n      name\n    }\n    usedResponsibles {\n      id\n      name\n    }\n  }\n}\n\nquery InventoryLogs($paging: PagingInput!, $filtration: InventoryLogsFiltrationInput) {\n  inventoryLogs(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      inventoryRecordId\n      asset {\n        id\n        name\n      }\n      serialNumbers\n      author {\n        id\n        username\n      }\n      timestamp\n      action\n      attribute\n      prevValue\n      nextValue\n    }\n    totalCount\n    usedLocations {\n      id\n      name\n    }\n    usedResponsibles {\n      id\n      name\n    }\n  }\n}"): (typeof documents)["query InventoryLogsOrGroups($paging: PagingInput!, $filtration: InventoryLogsFiltrationInput) {\n  inventoryLogsOrGroups(paging: $paging, filtration: $filtration) {\n    items {\n      ... on InventoryLogDto {\n        id\n        inventoryRecordId\n        asset {\n          id\n          name\n        }\n        serialNumbers\n        author {\n          id\n          username\n        }\n        timestamp\n        action\n        attribute\n        prevValue\n        nextValue\n      }\n      ... on InventoryLogsGroupDto {\n        count\n        asset {\n          id\n          name\n        }\n        serialNumbers\n        author {\n          id\n          username\n        }\n        timestamp\n        action\n        attribute\n        prevValue\n        nextValue\n      }\n    }\n    totalCount\n    usedLocations {\n      id\n      name\n    }\n    usedResponsibles {\n      id\n      name\n    }\n  }\n}\n\nquery InventoryLogs($paging: PagingInput!, $filtration: InventoryLogsFiltrationInput) {\n  inventoryLogs(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      inventoryRecordId\n      asset {\n        id\n        name\n      }\n      serialNumbers\n      author {\n        id\n        username\n      }\n      timestamp\n      action\n      attribute\n      prevValue\n      nextValue\n    }\n    totalCount\n    usedLocations {\n      id\n      name\n    }\n    usedResponsibles {\n      id\n      name\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query InventoryRecordsOrGroups($paging: PagingInput!, $filtration: InventoryRecordsFiltrationInput) {\n  inventoryRecordsOrGroups(paging: $paging, filtration: $filtration) {\n    items {\n      ... on InventoryRecordsGroupDto {\n        location {\n          id\n          name\n        }\n        asset {\n          id\n          name\n        }\n        responsible {\n          id\n          name\n        }\n        count\n      }\n      ... on InventoryRecordDto {\n        id\n        location {\n          id\n          name\n        }\n        asset {\n          id\n          name\n        }\n        responsible {\n          id\n          name\n        }\n        serialNumber\n        description\n        statuses {\n          id\n          name\n          color\n        }\n      }\n    }\n    totalCount\n  }\n}\n\nquery InventoryRecords($paging: PagingInput!, $filtration: InventoryRecordsFiltrationInput) {\n  inventoryRecords(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      location {\n        id\n        name\n      }\n      asset {\n        id\n        name\n      }\n      responsible {\n        id\n        name\n      }\n      serialNumber\n      description\n      statuses {\n        id\n        name\n        color\n      }\n    }\n    totalCount\n  }\n}\n\nquery InventoryRecordsDetailedGroups($filtration: InventoryRecordsFiltrationInput) {\n  inventoryRecordsDetailedGroups(filtration: $filtration) {\n    location {\n      name\n    }\n    asset {\n      name\n    }\n    responsible {\n      name\n    }\n    count\n    serialNumbers\n  }\n}\n\nquery InventoryRecordById($id: Int!) {\n  inventoryRecordById(id: $id) {\n    id\n    location {\n      id\n      name\n    }\n    asset {\n      id\n      name\n    }\n    responsible {\n      id\n      name\n    }\n  }\n}\n\nmutation CreateInventoryRecord($locationId: Int!, $responsibleId: Int!, $assetId: Int!, $serialNumber: String, $description: String, $statusesIds: [Int!]) {\n  createInventoryRecord(\n    locationId: $locationId\n    responsibleId: $responsibleId\n    assetId: $assetId\n    serialNumber: $serialNumber\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation CreateInventoryRecordsBatch($locationId: Int!, $responsibleId: Int!, $assetId: Int!, $count: Int!, $description: String, $statusesIds: [Int!]) {\n  createInventoryRecordsBatch(\n    locationId: $locationId\n    responsibleId: $responsibleId\n    assetId: $assetId\n    count: $count\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation UpdateInventoryRecord($id: Int!, $locationId: Int!, $responsibleId: Int!, $serialNumber: String, $description: String, $statusesIds: [Int!]) {\n  updateInventoryRecord(\n    id: $id\n    locationId: $locationId\n    responsibleId: $responsibleId\n    serialNumber: $serialNumber\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation UpdateInventoryRecordsBatch($ids: [Int!]!, $locationId: Int, $responsibleId: Int, $description: String, $statusesIds: [Int!]) {\n  updateInventoryRecordsBatch(\n    ids: $ids\n    locationId: $locationId\n    responsibleId: $responsibleId\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation UpdateInventoryRecordsByFiltration($filtration: InventoryRecordsFiltrationInput!, $locationId: Int!, $responsibleId: Int!, $description: String, $statusesIds: [Int!]) {\n  updateInventoryRecordsByFiltration(\n    filtration: $filtration\n    locationId: $locationId\n    responsibleId: $responsibleId\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation DeleteInventoryRecordsBatch($ids: [Int!]!) {\n  deleteInventoryRecordsBatch(ids: $ids)\n}\n\nmutation DeleteInventoryRecordsByFiltration($filtration: InventoryRecordsFiltrationInput!) {\n  deleteInventoryRecordsByFiltration(filtration: $filtration)\n}"): (typeof documents)["query InventoryRecordsOrGroups($paging: PagingInput!, $filtration: InventoryRecordsFiltrationInput) {\n  inventoryRecordsOrGroups(paging: $paging, filtration: $filtration) {\n    items {\n      ... on InventoryRecordsGroupDto {\n        location {\n          id\n          name\n        }\n        asset {\n          id\n          name\n        }\n        responsible {\n          id\n          name\n        }\n        count\n      }\n      ... on InventoryRecordDto {\n        id\n        location {\n          id\n          name\n        }\n        asset {\n          id\n          name\n        }\n        responsible {\n          id\n          name\n        }\n        serialNumber\n        description\n        statuses {\n          id\n          name\n          color\n        }\n      }\n    }\n    totalCount\n  }\n}\n\nquery InventoryRecords($paging: PagingInput!, $filtration: InventoryRecordsFiltrationInput) {\n  inventoryRecords(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      location {\n        id\n        name\n      }\n      asset {\n        id\n        name\n      }\n      responsible {\n        id\n        name\n      }\n      serialNumber\n      description\n      statuses {\n        id\n        name\n        color\n      }\n    }\n    totalCount\n  }\n}\n\nquery InventoryRecordsDetailedGroups($filtration: InventoryRecordsFiltrationInput) {\n  inventoryRecordsDetailedGroups(filtration: $filtration) {\n    location {\n      name\n    }\n    asset {\n      name\n    }\n    responsible {\n      name\n    }\n    count\n    serialNumbers\n  }\n}\n\nquery InventoryRecordById($id: Int!) {\n  inventoryRecordById(id: $id) {\n    id\n    location {\n      id\n      name\n    }\n    asset {\n      id\n      name\n    }\n    responsible {\n      id\n      name\n    }\n  }\n}\n\nmutation CreateInventoryRecord($locationId: Int!, $responsibleId: Int!, $assetId: Int!, $serialNumber: String, $description: String, $statusesIds: [Int!]) {\n  createInventoryRecord(\n    locationId: $locationId\n    responsibleId: $responsibleId\n    assetId: $assetId\n    serialNumber: $serialNumber\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation CreateInventoryRecordsBatch($locationId: Int!, $responsibleId: Int!, $assetId: Int!, $count: Int!, $description: String, $statusesIds: [Int!]) {\n  createInventoryRecordsBatch(\n    locationId: $locationId\n    responsibleId: $responsibleId\n    assetId: $assetId\n    count: $count\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation UpdateInventoryRecord($id: Int!, $locationId: Int!, $responsibleId: Int!, $serialNumber: String, $description: String, $statusesIds: [Int!]) {\n  updateInventoryRecord(\n    id: $id\n    locationId: $locationId\n    responsibleId: $responsibleId\n    serialNumber: $serialNumber\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation UpdateInventoryRecordsBatch($ids: [Int!]!, $locationId: Int, $responsibleId: Int, $description: String, $statusesIds: [Int!]) {\n  updateInventoryRecordsBatch(\n    ids: $ids\n    locationId: $locationId\n    responsibleId: $responsibleId\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation UpdateInventoryRecordsByFiltration($filtration: InventoryRecordsFiltrationInput!, $locationId: Int!, $responsibleId: Int!, $description: String, $statusesIds: [Int!]) {\n  updateInventoryRecordsByFiltration(\n    filtration: $filtration\n    locationId: $locationId\n    responsibleId: $responsibleId\n    description: $description\n    statusesIds: $statusesIds\n  )\n}\n\nmutation DeleteInventoryRecordsBatch($ids: [Int!]!) {\n  deleteInventoryRecordsBatch(ids: $ids)\n}\n\nmutation DeleteInventoryRecordsByFiltration($filtration: InventoryRecordsFiltrationInput!) {\n  deleteInventoryRecordsByFiltration(filtration: $filtration)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SignIn($username: String!, $password: String!) {\n  signIn(username: $username, password: $password) {\n    accessToken\n    refreshToken\n  }\n}"): (typeof documents)["mutation SignIn($username: String!, $password: String!) {\n  signIn(username: $username, password: $password) {\n    accessToken\n    refreshToken\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SignUp($username: String!, $password: String!) {\n  signUp(username: $username, password: $password)\n}\n\nmutation DeleteUser($id: Int!) {\n  deleteUser(id: $id)\n}\n\nmutation UpdatePassword($id: Int!, $password: String!) {\n  updatePassword(id: $id, password: $password)\n}\n\nquery Users($paging: PagingInput!, $filtration: UsersFiltrationInput) {\n  users(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      username\n      accessRole\n    }\n    totalCount\n  }\n}"): (typeof documents)["mutation SignUp($username: String!, $password: String!) {\n  signUp(username: $username, password: $password)\n}\n\nmutation DeleteUser($id: Int!) {\n  deleteUser(id: $id)\n}\n\nmutation UpdatePassword($id: Int!, $password: String!) {\n  updatePassword(id: $id, password: $password)\n}\n\nquery Users($paging: PagingInput!, $filtration: UsersFiltrationInput) {\n  users(paging: $paging, filtration: $filtration) {\n    items {\n      id\n      username\n      accessRole\n    }\n    totalCount\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RefreshTokens($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken) {\n    accessToken\n    refreshToken\n  }\n}"): (typeof documents)["mutation RefreshTokens($refreshToken: String!) {\n  refresh(refreshToken: $refreshToken) {\n    accessToken\n    refreshToken\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;