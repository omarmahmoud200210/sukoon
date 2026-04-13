import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as subTaskService from "@/services/subTaskService";
import { taskKeys } from "@/hooks/useTasks";
import {
  onCreateSubtaskError,
  onUpdateSubtaskError,
  onDeleteSubtaskError,
} from "@/errors/subtasks.errors";


export const subtaskKeys = {
  all: ["subtasks"] as const,
  lists: () => [...subtaskKeys.all, "list"] as const,
  list: (taskId: string) => [...subtaskKeys.lists(), taskId] as const,
};

export function useSubtasks(taskId: string) {
  return useQuery({
    queryKey: subtaskKeys.list(taskId),
    queryFn: () => subTaskService.getAllSubTasks(taskId),
    enabled: !!taskId,
  });
}

export function useCreateSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subTaskService.createSubtask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subtaskKeys.list(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: onCreateSubtaskError,
  });
}

export function useUpdateSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subTaskService.updateSubtasks,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subtaskKeys.list(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: onUpdateSubtaskError,
  });
}

export function useDeleteSubtask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subTaskService.deleteSubtask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: subtaskKeys.list(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: onDeleteSubtaskError,
  });
}
