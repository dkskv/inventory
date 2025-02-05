import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CreateResponsibleDocument,
  DeleteResponsibleDocument,
  PagingInput,
  ResponsiblesDocument,
  UpdateResponsibleDocument,
} from "@/gql/graphql";
import { CatalogEntityCrud } from "@/widgets/catalog-entity-crud";
import { useCallback } from "react";

export function ResponsiblesPage() {
  const [executeQuery] = useLazyQuery(ResponsiblesDocument, {
    fetchPolicy: "network-only",
  });
  const [createEntity] = useMutation(CreateResponsibleDocument);
  const [updateEntity] = useMutation(UpdateResponsibleDocument);
  const [deleteEntity] = useMutation(DeleteResponsibleDocument);

  const read = useCallback(
    (paging: PagingInput, searchText: string) =>
      executeQuery({
        variables: { paging, filtration: { searchText } },
      }).then(({ data }) => data!.responsibles),
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
