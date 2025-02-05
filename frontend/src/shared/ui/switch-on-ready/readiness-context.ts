import noop from "lodash/noop";
import { createContext } from "react";

export const defaultValue: ReadinessContextValue = {
  register: noop,
  unregister: noop,
  onReady: noop,
};

export interface ReadinessContextValue {
  /** Добавить `id` в список ожидаемых */
  register: (id: string) => void;
  /** Удалить `id` из списка ожидаемых */
  unregister: (id: string) => void;
  /** Сообщить о готовности `id` */
  onReady: (id: string) => void;
}

export const ReadinessContext =
  createContext<ReadinessContextValue>(defaultValue);
