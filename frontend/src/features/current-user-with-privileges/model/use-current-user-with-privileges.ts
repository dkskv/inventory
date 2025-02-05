import { CurrentUserWithPrivilegesDocument, Privilege } from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

export const useCurrentUserWithPrivileges = () => {
  const data = useQuery(CurrentUserWithPrivilegesDocument).data
    ?.currentUserWithPrivileges;

  return useMemo(() => {
    if (!data) {
      return data;
    }

    return {
      ...data,
      privileges: Object.fromEntries(
        data.privileges.map(({ name, permissions }) => [name, permissions])
      ) as Record<Privilege, number>,
    };
  }, [data]);
};
