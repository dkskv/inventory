import FilterOutlined from "@ant-design/icons/lib/icons/FilterOutlined";
import { Button, Flex, Popover } from "antd";

interface Props {
  isActive: boolean;
  renderContent: () => React.ReactNode;
  children: React.ReactNode;
}

export const FilterPopover: React.FC<Props> = ({
  isActive,
  renderContent,
  children,
}) => {
  return (
    <Flex gap="small" align="center">
      {children}
      <Popover
        trigger="click"
        overlayStyle={{ width: 300 }}
        placement="bottom"
        content={() => <Flex vertical={true}>{renderContent()}</Flex>}
      >
        <Button size="small" type={isActive ? "primary" : "default"}>
          <FilterOutlined />
        </Button>
      </Popover>
    </Flex>
  );
};
