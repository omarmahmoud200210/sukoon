import axios from "axios";
import { toast } from "sonner";
import i18next from "i18next";

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers["x-timezone-offset"] = new Date().getTimezoneOffset().toString();
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 1. Broad Network Error Checks (Offline/Cors)
    if (error.code === "ERR_NETWORK" || !error.response) {
       toast.error(i18next.t("common.offline_message") || "You're offline. Some features may not work until you're back.");
       return Promise.reject(error);
    }

    const originalRequest = error.config;
    
    // 2. Refresh Token Logic
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        const publicPages = [
          "/login",
          "/register",
          "/",
          "/verify-email",
          "/reset-password",
          "/forgot-password",
        ];
        if (!publicPages.includes(window.location.pathname)) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
