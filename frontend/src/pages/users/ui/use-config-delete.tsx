import { DeleteUserDocument, UserDto } from "@/gql/graphql";
import { ConfigDelete } from "@/shared/ui";
import { useMutation } from "@apollo/client";
import { Form, Input } from "antd";
import identity from "lodash/identity";
import { useTranslation } from "react-i18next";

interface FormData {
  username: string;
  password: string;
}

export const useConfigDelete = (): ConfigDelete<UserDto, FormData> => {
  const { t } = useTranslation();
  const [deleteEntity] = useMutation(DeleteUserDocument);

  return {
    prepareForEditor: identity,
    renderFormContent() {
      return (
        <Form.Item<FormData> label={t("username")} name="username">
          <Input disabled={true} />
        </Form.Item>
      );
    },
    onApply(_, entity) {
      return deleteEntity({ variables: { id: entity.id } });
    },
  };
};
