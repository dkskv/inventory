import { useCallback, useState } from "react";
import { Spin } from "antd";
import { useDelayedLoading } from "@/shared/lib";
import { ReadinessPendingProvider } from "./readiness-pending-provider";

interface Props<Key extends string> {
  activeKey: Key | undefined;
  renderByKey: (key: Key) => React.ReactNode;
}

/** Компонент для плавного переключения между UI-компонентами с обработкой готовности контента */
export const SwitchOnReady = <Key extends string>({
  activeKey,
  renderByKey,
}: Props<Key>) => {
  const [lastReadyKey, setLastReadyKey] = useState<Key>();

  /** Ключ контента, отображаемого вместо готовящегося активного контента */
  const placeholderKey = activeKey === lastReadyKey ? undefined : lastReadyKey;

  const handleActiveReady = useCallback(
    () => setLastReadyKey(activeKey),
    [activeKey]
  );

  const hasPlaceholder = placeholderKey !== undefined;
  const hasActive = activeKey !== undefined;

  const isActiveLoading = hasPlaceholder || lastReadyKey === undefined;
  const isShowLoading = useDelayedLoading(isActiveLoading);

  return (
    <Spin spinning={isShowLoading}>
      {hasActive && (
        <ReadinessPendingProvider key={activeKey} onReady={handleActiveReady}>
          <div style={{ display: isActiveLoading ? "none" : undefined }}>
            {renderByKey(activeKey)}
          </div>
        </ReadinessPendingProvider>
      )}
      {hasPlaceholder && (
        <ReadinessPendingProvider key={placeholderKey}>
          <div>{renderByKey(placeholderKey)}</div>
        </ReadinessPendingProvider>
      )}
    </Spin>
  );
};
