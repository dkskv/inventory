import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CreateStatusDocument,
  DeleteStatusDocument,
  PagingInput,
  StatusDto,
  StatusesDocument,
  UpdateStatusDocument,
} from "@/gql/graphql";
import { useSearchInput } from "@/widgets/catalog-entity-crud";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ConfigCreate,
  ConfigDelete,
  ConfigUpdate,
  EntityCrud,
  Tag,
} from "@/shared/ui";
import { Form, Input } from "antd";
import identity from "lodash/identity";
import { ColorPickerField } from "./color-picker-field";

interface FormData {
  name: string;
  color: string;
}

export function StatusesPage() {
  const { t } = useTranslation();

  const [executeQuery] = useLazyQuery(StatusesDocument, {
    fetchPolicy: "network-only",
  });
  const [createEntity] = useMutation(CreateStatusDocument);
  const [updateEntity] = useMutation(UpdateStatusDocument);
  const [deleteEntity] = useMutation(DeleteStatusDocument);

  const searchInput = useSearchInput();

  const read = useCallback(
    (paging: PagingInput) =>
      executeQuery({
        variables: {
          paging,
          filtration: { searchText: searchInput.searchText },
        },
      }).then(({ data }) => data!.statuses),
    [executeQuery, searchInput.searchText]
  );

  const configCreate: ConfigCreate<FormData> = {
    autoFocusFieldName: "name",
    renderFormContent() {
      return (
        <>
          <Form.Item<FormData>
            label={t("name")}
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FormData>
            label={t("color")}
            name="color"
            rules={[{ required: true }]}
          >
            <ColorPickerField showText defaultValue="#000000" />
          </Form.Item>
        </>
      );
    },
    onApply(formData) {
      return createEntity({ variables: formData });
    },
  };

  const configUpdate: ConfigUpdate<StatusDto, FormData> = {
    autoFocusFieldName: "name",
    prepareForEditor: identity,
    renderFormContent() {
      return (
        <>
          <Form.Item<FormData>
            label={t("name")}
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FormData>
            label={t("color")}
            name="color"
            rules={[{ required: true }]}
          >
            <ColorPickerField showText />
          </Form.Item>
        </>
      );
    },
    onApply(formData, entity) {
      return updateEntity({ variables: { id: entity.id, ...formData } });
    },
    isEqual: (a, b) => a.name?.trim() === b.name?.trim() && a.color === b.color,
  };

  const configDelete: ConfigDelete<StatusDto, FormData> = {
    prepareForEditor: identity,
    renderFormContent() {
      return (
        <>
          <Form.Item<FormData> label={t("name")} name="name">
            <Input disabled />
          </Form.Item>
          <Form.Item<FormData> label={t("color")} name="color">
            <ColorPickerField disabled showText />
          </Form.Item>
        </>
      );
    },
    onApply(_, entity) {
      return deleteEntity({ variables: { id: entity.id } });
    },
  };

  return (
    <EntityCrud
      read={read}
      columns={[
        {
          key: "name",
          title: t("name"),
          render(_value, { entity }) {
            return <Tag color={entity.color}>{entity.name}</Tag>;
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
}
