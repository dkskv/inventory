import {
  InventoryRecordOrGroupDto,
  InventoryRecordsFiltrationInput,
  InventoryRecordsGroupDto,
} from "@/gql/graphql";
import { useColumns } from "./../use-columns";
import { useMutationsConfigs } from "./../use-mutations-configs";
import {
  TablePaginationConfig,
  TableRowSelection,
} from "antd/es/table/interface";
import { FiltersStore } from "../../model";
import {
  CatalogEntitiesFetchers,
  useFetchGroupData,
  useFetchRootData,
} from "../../api";
import { EntityCrud, EntityCrudApi } from "@/shared/ui";
import { RefObject } from "react";
import { useDependentState } from "@/shared/lib";

interface CommonProps {
  apiRef: RefObject<EntityCrudApi | undefined>;
  filtersStore: FiltersStore;
  filterValueForServer: InventoryRecordsFiltrationInput;
  catalogEntitiesFetchers: CatalogEntitiesFetchers;
  permissions: number;
  renderExtraContent: () => JSX.Element;
  rowSelection:
    | TableRowSelection<{ entity: InventoryRecordOrGroupDto }>
    | undefined;
  getKey: (entity: InventoryRecordOrGroupDto) => string | number;
}

/** Корневые элементы и группировки */
export const InventoryRecordOrGroupCrud: React.FC<
  CommonProps & {
    dive: (group: InventoryRecordsGroupDto) => void;
    pagination: TablePaginationConfig;
  }
> = ({
  dive,
  filtersStore,
  filterValueForServer,
  catalogEntitiesFetchers,
  ...restProps
}) => {
  const mutationsConfigs = useMutationsConfigs(
    undefined,
    filterValueForServer,
    catalogEntitiesFetchers
  );

  const columns = useColumns({
    filtersStore,
    activeGroup: undefined,
    setActiveGroup: (g) => {
      if (g) {
        dive(g);
      }
    },
    catalogEntitiesFetchers,
  });

  const read = useFetchRootData(filterValueForServer);

  return (
    <EntityCrud
      {...restProps}
      {...mutationsConfigs}
      read={read}
      columns={columns}
    />
  );
};

/** Содержимое группировки */
export const InventoryRecordsGroupCrud: React.FC<
  CommonProps & {
    group: InventoryRecordsGroupDto;
    exit: () => void;
  }
> = ({
  group,
  exit,
  filtersStore,
  filterValueForServer,
  catalogEntitiesFetchers,
  ...restProps
}) => {
  const [page, setPage] = useDependentState(1, [filterValueForServer]);

  const mutationsConfigs = useMutationsConfigs(
    group,
    filterValueForServer,
    catalogEntitiesFetchers
  );

  const columns = useColumns({
    filtersStore,
    activeGroup: group,
    setActiveGroup: exit,
    catalogEntitiesFetchers,
  });

  const read = useFetchGroupData(group, filterValueForServer);

  return (
    <EntityCrud
      {...restProps}
      {...mutationsConfigs}
      read={read}
      columns={columns}
      pagination={{ current: page, onChange: setPage }}
    />
  );
};
