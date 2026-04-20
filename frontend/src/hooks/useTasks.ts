import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services";
import type { Task, UpdateTask } from "@/types";
import {
  onCreateTaskError,
  onUpdateTaskError,
  onRestoreTaskError,
  onDeleteTaskError,
} from "@/errors/tasks.errors";

interface UpdateTaskParams {
  id: string;
  data: UpdateTask;
}

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  listTasks: (listId: string | number, status?: string) =>
    [...taskKeys.lists(), listId.toString(), status] as const,
  tags: () => [...taskKeys.all, "tag"] as const,
  tagTasks: (tagId: string | number, status?: string) =>
    [...taskKeys.tags(), tagId.toString(), status] as const,
  pending: () => [...taskKeys.all, "pending"] as const,
  completed: () => [...taskKeys.all, "completed"] as const,
  details: () => [...taskKeys.all, "details"] as const,
  detail: (taskId: string | number) =>
    [...taskKeys.details(), taskId.toString()] as const,
  today: (status?: string) => [...taskKeys.all, "today", status] as const,
  upcoming: (status?: string) => [...taskKeys.all, "upcoming", status] as const,
  overdue: () => [...taskKeys.all, "overdue"] as const,
  trash: () => [...taskKeys.all, "trash"] as const,
};

export function usePendingTasks(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: taskKeys.pending(),
    queryFn: () => taskService.getPendingTasks(),
    enabled: options?.enabled,
  });
}

export function useCompletedTasks(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: taskKeys.completed(),
    queryFn: () => taskService.getCompletedTasks(),
    enabled: options?.enabled,
  });
}

export function useListTasks(
  listId?: string | number,
  status?: "pending" | "completed" | "all",
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: listId
      ? taskKeys.listTasks(listId, status)
      : [...taskKeys.lists(), status],
    queryFn: () =>
      listId ? taskService.getTasksByList(listId, status) : Promise.resolve([]),
    enabled: !!listId && options?.enabled !== false,
  });
}

export function useTagTasks(
  tagId?: number,
  status?: "pending" | "completed" | "all",
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: tagId
      ? taskKeys.tagTasks(tagId, status)
      : [...taskKeys.tags(), status],
    queryFn: () =>
      tagId ? taskService.getTasksByTag(tagId, status) : Promise.resolve([]),
    enabled: !!tagId && options?.enabled !== false,
  });
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => taskService.getTaskById(taskId),
    enabled: !!taskId,
  });
}

export function useTodayTasks(
  status?: "pending" | "completed" | "all",
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: taskKeys.today(status),
    queryFn: () => taskService.getTodayTasks(status),
    enabled: options?.enabled !== false,
  });
}

export function useUpcomingTasks(
  status?: "pending" | "completed" | "all",
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: taskKeys.upcoming(status),
    queryFn: () => taskService.getUpcomingTasks(status),
    enabled: options?.enabled !== false,
  });
}

export function useOverdueTasks() {
  return useQuery({
    queryKey: taskKeys.overdue(),
    queryFn: () => taskService.getOverdueTasks(),
  });
}

export function useTrashTasks() {
  return useQuery({
    queryKey: taskKeys.trash(),
    queryFn: () => taskService.getTrashTasks(),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: onCreateTaskError,
  });
}

export function useCreateTodayTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.createTodayTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: onCreateTaskError,
  });
}

export function useCreateUpcomingTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.createUpcomingTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: onCreateTaskError,
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTaskParams) =>
      taskService.updateTask(id, data),

    onMutate: async ({ id, data }: UpdateTaskParams) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueriesData({
        queryKey: ["tasks"],
      });

      queryClient.setQueriesData({ queryKey: ["tasks"] }, (oldData: any) => {
        if (!oldData) return oldData;

        if (Array.isArray(oldData)) {
          return oldData.map((task: Task) =>
            String(task.id) === String(id) ? { ...task, ...data } : task,
          );
        }

        return oldData;
      });

      return { previousTasks };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        for (const [key, data] of context.previousTasks) {
          queryClient.setQueryData(key, data);
        }
      }
      onUpdateTaskError();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useRestoreTrashTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.restoreTrashTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: onRestoreTaskError,
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: onDeleteTaskError,
  });
}

export function useDeleteTrashTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.deleteTrashTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: onDeleteTaskError,
  });
}
