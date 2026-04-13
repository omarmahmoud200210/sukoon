import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as commentService from "@/services/commentService";
import { taskKeys } from "@/hooks/useTasks";
import type { UpdateComment } from "@/types/comments";
import {
  onCreateCommentError,
  onUpdateCommentError,
  onDeleteCommentError,
} from "@/errors/comments.errors";

export const commentKeys = {
  all: ["comments"] as const,
  comments: () => [...commentKeys.all, "comment"] as const,
  comment: (taskId: string | number) => [...commentKeys.comments(), taskId.toString()] as const,
};

export function useComments(taskId: string | number) {
  return useQuery({
    queryKey: commentKeys.comment(taskId),
    queryFn: () => commentService.getCommentsByTaskId(taskId.toString()),
    enabled: !!taskId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: commentService.createComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.comment(variables.taskId.toString()),
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.taskId.toString()),
      });
    },
    onError: onCreateCommentError,
  });
}

export function useUpdateComment(taskId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateComment }) =>
      commentService.updateComment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.comment(taskId) });
    },
    onError: onUpdateCommentError,
  });
}

export function useDeleteComment(taskId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commentService.deleteComment(taskId.toString(), id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.comment(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
    onError: onDeleteCommentError,
  });
}
