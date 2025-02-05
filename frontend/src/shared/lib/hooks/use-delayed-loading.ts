import { useDelayedValue } from "./use-delayed-value";

export const useDelayedLoading = (isLoading: boolean) =>
  useDelayedValue(isLoading, isLoading ? 500 : 0) ?? false;
