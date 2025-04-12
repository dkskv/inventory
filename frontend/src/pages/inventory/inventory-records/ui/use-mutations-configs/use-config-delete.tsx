import {
  AssetDto,
  DeleteInventoryRecordsBatchDocument,
  DeleteInventoryRecordsByFiltrationDocument,
  InventoryRecordOrGroupDto,
  InventoryRecordsFiltrationInput,
  LocationDto,
  ResponsibleDto,
  StatusDto,
} from "@/gql/graphql";
import { ConfigDelete } from "@/shared/ui";
import { Form, Input, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import { createFiltrationByGroup, isGroup } from "../../api";
import { FetchSelect } from "@/shared/ui";
import identity from "lodash/identity";
import { useMutation } from "@apollo/client";
import TextArea from "antd/es/input/TextArea";

type FormData = {
  count?: number;
  asset: AssetDto;
  serialNumber?: string;
  location: LocationDto;
  responsible: ResponsibleDto;
  description?: string;
  statuses: StatusDto[];
};

type Config = ConfigDelete<InventoryRecordOrGroupDto, FormData>;

export const useConfigDelete = (
  filtration: InventoryRecordsFiltrationInput
): Config => {
  const { t } = useTranslation();

  const [deleteEntitiesBatch] = useMutation(
    DeleteInventoryRecordsBatchDocument
  );
  const [deleteByFiltration] = useMutation(
    DeleteInventoryRecordsByFiltrationDocument
  );

  const onApply: Config["onApply"] = (_, entity) =>
    isGroup(entity)
      ? deleteByFiltration({
          variables: {
            filtration: {
              ...filtration,
              ...createFiltrationByGroup(entity),
            },
          },
        })
      : deleteEntitiesBatch({
          variables: {
            ids: [entity.id],
          },
        });

  const renderFormContent: Config["renderFormContent"] = (_, entity) => (
    <>
      <Form.Item<FormData>
        label={t("quantity")}
        name="count"
        initialValue={1}
        hidden={!isGroup(entity)}
      >
        <InputNumber disabled={true} style={{ width: 120 }} />
      </Form.Item>
      <Form.Item<FormData> label={t("asset")} name="asset">
        <FetchSelect<AssetDto>
          renderLabel={({ name }) => name}
          fetchEntities={() => Promise.resolve([])}
          disabled={true}
        />
      </Form.Item>
      <Form.Item<FormData>
        hidden={isGroup(entity)}
        label={t("serialNumber")}
        name="serialNumber"
      >
        <Input disabled={true} />
      </Form.Item>
      <Form.Item<FormData> label={t("statuses")} name="statuses">
        <FetchSelect<StatusDto, true>
          disabled
          multiple
          renderLabel={({ name }) => name}
          fetchEntities={() => Promise.resolve([])}
        />
      </Form.Item>
      <Form.Item<FormData> label={t("location")} name="location">
        <FetchSelect<LocationDto>
          renderLabel={({ name }) => name}
          fetchEntities={() => Promise.resolve([])}
          disabled={true}
        />
      </Form.Item>
      <Form.Item<FormData> label={t("responsible")} name="responsible">
        <FetchSelect<ResponsibleDto>
          renderLabel={({ name }) => name}
          fetchEntities={() => Promise.resolve([])}
          disabled={true}
        />
      </Form.Item>
      <Form.Item<FormData> label={t("description")} name="description">
        <TextArea disabled={true} autoSize={true} />
      </Form.Item>
    </>
  );

  return { prepareForEditor: identity, renderFormContent, onApply };
};
