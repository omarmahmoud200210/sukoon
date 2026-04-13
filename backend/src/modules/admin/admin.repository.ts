import prisma from "../../shared/database/prisma.js";
import type { Prisma, UserRole } from "@prisma/client";

class AdminRepository {
  private static readonly USER_SELECT = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    avatarUrl: true,
    role: true,
    isActive: true,
    createdAt: true,
  };

  private handleCursorPagination(
    cursor?: number,
    limit: number = 10,
  ): Pick<Prisma.UserFindManyArgs, "take" | "skip" | "cursor"> {
    const query: Pick<Prisma.UserFindManyArgs, "take" | "skip" | "cursor"> = {
      take: limit + 1,
    };

    if (cursor !== undefined) {
      query.skip = 1;
      query.cursor = { id: cursor };
    }

    return query;
  }

  constructor() {}

  async getAllUsers(
    userRole: UserRole = "USER",
    cursor?: number,
    limit: number = 10,
  ) {
    const users = await prisma.user.findMany({
      where: {
        role: userRole,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...this.handleCursorPagination(cursor, limit),
      select: AdminRepository.USER_SELECT,
    });

    return users;
  }

  async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      select: AdminRepository.USER_SELECT,
    });
  }

  async updateUserRole(id: number, role: UserRole) {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        role,
      },
      select: AdminRepository.USER_SELECT,
    });
  }

  async updateUserStatus(id: number, isActive: boolean) {
    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
      select: AdminRepository.USER_SELECT,
    });
  }

  async getStats() {
    const [totalUsers, totalTasks, totalComments, totalPomodoroSessions] =
      await Promise.all([
        prisma.user.count(),
        prisma.task.count(),
        prisma.comment.count(),
        prisma.pomodoroSession.count(),
      ]);

    return {
      totalUsers,
      totalTasks,
      totalComments,
      totalPomodoroSessions,
    };
  }

  async getSystemHealth() {
    const start = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      const latencyMs = Date.now() - start;
      return {
        database: {
          status: "connected" as const,
          latencyMs,
        },
      };
    } catch {
      return {
        database: {
          status: "disconnected" as const,
          latencyMs: null,
        },
      };
    }
  }
}

export default AdminRepository;
