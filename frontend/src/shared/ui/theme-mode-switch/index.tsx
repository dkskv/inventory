import { ThemeModeContext } from "@/shared/lib";
import MoonOutlined from "@ant-design/icons/lib/icons/MoonOutlined";
import SunOutlined from "@ant-design/icons/lib/icons/SunOutlined";
import { Button } from "antd";
import { useContext } from "react";

export const ThemeModeSwitch: React.FC = () => {
  const { value, onChange } = useContext(ThemeModeContext);

  return (
    <Button
      size="small"
      color="primary"
      variant="text"
      onClick={() => onChange(value === "light" ? "dark" : "light")}
    >
      {value === "dark" ? <SunOutlined /> : <MoonOutlined />}
    </Button>
  );
};
