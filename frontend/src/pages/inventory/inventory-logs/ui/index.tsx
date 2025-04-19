import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useFiltersStore } from "../model";
import { InventoryLogsGroupPartialDto } from "../api";
import { useDependentState, useLastNonNullable } from "@/shared/lib";
import { useDelayedValue } from "react-when-ready";
import { InventoryLogOrGroupCrud, InventoryLogsGroupCrud } from "../cruds";
import { Flex } from "antd";
import { SwitchWhenReady } from "@/shared/ui";

const InventoryLogsPageComponent = () => {
  const filtersStore = useFiltersStore();
  const filterValueForServer =
    useDelayedValue(filtersStore.serverValue, 500) ?? filtersStore.serverValue;

  const [activeGroup, setActiveGroup] =
    useState<InventoryLogsGroupPartialDto>();
  const lastActiveGroup = useLastNonNullable(activeGroup);

  const [rootPage, setRootPage] = useDependentState(1, [filterValueForServer]);

  return (
    <Flex vertical={true}>
      <SwitchWhenReady
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
    </Flex>
  );
};

export const InventoryLogsPage = observer(InventoryLogsPageComponent);
