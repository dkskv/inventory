import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CreateLocationDocument,
  DeleteLocationDocument,
  LocationsDocument,
  PagingInput,
  UpdateLocationDocument,
} from "@/gql/graphql";
import { CatalogEntityCrud } from "@/widgets/catalog-entity-crud";
import { useCallback } from "react";

export function LocationsPage() {
  const [executeQuery] = useLazyQuery(LocationsDocument, {
    fetchPolicy: "network-only",
  });
  const [createEntity] = useMutation(CreateLocationDocument);
  const [updateEntity] = useMutation(UpdateLocationDocument);
  const [deleteEntity] = useMutation(DeleteLocationDocument);

  const read = useCallback(
    (paging: PagingInput, searchText: string) =>
      executeQuery({
        variables: { paging, filtration: { searchText } },
      }).then(({ data }) => data!.locations),
    [executeQuery]
  );

  return (
    <CatalogEntityCrud
      read={read}
      createEntity={({ name }) => createEntity({ variables: { name } })}
      updateEntity={(id, { name }) => updateEntity({ variables: { id, name } })}
      deleteEntity={(id) => deleteEntity({ variables: { id } })}
    />
  );
}
