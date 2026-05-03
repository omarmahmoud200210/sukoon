import prisma from "../../../shared/database/prisma.js";
import { Prisma } from "@prisma/client";

type PrismaTx = Prisma.TransactionClient;

class PomodoroSessionsRepository {
  private static readonly SESSION_SELECT = {
    id: true,
    userId: true,
    taskId: true,
    pomodoroTaskId: true,
    startedAt: true,
    endedAt: true,
    duration: true,
    isCompleted: true,
    isPaused: true,
    sessionCount: true,
    timezoneOffset: true,
  };

  constructor() {}

  private getDateRangeWithOffset(offsetMinutes: number) {
    const now = new Date();
    const offsetMs = offsetMinutes * 60 * 1000;

    const localNow = new Date(now.getTime() - offsetMs);
    const dateStr = localNow.toISOString().split("T")[0];

    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

    startOfDay.setTime(startOfDay.getTime() + offsetMs);
    endOfDay.setTime(endOfDay.getTime() + offsetMs);

    return { startOfDay, endOfDay };
  }

  async getAllSessions(userId: number) {
    return await prisma.pomodoroSession.findMany({
      where: {
        userId,
      },
      orderBy: {
        startedAt: "desc",
      },
      select: PomodoroSessionsRepository.SESSION_SELECT,
    });
  }

  async getActiveSession(
    userId: number,
    tx: PrismaTx | typeof prisma = prisma,
  ) {
    return await tx.pomodoroSession.findFirst({
      where: {
        userId,
        isCompleted: false,
      },
      select: PomodoroSessionsRepository.SESSION_SELECT,
    });
  }

  async getUncompletedSessions(startOfDay?: Date, endOfDay?: Date) {
    return await prisma.pomodoroSession.findMany({
      where: {
        ...(startOfDay && endOfDay
          ? { startedAt: { gte: startOfDay, lte: endOfDay } }
          : {}),
        isCompleted: false,
      },
      select: PomodoroSessionsRepository.SESSION_SELECT,
    });
  }

  async createSession(
    userId: number,
    duration: number,
    taskId?: number,
    pomodoroTaskId?: number,
    sessionCount: number = 0,
    timezoneOffset?: number,
    tx: PrismaTx | typeof prisma = prisma,
  ) {
    const startedAt = new Date();
    const endedAt = new Date(startedAt.getTime() + duration * 60 * 1000);

    return await tx.pomodoroSession.create({
      data: {
        userId,
        taskId: taskId ?? null,
        pomodoroTaskId: pomodoroTaskId ?? null,
        startedAt,
        endedAt,
        duration,
        sessionCount,
        timezoneOffset: timezoneOffset ?? 0,
      },
      select: PomodoroSessionsRepository.SESSION_SELECT,
    });
  }

  async updateSession(
    id: number,
    userId: number,
    data: {
      isPaused?: boolean;
      isCompleted?: boolean;
      startedAt?: Date;
      endedAt?: Date;
      duration?: number;
    },
    tx: PrismaTx | typeof prisma = prisma,
  ) {
    return await tx.pomodoroSession.update({
      where: { id, userId },
      data,
      select: PomodoroSessionsRepository.SESSION_SELECT,
    });
  }

  async deleteSession(id: number, userId: number) {
    return await prisma.pomodoroSession.delete({
      where: {
        id,
        userId,
      },
      select: PomodoroSessionsRepository.SESSION_SELECT,
    });
  }

  async getTodaysPomosTask(
    userId: number,
    taskId: number,
    offsetMinutes: number,
  ) {
    const { startOfDay, endOfDay } = this.getDateRangeWithOffset(offsetMinutes);

    return prisma.pomodoroSession.count({
      where: {
        userId,
        OR: [{ taskId }, { pomodoroTaskId: taskId }],
        startedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        isCompleted: true,
      },
    });
  }

  async getTodaysDurationTask(
    userId: number,
    taskId: number,
    offsetMinutes: number,
  ) {
    const { startOfDay, endOfDay } = this.getDateRangeWithOffset(offsetMinutes);

    return await prisma.pomodoroSession.aggregate({
      where: {
        userId,
        OR: [{ taskId }, { pomodoroTaskId: taskId }],
        startedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        isCompleted: true,
      },
      _sum: {
        duration: true,
      },
    });
  }

  async getTodaysPomos(userId: number, offsetMinutes: number) {
    const { startOfDay, endOfDay } = this.getDateRangeWithOffset(offsetMinutes);

    return await prisma.pomodoroSession.count({
      where: {
        userId,
        startedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        isCompleted: true,
      },
    });
  }

  async getTotalPomos(userId: number) {
    return await prisma.pomodoroSession.count({
      where: {
        userId,
        isCompleted: true,
      },
    });
  }

  async countSessionsInRange(
    userId: number,
    offsetMinutes: number,
    tx: PrismaTx | typeof prisma = prisma,
  ) {
    const { startOfDay, endOfDay } = this.getDateRangeWithOffset(offsetMinutes);

    return await tx.pomodoroSession.count({
      where: {
        userId,
        startedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        isCompleted: true,
      },
    });
  }

  async getTodaysDuration(userId: number, offsetMinutes: number) {
    const { startOfDay, endOfDay } = this.getDateRangeWithOffset(offsetMinutes);

    return await prisma.pomodoroSession.aggregate({
      where: {
        userId,
        startedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        isCompleted: true,
      },
      _sum: {
        duration: true,
      },
    });
  }

  async getTotalDuration(userId: number) {
    return await prisma.pomodoroSession.aggregate({
      where: {
        userId,
        isCompleted: true,
      },
      _sum: {
        duration: true,
      },
    });
  }

  async createSessionForNextDay(
    userId: number,
    duration: number,
    taskId?: number,
    pomodoroTaskId?: number,
    sessionCount: number = 0,
    startedAt?: Date,
    timezoneOffset?: number,
    tx: PrismaTx | typeof prisma = prisma,
  ) {
    const endedAt = new Date(startedAt!.getTime() + duration * 60 * 1000);
    return await tx.pomodoroSession.create({
      data: {
        userId,
        duration,
        taskId: taskId ?? null,
        pomodoroTaskId: pomodoroTaskId ?? null,
        startedAt: startedAt!,
        endedAt,
        sessionCount,
        timezoneOffset: timezoneOffset ?? 0,
      },
      select: PomodoroSessionsRepository.SESSION_SELECT,
    });
  }

  async getSessionsGroupedByTask(userId: number) {
    const tasks = await prisma.pomodoroTask.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        duration: true,
        isArchived: true,
        createdAt: true,
        userId: true,
        pomodoroSessions: {
          where: { isCompleted: true },
          orderBy: { startedAt: "desc" },
          select: PomodoroSessionsRepository.SESSION_SELECT,
        },
      },
    });

    const openSessions = await prisma.pomodoroSession.findMany({
      where: {
        userId: userId,
        isCompleted: true,
        taskId: null,
        pomodoroTaskId: null,
      },
      orderBy: { startedAt: "desc" },
      select: PomodoroSessionsRepository.SESSION_SELECT,
    });

    if (openSessions.length > 0) {
      tasks.push({
        id: "open-sessions" as any,
        userId: userId,
        title: "Open Sessions",
        duration: 0,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        pomodoroSessions: openSessions,
      } as any);
    }

    return tasks;
  }
}

export default PomodoroSessionsRepository;
