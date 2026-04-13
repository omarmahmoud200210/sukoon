import { api } from "@/lib/api";
import type { ExistingUser, UserRole } from "@/types/auth";

const API_URL = "/admin";

export type AdminStats = {
  totalUsers: number;
  totalTasks: number;
  totalComments: number;
  totalPomodoroSessions: number;
};

export type SystemHealth = {
  database: {
    status: "connected" | "disconnected";
    latencyMs: number | null;
  };
  server: {
    uptimeSeconds: number;
    memoryUsage: {
      heapUsedMB: number;
      heapTotalMB: number;
      rssMB: number;
    };
  };
};

export const getStats = async (): Promise<AdminStats> => {
  const { data } = await api.get(`${API_URL}/stats`);
  return data;
};

export const getHealth = async (): Promise<SystemHealth> => {
  const { data } = await api.get(`${API_URL}/health`);
  return data;
};

export const getUsers = async (role?: string, cursor?: number, limit = 10): Promise<ExistingUser[]> => {
  const params = new URLSearchParams();
  if (role) params.append("role", role);
  if (cursor) params.append("cursor", String(cursor));
  if (limit) params.append("limit", String(limit));
  
  const { data } = await api.get(`${API_URL}/users?${params.toString()}`);
  return data;
};

export const getUserById = async (id: number): Promise<ExistingUser> => {
  const { data } = await api.get(`${API_URL}/users/${id}`);
  return data;
};

export const updateUserRole = async (id: number, role: UserRole): Promise<ExistingUser> => {
  const { data } = await api.patch(`${API_URL}/users/${id}/role`, { role });
  return data;
};

export const updateUserStatus = async (id: number, isActive: boolean): Promise<ExistingUser> => {
  const { data } = await api.patch(`${API_URL}/users/${id}/status`, { isActive });
  return data;
};
