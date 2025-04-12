import { ColorPicker, ColorPickerProps } from "antd";
import { type FC } from "react";

interface Props
  extends Omit<ColorPickerProps, "value" | "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onChange?: (hexColor: string) => string;
}

export const ColorPickerField: FC<Props> = ({ onChange, ...restProps }) => (
  <ColorPicker
    allowClear={false}
    showText
    disabledAlpha
    {...restProps}
    onChange={(v) => onChange?.(v.toHexString())}
  />
);
