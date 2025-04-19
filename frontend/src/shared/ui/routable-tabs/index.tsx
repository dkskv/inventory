import { Flex, Tabs } from "antd";
import { matchPath, Navigate, useLocation, useNavigate } from "react-router";
import { SwitchWhenReady } from "../switch-when-ready";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { useLastNonNullable, useMatchedByPath } from "@/shared/lib";

export interface RoutableTabConfig {
  label: string;
  /** Паттерн пути для вкладки относительно basePath */
  path: string;
  /** Явное указание пути по умолчанию, чтобы избежать мерцания при редиректе */
  defaultPath?: string;
  element: React.ReactElement;
}

interface RoutableTabsProps {
  items: RoutableTabConfig[];
  /** Общий путь маршрута для всех items */
  basePath: string;
  /** Размер навигационной панели */
  size: SizeType;
}

export const RoutableTabs: React.FC<RoutableTabsProps> = ({
  items,
  basePath,
  size,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const matchedItem = useMatchedByPath(items, basePath, (item) => item.path);
  const activeItem = useLastNonNullable(matchedItem);

  const findItemByPattern = (p: string) =>
    items.find((item) => p === item.path);

  const getItemPath = (item: RoutableTabConfig) =>
    `${basePath}${item.defaultPath ?? item.path}`;

  return (
    <Flex vertical={true}>
      <Tabs
        activeKey={activeItem?.path}
        onChange={(pattern) => {
          const item = findItemByPattern(pattern);

          if (item) {
            navigate(getItemPath(item));
          }
        }}
        items={items.map(({ label, path }) => ({ label, key: path }))}
        size={size}
      />
      <SwitchWhenReady
        activeKey={activeItem?.path}
        renderByKey={(pattern) => findItemByPattern(pattern)?.element}
      />
      {!matchedItem && items[0] && matchPath(basePath, location.pathname) && (
        <Navigate to={getItemPath(items[0])} />
      )}
    </Flex>
  );
};
