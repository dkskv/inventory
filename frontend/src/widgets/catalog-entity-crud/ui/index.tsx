import { Form, Input } from "antd";
import {
  EntityCrud,
  ConfigCreate,
  ConfigDelete,
  ConfigUpdate,
  EntityCrudProps,
} from "@/shared/ui";
import identity from "lodash/identity";
import { useCallback } from "react";
import { useSearchInput } from "./use-search-input";
import { PagingInput } from "@/gql/graphql";
import { useTranslation } from "react-i18next";

interface CatalogEntity {
  id: number;
  name: string;
}

interface FormData {
  name: string;
}

interface Props<T extends CatalogEntity> {
  read(
    padding: PagingInput,
    searchText: string
  ): ReturnType<EntityCrudProps<T, FormData, FormData, FormData>["read"]>;
  createEntity(formData: FormData): Promise<unknown>;
  updateEntity(id: number, formData: FormData): Promise<unknown>;
  deleteEntity(id: number): Promise<unknown>;
}

export const CatalogEntityCrud = <T extends CatalogEntity>({
  createEntity,
  updateEntity,
  deleteEntity,
  read: propsRead,
  ...props
}: Props<T>) => {
  const { t } = useTranslation();
  const searchInput = useSearchInput();

  const read = useCallback(
    (padding: PagingInput) => propsRead(padding, searchInput.searchText),
    [propsRead, searchInput.searchText]
  );

  const configCreate: ConfigCreate<FormData> = {
    autoFocusFieldName: "name",
    renderFormContent() {
      return (
        <Form.Item<FormData>
          label={t("name")}
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      );
    },
    onApply(formData) {
      return createEntity(formData);
    },
  };

  const configUpdate: ConfigUpdate<T, FormData> = {
    autoFocusFieldName: "name",
    prepareForEditor: identity,
    renderFormContent() {
      return (
        <Form.Item<FormData>
          label={t("name")}
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      );
    },
    onApply(formData, entity) {
      return updateEntity(entity.id, formData);
    },
    isEqual: (a, b) => a.name?.trim() === b.name?.trim(),
  };

  const configDelete: ConfigDelete<T, FormData> = {
    prepareForEditor: identity,
    renderFormContent() {
      return (
        <Form.Item<FormData> label={t("name")} name="name">
          <Input disabled={true} />
        </Form.Item>
      );
    },
    onApply(_, entity) {
      return deleteEntity(entity.id);
    },
  };

  return (
    <EntityCrud
      {...props}
      read={read}
      columns={[
        {
          key: "name",
          title: t("name"),
          render(_value, record) {
            return record.entity.name;
          },
        },
      ]}
      configCreate={configCreate}
      configUpdate={configUpdate}
      configDelete={configDelete}
      getKey={(entity) => entity.id}
      renderExtraContent={searchInput.render}
    />
  );
};
