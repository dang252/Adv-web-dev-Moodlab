export interface TaskType {
  id: string;
  columnId: string;
  title: string;
  description: string;
}

export interface ColumnType {
  id: string;
  name: string;
  count: number;
}
