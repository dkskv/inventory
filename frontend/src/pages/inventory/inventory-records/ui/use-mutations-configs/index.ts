import { useConfigCreate } from "./use-config-create";
import { useConfigUpdate } from "./use-config-update";
import { useConfigDelete } from "./use-config-delete";
import {
  InventoryRecordsFiltrationInput,
  InventoryRecordsGroupDto,
} from "@/gql/graphql";
import { CatalogEntitiesFetchers } from "../../api";

export const useMutationsConfigs = (
  activeGroup: InventoryRecordsGroupDto | undefined,
  filtration: InventoryRecordsFiltrationInput,
  catalogEntitiesFetchers: CatalogEntitiesFetchers
) => {
  const configCreate = useConfigCreate(activeGroup, catalogEntitiesFetchers);
  const configUpdate = useConfigUpdate(catalogEntitiesFetchers, filtration);
  const configDelete = useConfigDelete(filtration);

  return { configCreate, configUpdate, configDelete } as const;
};
