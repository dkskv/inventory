import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import { Button, Flex, Input } from "antd";
import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const ToggleSearch: React.FC<Props> = ({ value, onChange, label }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Flex gap="small">
      {isActive ? (
        <Input
          placeholder={label}
          autoFocus={true}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setIsActive(false);
          }}
          allowClear={true}
        />
      ) : (
        <>
          {label}
          <Button
            size="small"
            type={value.trim() === "" ? "default" : "primary"}
            onClick={() => setIsActive(true)}
          >
            <SearchOutlined />
          </Button>
        </>
      )}
    </Flex>
  );
};
