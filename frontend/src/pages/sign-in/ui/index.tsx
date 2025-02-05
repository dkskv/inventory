import { useMutation } from "@apollo/client";
import { Button, Flex, Form, Input } from "antd";
import { SignInDocument } from "@/gql/graphql";
import { useNavigate } from "react-router";
import { saveTokens } from "@/shared/api";
import { useTranslation } from "react-i18next";
import { useReadinessOnCondition } from "@/shared/ui";

interface FormData {
  username: string;
  password: string;
}

export const SingInPage = () => {
  const { t } = useTranslation();
  const [login, { loading }] = useMutation(SignInDocument);
  const navigate = useNavigate();

  useReadinessOnCondition(true);

  const handleSubmit = async (values: FormData) => {
    const { data } = await login({
      variables: {
        username: values.username,
        password: values.password,
      },
    });

    if (!data) {
      throw new Error("Failed to get tokens");
    }

    saveTokens(data.signIn);
    navigate("/");
  };

  return (
    <Flex align="center" justify="center" style={{ height: "100%" }}>
      <Form<FormData>
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
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
          rules={[{ required: true }]}
        >
          <Input.Password autoComplete="off" />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t("signIn")}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};
