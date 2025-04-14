import { Spin } from "antd";
import {
  SwitchWhenReady as SwitchWhenReadyLib,
  SwitchWhenReadyProps,
} from "react-when-ready";

export const SwitchWhenReady = <T extends string>(
  props: Omit<SwitchWhenReadyProps<T>, "loaderDelay" | "renderWithLoader">
) => {
  return (
    <SwitchWhenReadyLib<T>
      {...props}
      loaderDelay={500}
      renderWithLoading={({ isShowLoading, content }) => (
        <Spin spinning={isShowLoading}>{content}</Spin>
      )}
    />
  );
};
