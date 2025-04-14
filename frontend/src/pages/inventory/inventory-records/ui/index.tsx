import {
  InventoryRecordDto,
  InventoryRecordsGroupDto,
  Privilege,
} from "@/gql/graphql";
import { Button, Flex } from "antd";
import { useRef, useState } from "react";
import { EntityCrudApi, SwitchWhenReady } from "@/shared/ui";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { generateGroupKey, useFiltersStore } from "../model";
import { MassMutations } from "./mass-mutations";
import { useCatalogEntitiesFetchers, isGroup } from "../api";
import { useRowSelection } from "./use-row-selection";
import {
  Permission,
  useDependentState,
  useLastNonNullable,
} from "@/shared/lib";
import { usePermissions } from "@/features/current-user-with-privileges";
import { useExportDetailedGroups } from "./use-export-detailed-groups";
import FileExcelOutlined from "@ant-design/icons/FileExcelOutlined";
import { InventoryRecordOrGroupCrud, InventoryRecordsGroupCrud } from "./cruds";
import { useDelayedValue } from "react-when-ready";

function InventoryRecordsPageComponent() {
  const { t } = useTranslation();
  const entityCrudApiRef = useRef<EntityCrudApi>();
  const permissions = usePermissions(Privilege.Inventory);

  const [activeGroup, setActiveGroup] = useState<InventoryRecordsGroupDto>();
  const lastActiveGroup = useLastNonNullable(activeGroup);

  const filtersStore = useFiltersStore();
  const filterValueForServer =
    useDelayedValue(filtersStore.serverValue, 500) ?? filtersStore.serverValue;

  const { selectedIds, setSelectedIds, rowSelection } = useRowSelection();
  const [rootPage, setRootPage] = useDependentState(1, [filterValueForServer]);
  const catalogEntitiesFetchers = useCatalogEntitiesFetchers();
  const exportDetailedGroups = useExportDetailedGroups();

  const renderExtraContent = () => {
    if (selectedIds === undefined) {
      return (
        <Flex gap="middle" align="center">
          <Button onClick={() => setSelectedIds([])}>{t("select")}</Button>{" "}
          <Button
            icon={<FileExcelOutlined />}
            onClick={() => {
              exportDetailedGroups(filterValueForServer);
            }}
          />
        </Flex>
      );
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
    <SwitchWhenReady
      activeKey={activeGroup ? "GROUP" : "ROOT"}
      renderByKey={(key) => {
        const commonProps = {
          apiRef: entityCrudApiRef,
          filtersStore,
          filterValueForServer,
          renderExtraContent,
          catalogEntitiesFetchers,
          rowSelection,
          permissions:
            selectedIds === undefined ? permissions : Permission.READ,
          getKey: (entity: InventoryRecordsGroupDto | InventoryRecordDto) =>
            isGroup(entity) ? generateGroupKey(entity) : entity.id,
        };

        if (key === "ROOT") {
          return (
            <InventoryRecordOrGroupCrud
              {...commonProps}
              pagination={{ current: rootPage, onChange: setRootPage }}
              dive={setActiveGroup}
            />
          );
        }

        if (key === "GROUP" && lastActiveGroup) {
          return (
            <InventoryRecordsGroupCrud
              {...commonProps}
              group={lastActiveGroup}
              exit={() => setActiveGroup(undefined)}
            />
          );
        }
      }}
    />
  );
}

export const InventoryRecordsPage = observer(InventoryRecordsPageComponent);
