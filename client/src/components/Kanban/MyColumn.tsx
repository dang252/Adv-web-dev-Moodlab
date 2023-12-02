import { useDroppable } from "@dnd-kit/core";
import { TaskType, ColumnType } from "../../types/kanban";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import MyTask from "./MyTask";

interface PropType {
  column: ColumnType;
  tasks: TaskType[];
}

const MyColumn = (props: PropType) => {
  const { column, tasks } = props;

  const id = column.id;

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.users.isDarkMode
  );

  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      className={`w-[400px] flex flex-col items-center rounded-md ${
        isDarkMode ? "bg-zinc-800" : "bg-zinc-200"
      }`}
    >
      <div className="w-[100%] p-4">
        {column.id === "backlog" && (
          <Tag icon={<ClockCircleOutlined />} color="error">
            waiting
          </Tag>
        )}
        {column.id === "progress" && (
          <Tag icon={<SyncOutlined spin />} color="processing">
            processing
          </Tag>
        )}
        {column.id === "done" && (
          <Tag icon={<CheckCircleOutlined />} color="success">
            success
          </Tag>
        )}
      </div>
      <SortableContext
        id={id}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="w-[100%] p-4 flex flex-col gap-3">
          {tasks.map((task) => (
            <div key={task.id}>
              <MyTask task={task} />
            </div>
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default MyColumn;
