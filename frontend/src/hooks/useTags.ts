import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as tagService from "@/services/tagService";
import {
  onCreateTagError,
  onUpdateTagError,
  onDeleteTagError,
} from "@/errors/tags.errors";

export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
  details: () => [...tagKeys.all, "details"] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
};

export function useTags() {
  return useQuery({
    queryKey: tagKeys.lists(),
    queryFn: tagService.getAllTags,
  });
}

export function useTag(tagId: string) {
  return useQuery({
    queryKey: tagKeys.detail(tagId),
    queryFn: () => tagService.getTagById(tagId),
    enabled: !!tagId,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagService.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
    onError: onCreateTagError,
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      tagService.updateTag(String(id), name),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tagKeys.detail(String(variables.id)) });
    },
    onError: onUpdateTagError,
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tagService.deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
    },
    onError: onDeleteTagError,
  });
}
