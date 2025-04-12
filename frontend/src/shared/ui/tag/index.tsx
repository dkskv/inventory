import { isColorDark } from "@/shared/lib";
import { Tag as AntDTag } from "antd";

interface Props {
  /** Цвет в формате hex */
  color: string;
  children: string;
}

export const Tag: React.FC<Props> = ({ color, children }) => {
  return (
    <AntDTag
      style={{ color: isColorDark(color) ? undefined : "black", margin: 0 }}
      color={color}
    >
      {children}
    </AntDTag>
  );
};
