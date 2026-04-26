import type { Tag } from "./tags";

export type CreateTask = {
  title: string;
  description?: string;
  listId?: string | number;
  tagIds?: number[];
  dueDate?: string;
};

export type UpdateTask = {
  title?: string;
  description?: string;
  priority?: string;
  dueDate?: string | null;
  isCompleted?: boolean;
  tagIds?: number[];
  listId?: string | number;
};

export type Subtasks = {
  id: string;
  title: string;
  isCompleted: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  listId?: string | number;
  tags?: Tag[];
  dueDate?: string;
  completedAt?: string;
  isCompleted: boolean;
  subTasks?: Subtasks[];
  priority: string;
};

export type TaskSection = {
  title: string;
  tasks: Task[];
  count: number;
  defaultExpanded?: boolean;
  isCompleted?: boolean;
  mode: string | undefined;
  isTrashMode?: boolean;
  handleLoadMore: () => Promise<void>;
  hasNextPage?: boolean;
};
