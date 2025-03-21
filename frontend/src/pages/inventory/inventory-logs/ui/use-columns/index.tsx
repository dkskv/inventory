import { LocationDto, ResponsibleDto } from "@/gql/graphql";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { FilterPopover, OverCell, FetchSelect, Ellipsis } from "@/shared/ui";
import { FiltersStore } from "../../model";
import {
  InventoryLogPartialDto,
  InventoryLogsGroupPartialDto,
  useFetchInventoryRecords,
  isGroup,
  InventoryLogsData,
} from "../../api";
import { Tag } from "antd";
import { formatAttributeValue } from "./format-attribute-value";
import { useMemo } from "react";
import { usePrimaryColumn } from "@/widgets/grouped-table";

interface Params {
  activeGroup: InventoryLogsGroupPartialDto | undefined;
  setActiveGroup: (group: InventoryLogsGroupPartialDto | undefined) => void;
  filtersStore: FiltersStore;
  data:
    | Pick<InventoryLogsData, "usedLocations" | "usedResponsibles">
    | undefined;
}

export const useColumns = ({
  activeGroup,
  setActiveGroup,
  filtersStore,
  data,
}: Params): ColumnsType<{
  entity: InventoryLogPartialDto | InventoryLogsGroupPartialDto;
}> => {
  const { t } = useTranslation();
  const fetchInventoryRecords = useFetchInventoryRecords();

  const primaryColumn = usePrimaryColumn<
    InventoryLogPartialDto,
    InventoryLogsGroupPartialDto
  >({
    isGroup,
    renderTitle: (defaultTitle: string) => (
      <OverCell>
        <FilterPopover
          isActive={!!filtersStore.inventoryRecordFilterStore.getValue()}
          renderContent={() => (
            <FetchSelect
              renderLabel={(e) =>
                `${e.id} (${e.asset.name} - ${e.location.name} - ${e.responsible.name})`
              }
              fetchEntities={fetchInventoryRecords}
              multiple={false}
              allowClear={true}
              placeholder={t("enterId")}
              value={filtersStore.inventoryRecordFilterStore.getValue()}
              onChange={(v) =>
                filtersStore.inventoryRecordFilterStore.setValue(v ?? undefined)
              }
            />
          )}
        >
          {defaultTitle}
        </FilterPopover>
      </OverCell>
    ),
    renderValue: (entity) => entity.inventoryRecord.id,
    activeGroup,
    setActiveGroup,
  });

  const usedEntities = useMemo(() => {
    const locations = new Map<number, LocationDto>();
    const responsibles = new Map<number, ResponsibleDto>();

    if (data) {
      data.usedLocations.forEach((e) => {
        locations.set(e.id, e);
      });

      data.usedResponsibles.forEach((e) => {
        responsibles.set(e.id, e);
      });
    }

    return { locations, responsibles } as const;
  }, [data]);

  return [
    primaryColumn,
    {
      title: t("time"),
      width: 180,
      key: "time",
      render(_, { entity }) {
        return new Date(entity.timestamp).toLocaleString();
      },
    },
    {
      title: t("author"),
      width: 180,
      key: "author",
      render(_, { entity }) {
        return entity.author?.username;
      },
    },
    {
      title: t("action"),
      width: 100,
      key: "action",
      render(_, { entity }) {
        const { action } = entity;

        if (action === "UPDATE") {
          return <Tag color="orange">{t("updateNoun")}</Tag>;
        }

        if (action === "CREATE") {
          return <Tag color="green">{t("creation")}</Tag>;
        }
      },
    },
    {
      title: t("attribute"),
      width: 180,
      key: "attribute",
      render(_, { entity }) {
        const { attribute } = entity;

        if (!attribute) {
          return;
        }

        if (attribute === "responsibleId") {
          return <Tag>{t("responsible")}</Tag>;
        }

        if (attribute === "locationId") {
          return <Tag>{t("location")}</Tag>;
        }

        if (attribute === "serialNumber") {
          return <Tag>{t("serialNumber")}</Tag>;
        }

        if (attribute === "description") {
          return <Tag>{t("description")}</Tag>;
        }
      },
    },
    {
      title: t("oldValue"),
      width: 250,
      key: "prevValue",
      render(_, { entity }) {
        return (
          <div style={{ width: 250, minWidth: "100%" }}>
            <Ellipsis>
              {formatAttributeValue(
                entity.attribute,
                entity.prevValue,
                usedEntities
              )}
            </Ellipsis>
          </div>
        );
      },
    },
    {
      title: t("newValue"),
      width: 250,
      key: "nextValue",
      render(_, { entity }) {
        return (
          <div style={{ width: 250, minWidth: "100%" }}>
            <Ellipsis>
              {formatAttributeValue(
                entity.attribute,
                entity.nextValue,
                usedEntities
              )}
            </Ellipsis>
          </div>
        );
      },
    },
  ];
};
