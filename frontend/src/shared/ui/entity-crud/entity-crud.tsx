import PlusOutlined from "@ant-design/icons/lib/icons/PlusOutlined";
import { Button, Flex, Spin, Table } from "antd";
import { useCallback, useImperativeHandle } from "react";
import { ColumnsType, TableProps } from "antd/es/table";
import {
  ALL_PERMISSIONS,
  createPaginationParams,
  Permission,
  hasPermissions,
  PaginationParams,
  useDependentState,
} from "@/shared/lib";
import { useReadinessOnCondition } from "../switch-on-ready";
import { OverCell } from "../over-cell";
import { UpdateAndDeleteActions } from "./update-and-delete-actions";
import { useTranslation } from "react-i18next";
import { Key } from "antd/es/table/interface";
import { EditorsConfigs, useEditors } from "./hooks";
import { useDelayedLoading, useFetchHelper } from "@/shared/lib";

interface Record<T> {
  entity: T;
}

export interface EntityCrudApi {
  refresh: () => void;
}

export interface EntityCrudProps<
  Entity,
  EditorValueCreate,
  EditorValueUpdate,
  EditorValueDelete
> extends EditorsConfigs<
      Entity,
      EditorValueCreate,
      EditorValueUpdate,
      EditorValueDelete
    >,
    Pick<TableProps<Record<Entity>>, "columns" | "rowSelection"> {
  pagination?: Extract<TableProps<Record<Entity>>["pagination"], object>;

  read(
    pagingInput: PaginationParams
  ): Promise<{ items: Entity[]; totalCount: number }>;

  getKey(entity: Entity): Key;

  renderExtraContent?: () => React.ReactNode;

  // todo: учесть запрет на чтение
  /** Доступные операции. По умолчанию все операции доступны, если не запретить явно */
  permissions?: number;

  apiRef?: React.RefObject<EntityCrudApi | undefined>;
}

export const EntityCrud = <
  Entity,
  EditorValueCreate,
  EditorValueUpdate,
  EditorValueDelete
>({
  configCreate,
  configUpdate,
  configDelete,
  read,
  apiRef,
  permissions = ALL_PERMISSIONS,
  ...props
}: EntityCrudProps<
  Entity,
  EditorValueCreate,
  EditorValueUpdate,
  EditorValueDelete
>) => {
  const { t } = useTranslation();

  const [pageState, setPageState] = useDependentState(1, [read]);

  const pageSize = props.pagination?.pageSize ?? 10;
  const page = props.pagination?.current ?? pageState;

  const { data, isLoading, refresh } = useFetchHelper(
    useCallback(
      () => read(createPaginationParams(page, pageSize)),
      [page, pageSize, read]
    )
  );

  useReadinessOnCondition(!!data);

  useImperativeHandle(apiRef, () => ({ refresh }), [refresh]);

  const {
    openCreateEditor,
    openUpdateEditor,
    openDeleteEditor,
    renderEditors,
  } = useEditors({
    configCreate,
    configUpdate,
    configDelete,
    onAfterSave: refresh,
  });

  const dataSource = data
    ? data.items.map((entity) => ({ key: props.getKey(entity), entity }))
    : [];

  const columns: ColumnsType<Record<Entity>> = (() => {
    const result: ColumnsType<Record<Entity>> = props.columns
      ? [...props.columns]
      : [];

    if (
      hasPermissions(permissions, Permission.UPDATE) ||
      hasPermissions(permissions, Permission.DELETE)
    ) {
      result.push({
        fixed: "right",
        key: "actions",
        width: "0px",
        render: (_, record) => (
          <OverCell justify="end">
            <UpdateAndDeleteActions
              onUpdate={
                hasPermissions(permissions, Permission.UPDATE)
                  ? () => openUpdateEditor(record.entity)
                  : undefined
              }
              onDelete={
                hasPermissions(permissions, Permission.DELETE)
                  ? () => openDeleteEditor(record.entity)
                  : undefined
              }
            />
          </OverCell>
        ),
      });
    }

    return result;
  })();

  const delayedLoading = useDelayedLoading(isLoading);

  if (!data) {
    return delayedLoading ? (
      <Flex align="center" justify="center" style={{ height: 400 }}>
        <Spin />
      </Flex>
    ) : null;
  }

  const renderPanel = () => (
    <Flex justify="space-between" gap="middle">
      <div>{props.renderExtraContent?.()}</div>
      {hasPermissions(permissions, Permission.CREATE) && (
        <Button icon={<PlusOutlined />} onClick={openCreateEditor}>
          {t("add")}
        </Button>
      )}
    </Flex>
  );

  return (
    <>
      {renderEditors()}
      <Flex gap="middle" vertical={true}>
        {renderPanel()}
        <Table
          rowSelection={props.rowSelection}
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: "max-content" }}
          loading={delayedLoading}
          pagination={{
            current: pageState,
            onChange: setPageState,
            pageSize,
            total: data.totalCount,
            hideOnSinglePage: true,
            size: "default",
            showSizeChanger: false,
            ...props.pagination,
          }}
          size="middle"
        />
      </Flex>
    </>
  );
};
