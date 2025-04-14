import { BrowserRouter } from "react-router";
import { LocationsPage } from "@/pages/catalogs/locations";
import { AssetsPage } from "@/pages/catalogs/assets";
import { ResponsiblesPage } from "@/pages/catalogs/responsibles";
import { InventoryRecordsPage } from "@/pages/inventory/inventory-records";
import { UsersPage } from "@/pages/users";
import { SingInPage } from "@/pages/sign-in";
import { InventoryLogsPage } from "@/pages/inventory/inventory-logs";
import { RoutableTabConfig, RoutableTabs } from "@/shared/ui/routable-tabs";
import { ConfigProvider, Layout, message } from "antd";
import { Content } from "antd/es/layout/layout";
import { useTranslation } from "react-i18next";
import { theme } from "antd";
import { SmoothRoutes, ThemeModeSwitch } from "@/shared/ui";
import { useReadinessOnCondition } from "react-when-ready";
import { useCallback, useMemo } from "react";
import {
  hasPermissions,
  Permission,
  ThemeModeContext,
  ThemeMode,
  useLocalStorageState,
  useUnhandledRejections,
  useAntdLocale,
} from "@/shared/lib";
import {
  useCurrentUserWithPrivileges,
  usePermissions,
} from "@/features/current-user-with-privileges";
import { Privilege } from "@/gql/graphql";
import i18n from "./i18n";
import { StatusesPage } from "@/pages/catalogs/statuses";

const Catalog = () => {
  const { t } = useTranslation();

  return (
    <RoutableTabs
      size="small"
      basePath="/catalogs/"
      items={[
        {
          label: t("assets"),
          path: "assets",
          element: <AssetsPage />,
        },
        {
          label: t("locations"),
          path: "locations",
          element: <LocationsPage />,
        },
        {
          label: t("responsibles"),
          path: "responsibles",
          element: <ResponsiblesPage />,
        },

        {
          label: t("statuses"),
          path: "statuses",
          element: <StatusesPage />,
        },
      ]}
    />
  );
};

const Inventory = () => {
  const { t } = useTranslation();

  return (
    <RoutableTabs
      size="small"
      basePath="/inventory/"
      items={[
        {
          label: t("records"),
          path: "records",
          element: <InventoryRecordsPage />,
        },
        {
          label: t("logs"),
          path: "logs",
          element: <InventoryLogsPage />,
        },
      ]}
    />
  );
};

const Administration = () => {
  const { t } = useTranslation();

  return (
    <RoutableTabs
      size="small"
      basePath="/administration/"
      items={[
        {
          label: t("accountManagement"),
          path: "accounts",
          element: <UsersPage />,
        },
      ]}
    />
  );
};

const Workspace = () => {
  const { t } = useTranslation();

  const isCurrentUserLoaded = !!useCurrentUserWithPrivileges();
  useReadinessOnCondition(isCurrentUserLoaded);

  const permissionsToUsers = usePermissions(Privilege.Users);

  const items: RoutableTabConfig[] = [
    {
      label: t("inventory"),
      path: "inventory/*",
      defaultPath: "inventory/records",
      element: <Inventory />,
    },
    {
      label: t("catalogs"),
      path: "catalogs/*",
      defaultPath: "catalogs/assets",
      element: <Catalog />,
    },
  ];

  if (hasPermissions(permissionsToUsers, Permission.READ)) {
    items.push({
      label: t("administration"),
      path: "administration/*",
      defaultPath: "administration/accounts",
      element: <Administration />,
    });
  }

  return <RoutableTabs size="large" basePath="/" items={items} />;
};

const RootPages = () => {
  return (
    <SmoothRoutes
      routes={{ "sign-in": <SingInPage />, "*": <Workspace /> }}
      basePath="/"
    />
  );
};

export const App = () => {
  const locale = useAntdLocale(i18n.language);

  const [themeMode, setThemeMode] = useLocalStorageState<ThemeMode>(
    "theme-mode",
    "light"
  );

  const themeModeContextValue = useMemo(
    () => ({ value: themeMode, onChange: setThemeMode }),
    [themeMode, setThemeMode]
  );

  const [messageApi, messageElement] = message.useMessage();

  useUnhandledRejections(
    useCallback(
      (event) => {
        messageApi.error(String(event.reason));
      },
      [messageApi]
    )
  );

  return (
    <ThemeModeContext.Provider value={themeModeContextValue}>
      <ConfigProvider
        locale={locale}
        theme={{
          algorithm:
            themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        {messageElement}
        <Layout style={{ minHeight: "100%" }}>
          <Content style={{ padding: 16 }}>
            <BrowserRouter>
              <RootPages />
            </BrowserRouter>
          </Content>
          <div style={{ position: "fixed", top: 0, right: 0 }}>
            <ThemeModeSwitch />
          </div>
        </Layout>
      </ConfigProvider>
    </ThemeModeContext.Provider>
  );
};
