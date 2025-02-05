import { useConditionalLayoutEffect } from "@/shared/lib";
import { useReadinessReporter as useReadinessReporter } from "./use-readiness-reporter";

export const useReadinessOnCondition = (condition: boolean) => {
  const onReady = useReadinessReporter();

  useConditionalLayoutEffect(condition, onReady);
};
