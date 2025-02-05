import { useMatchedPath } from "@/shared/lib";
import { SwitchOnReady } from "../switch-on-ready";

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
    <SwitchOnReady
      activeKey={activeRouteKey}
      renderByKey={(key) => routes[key]}
    />
  );
};
