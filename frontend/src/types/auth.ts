export type LoginUserData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type UserRole = "USER" | "ADMIN";

export type ExistingUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  isVerified: boolean;
  isActive: boolean;
  role: UserRole;
  oauth: boolean;
};

export type AuthContextType = {
  user: ExistingUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  verifyUser: (token: string) => Promise<void>;
  login: ({ data }: { data: LoginUserData }) => Promise<{ isVerified: boolean }>;
  register: ({ data }: { data: RegisterUserData }) => Promise<void>;
  logout: () => Promise<void>;
  updateName: (firstName: string, lastName: string) => Promise<void>;
  updateAvatar: (formData: FormData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  oauth: boolean;
};

export type ResetPasswordData = {
  token: string;
  password: string;
};

export type UpdateNameData = {
  firstName: string;
  lastName: string;
}

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
}
