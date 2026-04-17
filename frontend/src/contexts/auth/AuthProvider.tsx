import { useState, useEffect } from "react";
import type {
  LoginUserData,
  RegisterUserData,
  ExistingUser,
} from "../../types/auth";
import * as authService from "../../services/authService";
import { AuthContext } from "./AuthContext";
import logger from "@/lib/logger";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<ExistingUser | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await authService.getMe();
        if (result) {
          setUser(result);
          setIsVerified(result.isVerified);
          setIsAuthenticated(true);
        }
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async ({ data }: { data: LoginUserData }) => {
    setIsLoading(true);
    try {
      const result = await authService.login(data);
      if (result.status) {
        setUser(result.user);
        setIsAuthenticated(true);
        setIsVerified(result.user.isVerified);
        return { isVerified: result.user.isVerified };
      } else {
        setIsVerified(false);
        setIsAuthenticated(false);
        setUser(null);
        return { isVerified: false };
      }
    } catch (error) {
      logger.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({ data }: { data: RegisterUserData }) => {
    setIsLoading(true);
    try {
      const result = await authService.register(data);
      if (result.success) {
        setUser(result.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      logger.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      logger.error("Logout failed:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsVerified(false);
      setIsLoading(false);
    }
  };

  const verifyUser = async (token: string) => {
    setIsLoading(true);
    try {
      const result = await authService.verifyEmail(token);
      if (result) {
        setIsVerified(true);
        setUser((prev) => (prev ? { ...prev, isVerified: true } : null));
      }
    } catch {
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateName = async (firstName: string, lastName: string) => {
    await authService.updateName({ firstName, lastName });
    setUser((prev) => (prev ? { ...prev, firstName, lastName } : null));
  };

  const updateAvatar = async (formData: FormData) => {
    const result = await authService.updateAvatar(formData);
    const newAvatarUrl =
      result?.data?.avatarUrl || result?.user?.avatarUrl || result?.avatarUrl;
    if (newAvatarUrl) {
      setUser((prev) => (prev ? { ...prev, avatarUrl: newAvatarUrl } : null));
    } else {
      const me = await authService.getMe();
      if (me) setUser(me);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    await authService.changePassword({ currentPassword, newPassword });
  };

  const deleteAccount = async (password: string) => {
    await authService.deleteAccount(password);
    setUser(null);
    setIsAuthenticated(false);
    setIsVerified(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isVerified,
        login,
        register,
        logout,
        verifyUser,
        updateName,
        updateAvatar,
        changePassword,
        deleteAccount,
        oauth: user?.oauth ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
