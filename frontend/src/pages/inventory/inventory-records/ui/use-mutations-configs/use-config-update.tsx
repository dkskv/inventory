import {
  AssetDto,
  InventoryRecordOrGroupDto,
  InventoryRecordsFiltrationInput,
  LocationDto,
  ResponsibleDto,
  UpdateInventoryRecordDocument,
  UpdateInventoryRecordsByFiltrationDocument,
} from "@/gql/graphql";
import { ConfigUpdate, FetchSelect } from "@/shared/ui";
import { createFiltrationByGroup, isGroup } from "../../api";
import { Form, Input, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { CatalogEntitiesFetchers } from "../../api";
import TextArea from "antd/es/input/TextArea";

type FormData = {
  count?: number;
  asset: AssetDto;
  serialNumber?: string;
  responsible: ResponsibleDto;
  location: LocationDto;
  description?: string;
};

type Config = ConfigUpdate<InventoryRecordOrGroupDto, FormData>;

export const useConfigUpdate = (
  entitiesFetchers: Pick<
    CatalogEntitiesFetchers,
    "fetchLocations" | "fetchResponsibles"
  >,
  filtration: InventoryRecordsFiltrationInput
): Config => {
  const { t } = useTranslation();

  const [updateEntity] = useMutation(UpdateInventoryRecordDocument);
  const [updateEntityByFiltration] = useMutation(
    UpdateInventoryRecordsByFiltrationDocument
  );

  const onApply: Config["onApply"] = (formData, entity) => {
    const commonVariables = {
      locationId: formData.location.id,
      responsibleId: formData.responsible.id,
      description: formData.description,
    };

    return isGroup(entity)
      ? updateEntityByFiltration({
          variables: {
            filtration: {
              ...filtration,
              ...createFiltrationByGroup(entity),
            },
            ...commonVariables,
          },
        })
      : updateEntity({
          variables: {
            id: entity.id,
            ...commonVariables,
            serialNumber: formData.serialNumber,
          },
        });
  };

  const prepareForEditor: Config["prepareForEditor"] = (entity) => ({
    asset: entity.asset,
    location: entity.location,
    responsible: entity.responsible,
    count: isGroup(entity) ? entity.count : undefined,
    serialNumber: isGroup(entity) ? undefined : entity.serialNumber ?? "",
    description: isGroup(entity) ? undefined : entity.description ?? "",
  });

  const renderFormContent: Config["renderFormContent"] = (_, entity) => (
    <>
      <Form.Item<FormData>
        label={t("applyToQuantity")}
        name="count"
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
        <Input />
      </Form.Item>
      <Form.Item<FormData>
        label={t("location")}
        name="location"
        rules={[{ required: true }]}
      >
        <FetchSelect
          renderLabel={({ name }) => name}
          fetchEntities={entitiesFetchers.fetchLocations}
        />
      </Form.Item>
      <Form.Item<FormData>
        label={t("responsible")}
        name="responsible"
        rules={[{ required: true }]}
      >
        <FetchSelect
          renderLabel={({ name }) => name}
          fetchEntities={entitiesFetchers.fetchResponsibles}
        />
      </Form.Item>
      <Form.Item<FormData> label={t("description")} name="description">
        <TextArea autoSize={true} />
      </Form.Item>
    </>
  );

  const isEqual: Config["isEqual"] = (a, b) =>
    a.location?.id === b.location?.id &&
    a.responsible?.id === b.responsible?.id &&
    (a.serialNumber ?? "").trim() === (b.serialNumber ?? "").trim() &&
    (a.description ?? "").trim() === (b.description ?? "").trim();

  return { prepareForEditor, renderFormContent, isEqual, onApply };
};
