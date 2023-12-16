import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button, Card } from "antd";

import { TaskType } from "../../types/kanban";

interface PropType {
  task: TaskType;
  handleDeleteTask: (id: string) => void;
}

const MyTask = (props: PropType) => {
  const { task, handleDeleteTask } = props;

  const id = task.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <Card
      className="w-[100%] cursor-grab"
      title={
        <div className="flex items-center justify-between">
          <p>{task.title}</p>
          <Button
            type="primary"
            danger
            onClick={() => {
              handleDeleteTask(task.id);
            }}
          >
            Delete
          </Button>
        </div>
      }
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex">
        <p>{task.description}</p>
      </div>
    </Card>
  );
};

export default MyTask;
