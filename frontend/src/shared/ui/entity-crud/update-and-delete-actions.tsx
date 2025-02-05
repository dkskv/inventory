import { Button } from "antd";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";

export const UpdateAndDeleteActions: React.FC<{
  onUpdate?: () => void;
  onDelete?: () => void;
}> = (props) => (
  <>
    {props.onUpdate && (
      <Button color="primary" variant="text" onClick={props.onUpdate}>
        <EditOutlined />
      </Button>
    )}
    {props.onDelete && (
      <Button color="danger" variant="text" onClick={props.onDelete}>
        <DeleteOutlined />
      </Button>
    )}
  </>
);
