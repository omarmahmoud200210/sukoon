import { Priority } from "@prisma/client";

export interface CreateTaskRequest {
  userId: number;
  title: string;
  description?: string;
  listId?: number;
  priority?: Priority;
  dueDate?: string;
  tagIds?: number;
  position?: number;
}
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  listId?: number;
  dueDate?: string;
  isCompleted?: boolean;
  tagIds?: number[];
  position?: number;
}

export interface SubTasksType {
    title?: string,
    isCompleted?: boolean,
}

export interface PaginationQuery {
  cursor?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: number | null;
  hasNextPage: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}
