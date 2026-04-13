import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  onCreateTafreeghError,
  onUpdateTafreeghError,
  onDeleteTafreeghError,
  onDeleteAllTafreeghError,
} from "@/errors/tafreegh.errors";
import {
  getAllTafreeghs,
  createTafreegh,
  updateTafreegh,
  deleteTafreegh,
  deleteAllTafreegh,
} from "@/services/tafreeghService";
import type {
  CreateTafreeghType,
  UpdateTafreeghType,
  DeleteTafreeghType,
} from "@/types/tafreegh";

const TAFREEGH_QUERY_KEY = ["tafreeghs"];

export function useTafreeghs() {
  return useQuery({
    queryKey: TAFREEGH_QUERY_KEY,
    queryFn: getAllTafreeghs,
  });
}

export function useCreateTafreegh() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTafreeghType) => createTafreegh(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAFREEGH_QUERY_KEY });
    },
    onError: onCreateTafreeghError,
  });
}

export function useUpdateTafreegh() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTafreeghType) => updateTafreegh(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAFREEGH_QUERY_KEY });
    },
    onError: onUpdateTafreeghError,
  });
}

export function useDeleteTafreegh() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteTafreeghType) => deleteTafreegh(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAFREEGH_QUERY_KEY });
    },
    onError: onDeleteTafreeghError,
  });
}

export function useDeleteAllTafreegh() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllTafreegh,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAFREEGH_QUERY_KEY });
    },
    onError: onDeleteAllTafreeghError,
  });
}
