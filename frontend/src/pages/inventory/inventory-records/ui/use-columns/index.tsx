import { InventoryRecordDto, InventoryRecordsGroupDto } from "@/gql/graphql";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import {
  FilterPopover,
  OverCell,
  FetchSelect,
  ToggleSearch,
  Ellipsis,
  Tag,
} from "@/shared/ui";
import { CatalogEntitiesFetchers, isGroup } from "../../api";
import { CatalogEntityFilterStore, FiltersStore } from "../../model";
import { Link } from "react-router";
import { usePrimaryColumn } from "@/widgets/grouped-table";
import { Flex } from "antd";

interface Params {
  activeGroup: InventoryRecordsGroupDto | undefined;
  setActiveGroup: (group: InventoryRecordsGroupDto | undefined) => void;
  filtersStore: FiltersStore;
  catalogEntitiesFetchers: CatalogEntitiesFetchers;
}

export const useColumns = ({
  activeGroup,
  setActiveGroup,
  filtersStore,
  catalogEntitiesFetchers,
}: Params): ColumnsType<{
  entity: InventoryRecordsGroupDto | InventoryRecordDto;
}> => {
  const { t } = useTranslation();

  const primaryColumn = usePrimaryColumn<
    InventoryRecordDto,
    InventoryRecordsGroupDto
  >({
    isGroup,
    renderValue: (entity) => (
      <Link to="/inventory/logs" state={{ inventoryRecord: entity }}>
        {entity.id}
      </Link>
    ),
    activeGroup,
    setActiveGroup,
  });

  // todo: вынести в компонент CatalogEntityFilterTitle
  const renderFilterTitle = <Entity extends { id: number; name: string }>(
    title: string,
    fetchEntities: (searchText: string) => Promise<Entity[]>,
    filterStore: CatalogEntityFilterStore<Entity>
  ) => {
    const filterValue = filterStore.getItems();

    const renderPopoverContent = () => (
      <FetchSelect
        renderLabel={({ name }) => name}
        fetchEntities={fetchEntities}
        multiple={true}
        allowClear={true}
        value={filterValue}
        onChange={filterStore.setItems}
        placeholder={t("enterName")}
      />
    );

    return (
      <OverCell>
        <FilterPopover
          isActive={filterValue.length > 0}
          renderContent={renderPopoverContent}
        >
          {title}
        </FilterPopover>
      </OverCell>
    );
  };

  return [
    primaryColumn,
    {
      width: 250,
      key: "asset",
      title: activeGroup
        ? t("asset")
        : renderFilterTitle(
            t("asset"),
            catalogEntitiesFetchers.fetchAssets,
            filtersStore.assets
          ),
      render(_, { entity }) {
        return entity.asset.name;
      },
    },
    {
      width: 250,
      key: "serialNumber",
      title: (
        <OverCell>
          <ToggleSearch
            value={filtersStore.serialNumberSearchText}
            onChange={filtersStore.setSerialNumberSearchText}
            label={t("serialNumber")}
          />
        </OverCell>
      ),
      render(_value, { entity }) {
        return isGroup(entity) ? null : entity.serialNumber;
      },
    },
    {
      width: 200,
      key: "statuses",
      title: renderFilterTitle(
        t("statuses"),
        catalogEntitiesFetchers.fetchStatuses,
        filtersStore.statuses
      ),
      render(_, { entity }) {
        if (isGroup(entity)) {
          return null;
        }

        return (
          <Flex wrap={true} gap={8}>
            {entity.statuses.map((status) => (
              <Tag color={status.color}>{status.name}</Tag>
            ))}
          </Flex>
        );
      },
    },
    {
      width: 250,
      key: "location",
      title: activeGroup
        ? t("location")
        : renderFilterTitle(
            t("location"),
            catalogEntitiesFetchers.fetchLocations,
            filtersStore.locations
          ),
      render(_value, { entity }) {
        return entity.location.name;
      },
    },
    {
      width: 250,
      key: "responsible",
      title: activeGroup
        ? t("responsible")
        : renderFilterTitle(
            t("responsible"),
            catalogEntitiesFetchers.fetchResponsibles,
            filtersStore.responsibles
          ),
      render(_value, { entity }) {
        return entity.responsible.name;
      },
    },
    {
      width: 250,
      key: "description",
      title: (
        <OverCell>
          <ToggleSearch
            value={filtersStore.descriptionSearchText}
            onChange={filtersStore.setDescriptionSearchText}
            label={t("description")}
          />
        </OverCell>
      ),
      render(_value, { entity }) {
        return isGroup(entity) ? null : (
          <div style={{ width: 250, minWidth: "100%" }}>
            <Ellipsis>{entity.description}</Ellipsis>
          </div>
        );
      },
    },
  ];
};
