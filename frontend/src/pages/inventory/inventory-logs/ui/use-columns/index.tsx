import {
  Action,
  InventoryAttribute,
  InventoryLogsOrGroupsQuery,
} from "@/gql/graphql";
import { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { FilterPopover, OverCell, FetchSelect, Ellipsis } from "@/shared/ui";
import { convertEntitiesArraysToMaps, FiltersStore } from "../../model";
import {
  InventoryLogPartialDto,
  InventoryLogsGroupPartialDto,
  useFetchInventoryRecords,
  isGroup,
} from "../../api";
import { Flex, Row, Tag } from "antd";
import { formatAttributeValue } from "./format-attribute-value";
import { Fragment, useMemo } from "react";
import { usePrimaryColumn } from "@/widgets/grouped-table";
import { attributeTranslations } from "./attribute-translations";
import omit from "lodash/omit";

interface Params {
  activeGroup: InventoryLogsGroupPartialDto | undefined;
  setActiveGroup: (group: InventoryLogsGroupPartialDto | undefined) => void;
  filtersStore: FiltersStore;
  data:
    | Pick<InventoryLogsOrGroupsQuery["inventoryLogsOrGroups"], "usedEntities">
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
    renderValue: (entity) => entity.inventoryRecordId,
    activeGroup,
    setActiveGroup,
  });

  const usedEntities = useMemo(
    () =>
      data
        ? convertEntitiesArraysToMaps(omit(data.usedEntities, "__typename"))
        : null,
    [data]
  );

  const renderAttribute = (attribute: InventoryAttribute) => {
    const translationKey = attributeTranslations[attribute];

    return translationKey ? <Tag>{t(translationKey)}</Tag> : null;
  };

  const parseCreatingAttributes = (value: string | null | undefined) => {
    if (!value) {
      return {};
    }

    const { locationId, responsibleId, description } = JSON.parse(value);

    return { locationId, responsibleId, description };
  };

  if (!usedEntities) {
    return [];
  }

  return [
    primaryColumn,
    {
      title: t("asset"),
      width: 180,
      key: "asset",
      render(_, { entity }) {
        return entity.asset.name;
      },
    },
    {
      title: t("serialNumber"),
      width: 180,
      key: "serialNumber",
      render(_, { entity }) {
        // todo: ограничить отображение большого количества записей, возможно, на стороне сервера
        return entity.serialNumbers.map((n, index) => (
          <Row key={index}>{n}</Row>
        ));
      },
    },
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
        // todo: выполнить рефакторинг
        if (entity.action === Action.Create) {
          if (!entity.nextValue) {
            return;
          }

          return (
            <Flex vertical={true} gap="small" align="start">
              {Object.entries(parseCreatingAttributes(entity.nextValue)).map(
                ([attribute, value]) =>
                  value && (
                    <Fragment key={attribute}>
                      {renderAttribute(attribute as InventoryAttribute)}
                    </Fragment>
                  )
              )}
            </Flex>
          );
        }

        return entity.attribute && renderAttribute(entity.attribute);
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
        // todo: выполнить рефакторинг
        if (entity.action === Action.Create) {
          if (!entity.nextValue) {
            return;
          }

          return (
            <Flex
              style={{ width: 250, minWidth: "100%" }}
              vertical={true}
              gap="small"
            >
              {Object.entries(parseCreatingAttributes(entity.nextValue)).map(
                ([attribute, value]) => (
                  <Ellipsis key={attribute}>
                    {formatAttributeValue(
                      attribute,
                      // todo: выполнить рефакторинг
                      JSON.stringify(value),
                      usedEntities
                    )}
                  </Ellipsis>
                )
              )}
            </Flex>
          );
        }

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
