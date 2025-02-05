import { useLazyQuery } from "@apollo/client";
import { PagingInput, UsersDocument } from "@/gql/graphql";
import { EntityCrud } from "@/shared/ui";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useConfigCreate } from "./use-config-create";
import { useConfigUpdate } from "./use-config-update";
import { useConfigDelete } from "./use-config-delete";
import { Tag } from "antd";
import capitalize from "lodash/capitalize";

export function UsersPage() {
  const { t } = useTranslation();
  const [executeQuery] = useLazyQuery(UsersDocument, {
    fetchPolicy: "network-only",
  });

  const read = useCallback(
    (paging: PagingInput) =>
      executeQuery({
        variables: { paging },
      }).then(({ data }) => data!.users),
    [executeQuery]
  );

  const configCreate = useConfigCreate();
  const configUpdate = useConfigUpdate();
  const configDelete = useConfigDelete();

  return (
    <EntityCrud
      read={read}
      columns={[
        {
          key: "username",
          title: t("username"),
          render(_value, record) {
            return record.entity.username;
          },
        },
        {
          key: "accessRole",
          title: t("accessRole"),
          render(_value, record) {
            return <Tag>{capitalize(record.entity.accessRole)}</Tag>;
          },
        },
      ]}
      configCreate={configCreate}
      configUpdate={configUpdate}
      configDelete={configDelete}
      getKey={(entity) => String(entity.id)}
    />
  );
}
