import { api } from "@/lib/api";
import type {
  LoginUserData,
  RegisterUserData,
  ResetPasswordData,
  UpdateNameData,
  ChangePasswordData,
} from "@/types/auth";

const API_URL = "/auth";

// LOGIN API
const login = async (LoginData: LoginUserData) => {
  const { data } = await api.post(`${API_URL}/login`, LoginData);
  return data;
};

// REGISTER API
const register = async (RegisterData: RegisterUserData) => {
  const { data } = await api.post(`${API_URL}/register`, RegisterData);
  return data;
};

// LOGOUT API
const logout = async () => {
  const { data } = await api.post(`${API_URL}/logout`);
  return data;
};

// GET CURRENT USER API
const getMe = async () => {
  const { data } = await api.get(`${API_URL}/me`);
  return data;
};

// FORGOT PASSWORD API
const forgotPassword = async (email: string) => {
  const { data } = await api.post(`${API_URL}/forgot-password`, {
    email,
  });
  return data;
};

// RESET PASSWORD API
const resetPassword = async (ResetPasswordData: ResetPasswordData) => {
  const { data } = await api.post(`${API_URL}/reset-password`, ResetPasswordData);
  return data;
};

// VERIFY EMAIL API
const verifyEmail = async (token: string) => {
  const { data } = await api.post(`${API_URL}/verify-email`, {
    token,
  });
  return data;
};

const updateName = async (UpdateNameData: UpdateNameData) => {
  const { data } = await api.patch(`${API_URL}/me`, UpdateNameData);
  return data;
};

const updateAvatar = async (formData: FormData) => {
  const { data } = await api.patch(`${API_URL}/me/upload-avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

const changePassword = async (ChangePasswordData: ChangePasswordData) => {
  const { data } = await api.patch(`${API_URL}/me/password`, ChangePasswordData);
  return data;
};

const deleteAccount = async (password: string) => {
  const { data } = await api.delete(`${API_URL}/me`, {
    data: { password },
  });
  return data;
};

export {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getMe,
  updateName,
  updateAvatar,
  changePassword,
  deleteAccount,
};
