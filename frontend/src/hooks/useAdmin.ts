import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as adminService from "@/services/adminService";
import type { UserRole } from "@/types/auth";
import axios from "axios";

const adminKeys = {
  stats: ["admin", "stats"],
  health: ["admin", "health"],
  users: (role?: string, cursor?: number, limit = 10) => [
    "admin",
    "users",
    { role, cursor, limit },
  ],
  updateRole: (id: number) => ["admin", "users", "update-role", id],
  updateStatus: (id: number) => ["admin", "users", "update-status", id],
};

export function useAdmin() {
  const queryClient = useQueryClient();

  const handleMutationError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("An error occurred");
    }
  };

  const useStats = () =>
    useQuery({
      queryKey: adminKeys.stats,
      queryFn: adminService.getStats,
    });

  const useHealth = () =>
    useQuery({
      queryKey: adminKeys.health,
      queryFn: adminService.getHealth,
      refetchInterval: 30000,
    });

  const useUsers = (role?: string, cursor?: number, limit = 10) =>
    useQuery({
      queryKey: adminKeys.users(role, cursor, limit),
      queryFn: () => adminService.getUsers(role, cursor, limit),
    });

  const useUpdateUserRole = () =>
    useMutation({
      mutationFn: ({ id, role }: { id: number; role: UserRole }) =>
        adminService.updateUserRole(id, role),
      onSuccess: () => {
        toast.success("User role updated");
        queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      },
      onError: handleMutationError,
    });

  const useUpdateUserStatus = () =>
    useMutation({
      mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
        adminService.updateUserStatus(id, isActive),
      onSuccess: () => {
        toast.success("User status updated");
        queryClient.invalidateQueries({ queryKey: adminKeys.users() });
      },
      onError: handleMutationError,
    });

  return {
    useStats,
    useHealth,
    useUsers,
    useUpdateUserRole,
    useUpdateUserStatus,
  };
}
