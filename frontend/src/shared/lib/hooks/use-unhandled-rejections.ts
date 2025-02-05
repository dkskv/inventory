import { useEffect } from "react";

export const useUnhandledRejections = (
  onEvent: (event: PromiseRejectionEvent) => void
) => {
  useEffect(() => {
    const abortController = new AbortController();

    addEventListener("unhandledrejection", onEvent, abortController);

    return () => {
      abortController.abort();
    };
  }, [onEvent]);
};
