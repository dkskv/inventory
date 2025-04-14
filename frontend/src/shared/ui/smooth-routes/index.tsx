import { useMatchedPath } from "@/shared/lib";
import { SwitchWhenReady } from "../switch-when-ready";

interface SmoothRoutesProps<Pattern extends string> {
  basePath: string;
  routes: Record<Pattern, React.ReactNode>;
}

export const SmoothRoutes = <Pattern extends string>({
  basePath,
  routes,
}: SmoothRoutesProps<Pattern>) => {
  const routesPatterns = Object.keys(routes) as Pattern[];
  const activeRouteKey = useMatchedPath(routesPatterns, basePath);

  return (
    <SwitchWhenReady
      activeKey={activeRouteKey}
      renderByKey={(key) => routes[key]}
    />
  );
};
