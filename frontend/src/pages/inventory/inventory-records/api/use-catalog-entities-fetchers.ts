import {
  AssetDto,
  AssetsDocument,
  LocationDto,
  LocationsDocument,
  PagingInput,
  ResponsibleDto,
  ResponsiblesDocument,
  StatusDto,
  StatusesDocument,
} from "@/gql/graphql";
import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";

const paging: PagingInput = { limit: 50, offset: 0 };

export interface CatalogEntitiesFetchers {
  fetchAssets(searchText: string): Promise<AssetDto[]>;
  fetchLocations(searchText: string): Promise<LocationDto[]>;
  fetchResponsibles(searchText: string): Promise<ResponsibleDto[]>;
  fetchStatuses(searchText: string): Promise<StatusDto[]>;
}

export const useCatalogEntitiesFetchers = () => {
  const [executeAssetsQuery] = useLazyQuery(AssetsDocument, {
    fetchPolicy: "network-only",
  });
  const [executeLocationsQuery] = useLazyQuery(LocationsDocument, {
    fetchPolicy: "network-only",
  });
  const [executeResponsiblesQuery] = useLazyQuery(ResponsiblesDocument, {
    fetchPolicy: "network-only",
  });
  const [executeStatusesQuery] = useLazyQuery(StatusesDocument, {
    fetchPolicy: "network-only",
  });

  const fetchAssets = useCallback(
    (searchText: string) =>
      executeAssetsQuery({
        variables: { paging, filtration: { searchText } },
      }).then(({ data }) => data!.assets.items),
    [executeAssetsQuery]
  );

  const fetchLocations = useCallback(
    (searchText: string) =>
      executeLocationsQuery({
        variables: { paging, filtration: { searchText } },
      }).then(({ data }) => data!.locations.items),
    [executeLocationsQuery]
  );

  const fetchResponsibles = useCallback(
    (searchText: string) =>
      executeResponsiblesQuery({
        variables: { paging, filtration: { searchText } },
      }).then(({ data }) => data!.responsibles.items),
    [executeResponsiblesQuery]
  );

  const fetchStatuses = useCallback(
    (searchText: string) =>
      executeStatusesQuery({
        variables: { paging, filtration: { searchText } },
      }).then(({ data }) => data!.statuses.items),
    [executeStatusesQuery]
  );

  return {
    fetchAssets,
    fetchLocations,
    fetchResponsibles,
    fetchStatuses,
  } as const;
};
