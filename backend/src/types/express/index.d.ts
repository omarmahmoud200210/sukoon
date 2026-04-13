import "express";
import type { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: number;
      role: UserRole;
      email?: string;
      firstName?: string;
      lastName?: string;
      avatarUrl?: string | null;
      isVerified?: boolean;
      isActive?: boolean;
      createdAt?: Date;
    }
  }
}
