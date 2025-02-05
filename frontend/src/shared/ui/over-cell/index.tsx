import { Flex, FlexProps } from "antd";

export const OverCell: React.FC<Omit<FlexProps, "style" | "align">> = (
  props
) => <Flex {...props} style={{ height: 0 }} align="center" />;
