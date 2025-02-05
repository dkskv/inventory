import { useLayoutEffect, useRef } from "react";

export const useConditionalLayoutEffect = (
  condition: boolean,
  effect: () => void,
  isOnce = true
) => {
  const isTriggered = useRef(false);

  useLayoutEffect(() => {
    if (!condition) {
      return;
    }

    if (isOnce && isTriggered.current) {
      return;
    }

    isTriggered.current = true;
    effect();
  });
};
