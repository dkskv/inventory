import { usePasswordValidators } from "@/entities/user";
import { UpdatePasswordDocument, UserDto } from "@/gql/graphql";
import { ConfigUpdate } from "@/shared/ui";
import { useMutation } from "@apollo/client";
import { Form, Input } from "antd";
import identity from "lodash/identity";
import { useTranslation } from "react-i18next";

interface FormData {
  username: string;
  password: string;
}

export const useConfigUpdate = (): ConfigUpdate<UserDto, FormData> => {
  const { t } = useTranslation();
  const passwordValidators = usePasswordValidators();
  const [updatePassword] = useMutation(UpdatePasswordDocument);

  return {
    prepareForEditor: identity,
    autoFocusFieldName: "password",
    renderFormContent: () => (
      <>
        <Form.Item<FormData> label={t("username")} name="username">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item<FormData>
          label={t("password")}
          name="password"
          rules={[{ required: true }, ...passwordValidators]}
        >
          <Input.Password autoComplete="off" />
        </Form.Item>
      </>
    ),
    onApply(editorValue, entity) {
      return updatePassword({
        variables: { id: entity.id, password: editorValue.password },
      });
    },
  };
};
