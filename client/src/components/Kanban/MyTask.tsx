import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Card } from "antd";

import { TaskType } from "../../types/kanban";

interface PropType {
  task: TaskType;
}

const MyTask = (props: PropType) => {
  const { task } = props;

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
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {task.title}
    </Card>
  );
};

export default MyTask;
