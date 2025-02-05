import noop from "lodash/noop";
import { createContext } from "react";

export type ThemeMode = "light" | "dark";

interface ThemeModeContextValue {
  value: ThemeMode;
  onChange(theme: ThemeMode): void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue>({
  value: "dark",
  onChange: noop,
});
