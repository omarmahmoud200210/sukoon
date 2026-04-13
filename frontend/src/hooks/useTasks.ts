import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type InfiniteData,
} from "@tanstack/react-query";
import { taskService } from "@/services";
import type { Task, UpdateTask } from "@/types";
import {
  onCreateTaskError,
  onUpdateTaskError,
  onRestoreTaskError,
  onDeleteTaskError,
} from "@/errors/tasks.errors";

interface TasksPage {
  completedTasks?: Task[];
  notCompletedTasks?: Task[];
  nextCursor?: number;
}

interface UpdateTaskParams {
  id: string;
  data: UpdateTask;
}

type QueryData = InfiniteData<TasksPage> | Task[] | undefined;

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (cursor: number | undefined, limit: number) =>
    [...taskKeys.lists(), { cursor, limit }] as const,
  infinite: () => [...taskKeys.lists()] as const,
  details: () => [...taskKeys.all, "details"] as const,
  detail: (taskId: string | number) =>
    [...taskKeys.details(), taskId.toString()] as const,
  today: () => [...taskKeys.all, "today"] as const,
  upcoming: () => [...taskKeys.all, "upcoming"] as const,
  overdue: () => [...taskKeys.all, "overdue"] as const,
  trash: () => [...taskKeys.all, "trash"] as const,
};

export function useTasks(cursor?: number, limit: number = 10) {
  return useInfiniteQuery({
    queryKey: taskKeys.list(cursor, limit),
    initialPageParam: cursor,

    getNextPageParam: (lastPage: {
      completedTasks?: Task[];
      notCompletedTasks?: Task[];
      nextCursor?: number;
    }) => {
      const totalTasksCount =
        (lastPage.completedTasks?.length || 0) +
        (lastPage.notCompletedTasks?.length || 0);
      if (totalTasksCount < limit) {
        return undefined;
      }
      return lastPage.nextCursor;
    },

    queryFn: ({ pageParam }) => taskService.getAllTasks(pageParam, limit),
  });
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => taskService.getTaskById(taskId),
    enabled: !!taskId,
  });
}

export function useTodayTasks() {
  return useQuery({
    queryKey: taskKeys.today(),
    queryFn: () => taskService.getTodayTasks(),
  });
}

export function useUpcomingTasks() {
  return useQuery({
    queryKey: taskKeys.upcoming(),
    queryFn: () => taskService.getUpcomingTasks(),
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

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTaskParams) =>
      taskService.updateTask(id, data),

    onMutate: async ({ id, data }: UpdateTaskParams) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueriesData<InfiniteData<TasksPage>>(
        {
          queryKey: ["tasks"],
        },
      );

      queryClient.setQueriesData(
        { queryKey: ["tasks"] },
        (oldData: QueryData | undefined) => {
          if (!oldData) return oldData;

          if (Object.hasOwn(oldData, "pages")) {
            const infiniteData = oldData as InfiniteData<TasksPage>;

            return {
              ...infiniteData,
              pages: infiniteData.pages.map((page: TasksPage) => {
                const updateInList = (list: Task[] | undefined) => {
                  if (!list) return list;
                  return list.map((task) =>
                    String(task.id) === String(id)
                      ? { ...task, ...data }
                      : task,
                  );
                };

                return {
                  ...page,
                  notCompletedTasks: updateInList(page.notCompletedTasks),
                  completedTasks: updateInList(page.completedTasks),
                };
              }),
            };
          }

          if (Array.isArray(oldData)) {
            return oldData.map((task) =>
              String(task.id) === String(id) ? { ...task, ...data } : task,
            );
          }

          return oldData;
        },
      );

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
