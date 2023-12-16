import { useDroppable } from "@dnd-kit/core";
import { TaskType, ColumnType } from "../../types/kanban";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button, Tag } from "antd";
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
  handleCreateTask: (
    columnId: string,
    title: string,
    description: string
  ) => void;
  handleDeleteTask: (id: string) => void;
}

const MyColumn = (props: PropType) => {
  const { column, tasks, handleCreateTask, handleDeleteTask } = props;

  const id = column.id;

  const isDarkMode = useSelector<RootState, boolean | undefined>(
    (state) => state.users.isDarkMode
  );

  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      className={`min-w-[350px] min-h-[500px] max-h-[500px] overflow-y-auto flex flex-col items-center rounded-md ${
        isDarkMode ? "bg-zinc-800" : "bg-zinc-200"
      }`}
    >
      <div className="w-[100%] p-4 flex items-center justify-between">
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

        <Button
          type="primary"
          onClick={() => {
            const title = prompt(`Add new task title for: ${id}`);
            const description = prompt(`Description of task:`);

            if (column.id && title && description) {
              handleCreateTask(column.id, title, description);
            }
          }}
        >
          Add
        </Button>
      </div>
      <SortableContext
        id={id}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="w-[100%] p-4 flex flex-col gap-3">
          {tasks.map((task) => (
            <div key={task.id}>
              <MyTask task={task} handleDeleteTask={handleDeleteTask} />
            </div>
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default MyColumn;
