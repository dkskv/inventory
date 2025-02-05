import { usePasswordValidators } from "@/entities/user";
import { SignUpDocument } from "@/gql/graphql";
import { ConfigCreate } from "@/shared/ui";
import { useMutation } from "@apollo/client";
import { Form, Input } from "antd";
import { useTranslation } from "react-i18next";

interface FormData {
  username: string;
  password: string;
}

export const useConfigCreate = (): ConfigCreate<FormData> => {
  const { t } = useTranslation();
  const passwordValidators = usePasswordValidators();
  const [createEntity] = useMutation(SignUpDocument);

  return {
    autoFocusFieldName: "username",
    renderFormContent() {
      return (
        <>
          <Form.Item<FormData>
            label={t("username")}
            name="username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FormData>
            label={t("password")}
            name="password"
            rules={[{ required: true }, ...passwordValidators]}
          >
            <Input.Password autoComplete="off" />
          </Form.Item>
        </>
      );
    },
    onApply(editorValue) {
      return createEntity({ variables: editorValue });
    },
  };
};
