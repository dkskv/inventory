import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createPasswordSchema } from "../model";
import { ZodSchema } from "zod";
import { Rule } from "antd/es/form";

const zodSchemaToAntdRules = <T>(schema: ZodSchema<T>) => {
  return [
    {
      validator: async (_: unknown, value: T) => {
        const result = schema.safeParse(value);

        if (!result.success) {
          throw new Error(result.error.errors[0].message);
        }
      },
    },
  ];
};

export const usePasswordValidators = (): Rule[] => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      zodSchemaToAntdRules(
        createPasswordSchema((key) => t(`validation.password.${key}`))
      ),
    [t]
  );
};
