import { Privilege } from "@/gql/graphql";
import { useCurrentUserWithPrivileges } from "./use-current-user-with-privileges";

export const usePermissions = (privilege: Privilege) =>
  useCurrentUserWithPrivileges()?.privileges?.[privilege] ?? 0;
