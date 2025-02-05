import { useCallback, useContext, useId, useLayoutEffect } from "react";
import { ReadinessContext } from "./readiness-context";

export const useReadinessReporter = () => {
  const id = useId();
  const { onReady, register, unregister } = useContext(ReadinessContext);

  useLayoutEffect(() => {
    register(id);

    return () => unregister(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useCallback(() => onReady(id), [id, onReady]);
};
