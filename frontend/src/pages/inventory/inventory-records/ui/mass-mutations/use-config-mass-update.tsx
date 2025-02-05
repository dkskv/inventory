import {
  LocationDto,
  ResponsibleDto,
  UpdateInventoryRecordsBatchDocument,
} from "@/gql/graphql";
import { useFormEditor, FetchSelect } from "@/shared/ui";
import { useMutation } from "@apollo/client";
import { Form, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import { CatalogEntitiesFetchers } from "../../api";
import TextArea from "antd/es/input/TextArea";

type FormData = {
  count: number;
  location: LocationDto;
  responsible: ResponsibleDto;
  description?: string;
};

export const useConfigMassUpdate = (
  selectedIds: number[] | undefined,
  entitiesFetchers: Pick<
    CatalogEntitiesFetchers,
    "fetchLocations" | "fetchResponsibles"
  >,
  onAfterSave: () => void
) => {
  const { t } = useTranslation();

  const [updateEntitiesBatch] = useMutation(
    UpdateInventoryRecordsBatchDocument
  );

  const onApply = () =>
    editor.open({
      initialValue: {},
      additionalData: null,
      onSave: async (formData) => {
        if (!selectedIds) {
          return;
        }

        await updateEntitiesBatch({
          variables: {
            ids: selectedIds,
            locationId: formData.location?.id,
            responsibleId: formData.responsible?.id,
            description: formData.description,
          },
        }).then(() => onAfterSave());
      },
    });

  const renderFormContent = () => {
    if (!selectedIds) {
      return;
    }

    return (
      <>
        <Form.Item<FormData>
          label={t("quantity")}
          name="count"
          initialValue={selectedIds.length}
        >
          <InputNumber disabled={true} style={{ width: 120 }} />
        </Form.Item>
        <Form.Item<FormData> label={t("location")} name="location">
          <FetchSelect
            renderLabel={({ name }) => name}
            fetchEntities={entitiesFetchers.fetchLocations}
          />
        </Form.Item>
        <Form.Item<FormData> label={t("responsible")} name="responsible">
          <FetchSelect
            renderLabel={({ name }) => name}
            fetchEntities={entitiesFetchers.fetchResponsibles}
          />
        </Form.Item>
        <Form.Item<FormData> label={t("description")} name="description">
          <TextArea />
        </Form.Item>
      </>
    );
  };

  const editor = useFormEditor<FormData, null>({
    name: "UPDATE",
    okText: t("updateVerb"),
    title: t("updateNoun"),
    renderFormContent,
  });

  return { editorElement: editor.element, onApply } as const;
};
