import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CreateAssetDocument,
  DeleteAssetDocument,
  AssetsDocument,
  UpdateAssetDocument,
  PagingInput,
} from "@/gql/graphql";
import { CatalogEntityCrud } from "@/widgets/catalog-entity-crud";
import { useCallback } from "react";

export function AssetsPage() {
  const [executeQuery] = useLazyQuery(AssetsDocument, {
    fetchPolicy: "network-only",
  });
  const [createEntity] = useMutation(CreateAssetDocument);
  const [updateEntity] = useMutation(UpdateAssetDocument);
  const [deleteEntity] = useMutation(DeleteAssetDocument);

  const read = useCallback(
    (paging: PagingInput, searchText: string) =>
      executeQuery({
        variables: { paging, filtration: { searchText } },
      }).then(({ data }) => data!.assets),
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
