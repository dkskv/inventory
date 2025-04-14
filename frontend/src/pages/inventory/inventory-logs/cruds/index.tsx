import {
  createPaginationParams,
  useDependentState,
  useFetchHelper,
} from "@/shared/lib";
import { useReadinessOnCondition, useDelayedLoading } from "react-when-ready";
import { Table, TablePaginationConfig } from "antd";
import { useCallback } from "react";
import { useFetchGroupData, useFetchRootData } from "../api";
import { TableProps } from "antd/lib";
import { FiltersStore, generateGroupKey } from "../model";
import { InventoryLogsFiltrationInput } from "@/gql/graphql";
import { useColumns } from "../ui/use-columns";
import { InventoryLogsGroupPartialDto, isGroup } from "../api";

interface CommonProps extends Pick<TableProps, "scroll" | "size"> {
  filtersStore: FiltersStore;
  filterValueForServer: InventoryLogsFiltrationInput;
}

/** Корневые элементы и группировки */
export const InventoryLogOrGroupCrud: React.FC<
  CommonProps & {
    dive: (group: InventoryLogsGroupPartialDto) => void;
    pagination: Required<
      Pick<
        TablePaginationConfig,
        | "current"
        | "pageSize"
        | "onChange"
        | "hideOnSinglePage"
        | "size"
        | "showSizeChanger"
      >
    >;
  }
> = ({
  dive,
  filtersStore,
  filterValueForServer,
  pagination,
  ...restProps
}) => {
  const read = useFetchRootData(filterValueForServer);

  const page = pagination.current;
  const pageSize = pagination.pageSize;

  const { data, isLoading } = useFetchHelper(
    useCallback(
      () => read(createPaginationParams(page, pageSize)),
      [read, page, pageSize]
    )
  );

  useReadinessOnCondition(!!data);
  const delayedLoading = useDelayedLoading(isLoading, 500);

  const columns = useColumns({
    filtersStore,
    activeGroup: undefined,
    setActiveGroup: (g) => {
      if (g) {
        dive(g);
      }
    },
    data,
  });

  const dataSource = data
    ? data.items.map((entity) => ({
        key: isGroup(entity) ? generateGroupKey(entity) : entity.id,
        entity: entity,
      }))
    : [];

  if (!data) {
    return null;
  }

  return (
    <Table
      {...restProps}
      dataSource={dataSource}
      loading={delayedLoading}
      pagination={{ ...pagination, total: data.totalCount }}
      columns={columns}
    />
  );
};

/** Содержимое группировки */
export const InventoryLogsGroupCrud: React.FC<
  CommonProps & {
    group: InventoryLogsGroupPartialDto;
    exit: () => void;
    pagination: Required<
      Pick<
        TablePaginationConfig,
        "pageSize" | "hideOnSinglePage" | "size" | "showSizeChanger"
      >
    >;
  }
> = ({
  group,
  exit,
  filtersStore,
  filterValueForServer,
  pagination,
  ...restProps
}) => {
  const read = useFetchGroupData(filterValueForServer);

  const pageSize = pagination.pageSize;
  const [page, setPage] = useDependentState(1, [filterValueForServer]);

  const { data, isLoading } = useFetchHelper(
    useCallback(
      () => read(group, createPaginationParams(page, pageSize)),
      [read, group, page, pageSize]
    )
  );

  useReadinessOnCondition(!!data);
  const delayedLoading = useDelayedLoading(isLoading, 500);

  const columns = useColumns({
    filtersStore,
    activeGroup: group,
    setActiveGroup: exit,
    data,
  });

  const dataSource = data
    ? data.items.map((entity) => ({
        key: isGroup(entity) ? generateGroupKey(entity) : entity.id,
        entity: entity,
      }))
    : [];

  if (!data) {
    return null;
  }

  return (
    <Table
      {...restProps}
      dataSource={dataSource}
      loading={delayedLoading}
      pagination={{
        ...pagination,
        current: page,
        onChange: setPage,
        total: data.totalCount,
      }}
      columns={columns}
    />
  );
};
