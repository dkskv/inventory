import { useEffect, useState } from "react";

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  stringify: (value: T) => string = JSON.stringify,
  restore: (str: string) => T = JSON.parse
): [T, (value: T | ((prevValue: T) => T)) => void] {
  const getInitialValue = (): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? restore(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  };

  const [state, setState] = useState(getInitialValue);

  useEffect(() => {
    try {
      localStorage.setItem(key, stringify(state));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [key, state, stringify]);

  return [state, setState] as const;
}
