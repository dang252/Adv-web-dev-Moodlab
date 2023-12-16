import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import { CgNotes } from "react-icons/cg";

import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DropAnimation,
  defaultDropAnimation,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DndContext,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import { TaskType, ColumnType } from "../../types/kanban";
import { columnsData } from "../../utils/task";
import MyColumn from "./MyColumn";
import MyTask from "./MyTask";

const Board = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const username = useSelector<RootState, string>((state) => {
    return state.users.username;
  });

  const columns: ColumnType[] = columnsData;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  const handleSaveKaban = (username: string, data: TaskType[]) => {
    const Kaban = {
      username: username,
      tasks: data,
    };

    localStorage.setItem("kaban", JSON.stringify(Kaban));
  };

  useEffect(() => {
    if (username !== "") {
      const kabanStr = localStorage.getItem("kaban");

      if (kabanStr !== null) {
        const Kaban = JSON.parse(kabanStr);

        setTasks(Kaban.tasks);
      }
    }
  }, [username]);

  const handleCreateTask = (
    columnId: string,
    title: string,
    description: string
  ) => {
    const newTask: TaskType = {
      id: uuidv4(),
      columnId: columnId,
      title: title,
      description: description,
    };

    setTasks([...tasks, newTask]);

    const data = tasks;
    data.push(newTask);

    handleSaveKaban(username, data);

    toast.success("Add task successfully");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(
      tasks.filter((task) => {
        return task.id !== id;
      })
    );

    const data = tasks.filter((task) => {
      return task.id !== id;
    });

    handleSaveKaban(username, data);

    toast.success("Delete task successfully");
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.filter((task) => task.id === active.id)[0]);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeColumnId = active.data.current?.sortable.containerId;
    const activeColumn = columns.filter((col) => col.id === activeColumnId)[0];

    const overColumnId = over.id;
    const overColumn = columns.filter((col) => col.id === overColumnId)[0];

    const overTaskId = over.id;
    const overTask = tasks.filter((task) => task.id === overTaskId)[0];

    if (!activeTask || !activeColumn) return;

    // Drop task over task
    if (overTask && overColumn === undefined && activeTask !== overTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeTask.id);
        const overIndex = tasks.findIndex((t) => t.id === overTask.id);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Drop task over column
    if (overTask === undefined && overColumn && activeColumn !== overColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeTask.id);

        tasks[activeIndex].columnId = overColumn.id;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    console.log(active, over);

    handleSaveKaban(username, tasks);
  };

  const task = activeTask ? activeTask : null;

  return (
    <div className="flex flex-col items-center mb-[200px]">
      <div className="flex items-center gap-5 mb-10 text-2xl font-black">
        <p>What to you want to do?</p>
        <CgNotes />
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="w-[100%] 2xl:w-[80%] pb-4 flex overflow-x-auto gap-10">
          {columns?.map((col) => {
            return (
              <MyColumn
                key={col.id}
                column={col}
                handleCreateTask={handleCreateTask}
                handleDeleteTask={handleDeleteTask}
                tasks={tasks.filter((task) => task.columnId === col.id)}
              />
            );
          })}
          <DragOverlay dropAnimation={dropAnimation}>
            {task ? (
              <MyTask handleDeleteTask={handleDeleteTask} task={task} />
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
};

export default Board;
