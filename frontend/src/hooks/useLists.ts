import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as listService from "@/services/listService";
import {
  onCreateListError,
  onUpdateListError,
  onDeleteListError,
} from "@/errors/lists.errors";

export const listKeys = {
  all: ["lists"] as const,
  details: () => [...listKeys.all, "detail"] as const,
  detail: (id: string) => [...listKeys.details(), id] as const,
};

export function useLists() {
  return useQuery({
    queryKey: listKeys.all,
    queryFn: listService.getAllLists,
  });
}

export function useList(id: string) {
  return useQuery({
    queryKey: listKeys.detail(id),
    queryFn: () => listService.getListById(id),
    enabled: !!id,
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listService.createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKeys.all });
    },
    onError: onCreateListError,
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => 
      listService.updateList(id, title),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: listKeys.all });
      queryClient.invalidateQueries({ queryKey: listKeys.detail(variables.id) });
    },
    onError: onUpdateListError,
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: listService.deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKeys.all });
    },
    onError: onDeleteListError,
  });
}
