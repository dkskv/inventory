import { OverCell } from "@/shared/ui";
import ArrowLeftOutlined from "@ant-design/icons/lib/icons/ArrowLeftOutlined";
import { Button } from "antd";
import { ColumnType } from "antd/es/table";
import identity from "lodash/identity";

interface Params<T, G> {
  isGroup: (item: T | G) => item is G;
  renderTitle?: (defaultTitle: string) => React.ReactNode;
  renderValue: (item: T) => React.ReactNode;
  activeGroup: G | undefined;
  setActiveGroup: (group: G | undefined) => void;
}

export const usePrimaryColumn = <T, G extends { count: number }>({
  isGroup,
  renderTitle = identity,
  renderValue,
  activeGroup,
  setActiveGroup,
}: Params<T, G>): ColumnType<{ entity: T | G }> => {
  return {
    fixed: "left",
    key: "id",
    width: 80,
    title: () =>
      activeGroup ? (
        <OverCell justify="center">
          <Button
            size="small"
            variant="outlined"
            color="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => setActiveGroup(undefined)}
          />
        </OverCell>
      ) : (
        renderTitle("id")
      ),
    align: "center",
    render(_, { entity }) {
      if (isGroup(entity)) {
        return (
          <OverCell justify="center">
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => {
                setActiveGroup(entity);
              }}
            >
              x{entity.count}
            </Button>
          </OverCell>
        );
      }

      return renderValue(entity);
    },
  };
};
