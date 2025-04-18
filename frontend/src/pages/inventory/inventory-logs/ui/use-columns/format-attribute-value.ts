import { LocationDto, ResponsibleDto, StatusDto } from "@/gql/graphql";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";

const parseJsonIfString = (v: unknown) => (isString(v) ? JSON.parse(v) : v);

export const formatAttributeValue = (
  attribute: string | null | undefined,
  value: string | null | undefined,
  entities: {
    locations: Map<number, LocationDto>;
    responsibles: Map<number, ResponsibleDto>;
    statuses: Map<number, Omit<StatusDto, "color">>;
  }
): string | null | undefined => {
  const pickEntity = <T extends { name: string }>(
    collection: Map<number, T>
  ) => {
    const id = parseJsonIfString(value);

    return isNumber(id) ? collection.get(id)?.name : value;
  };

  if (attribute === "responsibleId") {
    return pickEntity(entities.responsibles);
  }

  if (attribute === "locationId") {
    return pickEntity(entities.locations);
  }

  if (attribute === "statusId") {
    return pickEntity(entities.statuses);
  }

  return parseJsonIfString(value);
};
