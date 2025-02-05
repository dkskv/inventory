import { useCallback, useMemo, useRef } from "react";
import { ReadinessContext, ReadinessContextValue } from "./readiness-context";
import noop from "lodash/noop";
import { useReadinessReporter } from "./use-readiness-reporter";

interface Props {
  children: React.ReactNode;
  onReady?: () => void;
}

// todo: test
// case 1: при отмене ожидания единственного элемента общее ожидание не завершается.
// case 2: при отмене ожидания последнего неготового элемента общее ожидание завершается, если был хотя бы 1 готовый элемент.
// case 3: после получения общего состояния готовности вызовы методов из дочерних элементов ни на что не влияют.
export const ReadinessPendingProvider: React.FC<Props> = ({
  children,
  onReady: onReadyProps = noop,
}) => {
  const onReady = useReadinessReporter();

  /** Id ожидаемых дочерних элементов */
  const pendingIds = useRef(new Set<string>());
  /** Было ли получено общее состояние готовности */
  const wasReady = useRef(false);
  /** Был ли готов хотя бы 1 дочерний элемент */
  const wasSomeReady = useRef(false);

  const handleReady = useCallback(() => {
    wasReady.current = true;
    onReady();
    onReadyProps();
  }, [onReady, onReadyProps]);

  const contextValue = useMemo<ReadinessContextValue>(
    () => ({
      register(id: string) {
        if (wasReady.current) {
          return;
        }

        pendingIds.current.add(id);
      },
      unregister(id: string) {
        if (wasReady.current) {
          return;
        }

        pendingIds.current.delete(id);

        if (wasSomeReady.current && pendingIds.current.size === 0) {
          handleReady();
        }
      },
      onReady: (id: string) => {
        if (wasReady.current) {
          return;
        }

        wasSomeReady.current = true;
        pendingIds.current.delete(id);

        if (pendingIds.current.size === 0) {
          handleReady();
        }
      },
    }),
    [handleReady]
  );

  return (
    <ReadinessContext.Provider value={contextValue}>
      {children}
    </ReadinessContext.Provider>
  );
};
