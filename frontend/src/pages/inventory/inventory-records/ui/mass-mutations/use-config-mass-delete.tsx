import { DeleteInventoryRecordsBatchDocument } from "@/gql/graphql";
import { useFormEditor } from "@/shared/ui";
import { useMutation } from "@apollo/client";
import { Form, InputNumber } from "antd";
import { useTranslation } from "react-i18next";

type FormData = {
  count: number;
};

export const useConfigMassDelete = (
  selectedIds: number[] | undefined,
  onAfterSave: () => void
) => {
  const { t } = useTranslation();

  const [deleteEntitiesBatch] = useMutation(
    DeleteInventoryRecordsBatchDocument
  );

  const onApply = () =>
    editor.open({
      initialValue: {},
      additionalData: null,
      onSave: async () => {
        if (!selectedIds) {
          return;
        }

        await deleteEntitiesBatch({
          variables: { ids: selectedIds.map(Number) },
        }).then(onAfterSave);
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
      </>
    );
  };

  const editor = useFormEditor<FormData, null>({
    name: "DELETE",
    okText: t("delete"),
    title: t("deletion"),
    renderFormContent,
    okButtonProps: {
      color: "danger",
      variant: "solid",
    },
  });

  return { editorElement: editor.element, onApply } as const;
};
