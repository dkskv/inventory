import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useFiltersStore } from "../model";
import { InventoryLogsGroupPartialDto } from "../api";
import {
  useDelayedValue,
  useDependentState,
  useLastNonNullable,
} from "@/shared/lib";
import { SwitchOnReady } from "@/shared/ui";
import { InventoryLogOrGroupCrud, InventoryLogsGroupCrud } from "../cruds";
import { Alert } from "antd";
import { useTranslation } from "react-i18next";

const InventoryLogsPageComponent = () => {
  const { t } = useTranslation();
  const filtersStore = useFiltersStore();
  const filterValueForServer =
    useDelayedValue(filtersStore.serverValue, 500) ?? filtersStore.serverValue;

  const [activeGroup, setActiveGroup] =
    useState<InventoryLogsGroupPartialDto>();
  const lastActiveGroup = useLastNonNullable(activeGroup);

  const [rootPage, setRootPage] = useDependentState(1, [filterValueForServer]);

  return (
    <>
      <Alert
        showIcon
        message={t("status-logging-is-not-supported-yet")}
        type="warning"
      />
      <SwitchOnReady
        activeKey={activeGroup ? "GROUP" : "ROOT"}
        renderByKey={(key) => {
          const commonProps = {
            filtersStore,
            filterValueForServer,
            scroll: { x: "max-content" },
            size: "middle",
            pagination: {
              pageSize: 10,
              hideOnSinglePage: true,
              size: "default",
              showSizeChanger: false,
            },
          } as const;

          if (key === "ROOT") {
            return (
              <InventoryLogOrGroupCrud
                {...commonProps}
                dive={setActiveGroup}
                pagination={{
                  ...commonProps.pagination,
                  current: rootPage,
                  onChange: setRootPage,
                }}
              />
            );
          }

          if (key === "GROUP" && lastActiveGroup) {
            return (
              <InventoryLogsGroupCrud
                {...commonProps}
                group={lastActiveGroup}
                exit={() => setActiveGroup(undefined)}
              />
            );
          }
        }}
      />
    </>
  );
};

export const InventoryLogsPage = observer(InventoryLogsPageComponent);
