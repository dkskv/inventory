import {
  AssetDto,
  CreateInventoryRecordDocument,
  CreateInventoryRecordsBatchDocument,
  LocationDto,
  ResponsibleDto,
} from "@/gql/graphql";
import { ConfigCreate } from "@/shared/ui";
import { FetchSelect } from "@/shared/ui";
import { useMutation } from "@apollo/client";
import { Form, Input, InputNumber } from "antd";
import isNumber from "lodash/isNumber";
import { useTranslation } from "react-i18next";
import { CatalogEntitiesFetchers } from "../../api";
import TextArea from "antd/es/input/TextArea";

type FormData = {
  count?: number;
  asset: AssetDto;
  serialNumber?: string;
  location: LocationDto;
  responsible: ResponsibleDto;
  description?: string;
};

type LockerFormData = Pick<FormData, "asset" | "location" | "responsible">;

const isBatchCount = (count: number | undefined): count is number =>
  isNumber(count) && count > 1;

type Config = ConfigCreate<FormData>;

export const useConfigCreate = (
  entitiesFetchers: CatalogEntitiesFetchers,
  lockedFormData: LockerFormData | undefined
): Config => {
  const { t } = useTranslation();

  const [createEntity] = useMutation(CreateInventoryRecordDocument);
  const [createEntitiesBatch] = useMutation(
    CreateInventoryRecordsBatchDocument
  );

  const onApply: Config["onApply"] = (formData) => {
    const commonVariables = {
      assetId: formData.asset.id,
      locationId: formData.location.id,
      responsibleId: formData.responsible.id,
      description: formData.description,
    };

    return isBatchCount(formData.count)
      ? createEntitiesBatch({
          variables: { ...commonVariables, count: formData.count },
        })
      : createEntity({
          variables: {
            ...commonVariables,
            serialNumber: formData.serialNumber,
          },
        });
  };

  const renderFormContent: Config["renderFormContent"] = (formData) => (
    <>
      <Form.Item<FormData>
        label={t("quantity")}
        name="count"
        initialValue={1}
        rules={[{ required: true }]}
      >
        <InputNumber min={1} style={{ width: 120 }} />
      </Form.Item>
      <Form.Item<FormData>
        label={t("asset")}
        name="asset"
        rules={[{ required: !lockedFormData }]}
        initialValue={lockedFormData?.asset}
      >
        <FetchSelect
          renderLabel={({ name }) => name}
          fetchEntities={entitiesFetchers.fetchAssets}
          disabled={!!lockedFormData}
        />
      </Form.Item>
      <Form.Item<FormData>
        hidden={isBatchCount(formData.count)}
        label={t("serialNumber")}
        name="serialNumber"
      >
        <Input />
      </Form.Item>
      <Form.Item<FormData>
        label={t("location")}
        name="location"
        rules={[{ required: !lockedFormData }]}
        initialValue={lockedFormData?.location}
      >
        <FetchSelect
          renderLabel={({ name }) => name}
          fetchEntities={entitiesFetchers.fetchLocations}
          disabled={!!lockedFormData}
        />
      </Form.Item>
      <Form.Item<FormData>
        label={t("responsible")}
        name="responsible"
        rules={[{ required: !lockedFormData }]}
        initialValue={lockedFormData?.responsible}
      >
        <FetchSelect
          renderLabel={({ name }) => name}
          fetchEntities={entitiesFetchers.fetchResponsibles}
          disabled={!!lockedFormData}
        />
      </Form.Item>
      <Form.Item<FormData> label={t("description")} name="description">
        <TextArea autoSize={true} />
      </Form.Item>
    </>
  );

  return { renderFormContent, onApply };
};
