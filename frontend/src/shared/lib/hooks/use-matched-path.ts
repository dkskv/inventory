import identity from "lodash/identity";
import { matchPath, useLocation } from "react-router";

export const useMatchedPath = <Pattern extends string>(
  paths: Pattern[],
  basePath: string
) => {
  return useMatchedByPath(paths, basePath, identity);
};

export const useMatchedByPath = <Pattern extends string, Container>(
  items: Container[],
  basePath: string,
  extractPath: (item: Container) => Pattern
) => {
  const location = useLocation();

  return items.find((item) =>
    matchPath(`${basePath}${extractPath(item)}`, location.pathname)
  );
};
