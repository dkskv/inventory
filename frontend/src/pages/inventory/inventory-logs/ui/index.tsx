import { Spin, Table } from "antd";
import { useCallback, useState } from "react";
import { useReadinessOnCondition } from "@/shared/ui";
import { observer } from "mobx-react-lite";
import { generateGroupKey, useFiltersStore } from "../model";
import {
  InventoryLogsGroupPartialDto,
  isGroup,
  InventoryLogsData,
  useFetchData,
} from "../api";
import { useColumns } from "./use-columns";
import {
  useDelayedLoading,
  useDelayedValue,
  useFetchHelper,
} from "@/shared/lib";
import { createPaginationParams } from "@/shared/lib";

const InventoryLogsPageComponent = () => {
  const filtersStore = useFiltersStore();
  const filterValueForServer =
    useDelayedValue(filtersStore.serverValue, 500) ?? filtersStore.serverValue;

  const [activeGroup, setActiveGroup] =
    useState<InventoryLogsGroupPartialDto>();

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [activeGroupPage, setActiveGroupPage] = useState(1);

  const fetchData = useFetchData();

  const { data, isLoading } = useFetchHelper<InventoryLogsData>(
    useCallback(
      () =>
        fetchData(
          activeGroup,
          createPaginationParams(
            activeGroup ? activeGroupPage : page,
            pageSize
          ),
          filterValueForServer
        ),
      [activeGroup, activeGroupPage, page, fetchData, filterValueForServer]
    )
  );

  useReadinessOnCondition(!!data);

  const dataSource = data
    ? data.items.map((entity) => ({
        key: isGroup(entity) ? generateGroupKey(entity) : entity.id,
        entity: entity,
      }))
    : [];

  const columns = useColumns({
    filtersStore,
    activeGroup,
    setActiveGroup(g: InventoryLogsGroupPartialDto | undefined) {
      setActiveGroup(g);
      setActiveGroupPage(1);
    },
    data,
  });

  const delayedLoading = useDelayedLoading(isLoading);

  if (!data) {
    return delayedLoading ? <Spin /> : null;
  }

  return (
    <Table
      dataSource={dataSource}
      scroll={{ x: "max-content" }}
      loading={delayedLoading}
      pagination={{
        current: activeGroup ? activeGroupPage : page,
        onChange: activeGroup ? setActiveGroupPage : setPage,
        pageSize,
        total: data.totalCount,
        hideOnSinglePage: true,
        size: "default",
        showSizeChanger: false,
      }}
      size="middle"
      columns={columns}
    />
  );
};

export const InventoryLogsPage = observer(InventoryLogsPageComponent);
