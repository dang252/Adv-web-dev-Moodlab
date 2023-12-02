import { TaskType, ColumnType } from "../types/kanban";

export const tasksData: TaskType[] = [
  {
    id: "1",
    columnId: "backlog",
    title: "Task 1",
    description: "des 1",
  },
  {
    id: "2",
    columnId: "backlog",
    title: "Task 2",
    description: "des 2",
  },
  {
    id: "4",
    columnId: "done",
    title: "Task 4",
    description: "des 4",
  },
];

export const columnsData: ColumnType[] = [
  {
    id: "backlog",
    name: "Back log",
    count: 2,
  },
  {
    id: "progress",
    name: "In progress",
    count: 0,
  },
  {
    id: "done",
    name: "Done",
    count: 1,
  },
];
