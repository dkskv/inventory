import { InventoryRecordsGroupDto, Privilege } from "@/gql/graphql";
import { Button, Flex } from "antd";
import { useRef, useState } from "react";
import { EntityCrud, EntityCrudApi } from "@/shared/ui";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { generateGroupKey, useFiltersStore } from "../model";
import { MassMutations } from "./mass-mutations";
import { useCatalogEntitiesFetchers, isGroup } from "../api";
import { useColumns } from "./use-columns";
import { useFetchData } from "../api";
import { useMutationsConfigs } from "./use-mutations-configs";
import { useRowSelection } from "./use-row-selection";
import { Permission, useDelayedValue } from "@/shared/lib";
import { usePermissions } from "@/features/current-user-with-privileges";

function InventoryRecordsPageComponent() {
  const { t } = useTranslation();
  const entityCrudApiRef = useRef<EntityCrudApi>();
  const permissions = usePermissions(Privilege.Inventory);
  const [activeGroup, setActiveGroup] = useState<InventoryRecordsGroupDto>();
  const { selectedIds, setSelectedIds, rowSelection } = useRowSelection();
  const catalogEntitiesFetchers = useCatalogEntitiesFetchers();

  const [page, setPage] = useState(1);
  const [activeGroupPage, setActiveGroupPage] = useState(1);

  const filtersStore = useFiltersStore();
  const filterValueForServer =
    useDelayedValue(filtersStore.serverValue, 500) ?? filtersStore.serverValue;

  const mutationsConfigs = useMutationsConfigs(
    activeGroup,
    filterValueForServer,
    catalogEntitiesFetchers
  );

  const columns = useColumns({
    filtersStore,
    activeGroup,
    setActiveGroup: (g: InventoryRecordsGroupDto | undefined) => {
      setActiveGroup(g);
      setActiveGroupPage(1);
    },
    catalogEntitiesFetchers,
  });

  const read = useFetchData(activeGroup, filterValueForServer);

  const renderExtraContent = () => {
    if (selectedIds === undefined) {
      return <Button onClick={() => setSelectedIds([])}>{t("select")}</Button>;
    }

    return (
      <Flex gap="middle" align="center">
        <Button onClick={() => setSelectedIds(undefined)}>{`${t("cancel")} (${
          selectedIds.length
        })`}</Button>
        {selectedIds.length > 0 && (
          <MassMutations
            selectedIds={selectedIds}
            catalogEntitiesFetchers={catalogEntitiesFetchers}
            onMutationComplete={() => {
              entityCrudApiRef.current?.refresh();
              setSelectedIds(undefined);
            }}
          />
        )}
      </Flex>
    );
  };

  return (
    <EntityCrud
      {...mutationsConfigs}
      apiRef={entityCrudApiRef}
      read={read}
      getKey={(entity) =>
        isGroup(entity) ? generateGroupKey(entity) : entity.id
      }
      columns={columns}
      rowSelection={rowSelection}
      pagination={{
        current: activeGroup ? activeGroupPage : page,
        onChange: activeGroup ? setActiveGroupPage : setPage,
      }}
      permissions={selectedIds === undefined ? permissions : Permission.READ}
      renderExtraContent={renderExtraContent}
    />
  );
}

export const InventoryRecordsPage = observer(InventoryRecordsPageComponent);
