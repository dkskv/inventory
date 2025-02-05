import { useConfigMassUpdate } from "./use-config-mass-update";
import { useConfigMassDelete } from "./use-config-mass-delete";
import { UpdateAndDeleteActions } from "@/shared/ui";
import { CatalogEntitiesFetchers } from "../../api";
import { Permission, hasPermissions } from "@/shared/lib";
import { usePermissions } from "@/features/current-user-with-privileges";
import { Privilege } from "@/gql/graphql";

interface Props {
  selectedIds: number[];
  onMutationComplete: () => void;
  catalogEntitiesFetchers: CatalogEntitiesFetchers;
}

export const MassMutations: React.FC<Props> = ({
  selectedIds,
  onMutationComplete,
  catalogEntitiesFetchers,
}) => {
  const permissions = usePermissions(Privilege.Inventory);

  const configMassUpdate = useConfigMassUpdate(
    selectedIds,
    catalogEntitiesFetchers,
    onMutationComplete
  );
  const configMassDelete = useConfigMassDelete(selectedIds, onMutationComplete);

  return (
    <div>
      {configMassUpdate.editorElement}
      {configMassDelete.editorElement}
      <UpdateAndDeleteActions
        onUpdate={
          hasPermissions(permissions, Permission.UPDATE)
            ? () => configMassUpdate.onApply()
            : undefined
        }
        onDelete={
          hasPermissions(permissions, Permission.DELETE)
            ? () => configMassDelete.onApply()
            : undefined
        }
      />
    </div>
  );
};
