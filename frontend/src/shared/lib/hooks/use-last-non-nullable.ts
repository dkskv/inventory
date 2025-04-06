import { useEffect, useRef } from "react";

export const useLastNonNullable = <T>(value: T) => {
  const cached = useRef(value);

  useEffect(() => {
    if (value) {
      cached.current = value;
    }
  }, [value]);

  return value ?? cached.current;
};
