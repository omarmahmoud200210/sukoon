import PomodoroSessionsRepository from "./pomodoro-sessions.repository.js";
import type { PomodoroSession, Prisma } from "@prisma/client";
import logger from "../../../shared/utils/logger.js";
import { AppError } from "../../../shared/middleware/error.js";
import prisma from "../../../shared/database/prisma.js";

type PrismaTx = Prisma.TransactionClient;

class PomodoroSessionsService {
  constructor(private pomodoroSessionsRepository: PomodoroSessionsRepository) {}

  async startSession(
    userId: number,
    duration: number,
    taskId?: number,
    pomodoroTaskId?: number,
    sessionCount?: number,
    timezoneOffset?: number,
  ) {
    return await prisma.$transaction(async (tx) => {
      const activeSession =
        await this.pomodoroSessionsRepository.getActiveSession(userId, tx);

      if (activeSession) {
        throw AppError.BadRequest("You already have an active session");
      }

      const finalSessionCount =
        sessionCount ?? (await this.getTodaysSessionCount(userId, tx));

      return this.pomodoroSessionsRepository.createSession(
        userId,
        duration,
        taskId,
        pomodoroTaskId,
        finalSessionCount,
        timezoneOffset,
        tx
      );
    });
  }

  private async getTodaysSessionCount(
    userId: number,
    tx: PrismaTx | typeof prisma = prisma,
    timezoneOffset?: number,
  ): Promise<number> {
    const offset = timezoneOffset ?? new Date().getTimezoneOffset();
    const count = await this.pomodoroSessionsRepository.countSessionsInRange(
      userId,
      offset,
      tx,
    );
    return count;
  }

  async togglePauseSession(userId: number) {
    const activeSession =
      await this.pomodoroSessionsRepository.getActiveSession(userId);

    if (!activeSession) {
      throw AppError.NotFound("No active session found");
    }

    if (!activeSession.isPaused) {
      return this.pomodoroSessionsRepository.updateSession(
        activeSession.id,
        userId,
        { isPaused: true, endedAt: new Date() },
      );
    } else {
      const now = Date.now();
      const pauseDurationMs = now - activeSession.endedAt.getTime();
      const newStartedAt = new Date(
        activeSession.startedAt.getTime() + pauseDurationMs,
      );

      const elapsedMs =
        activeSession.endedAt.getTime() - activeSession.startedAt.getTime();
      const remainingMs = activeSession.duration * 60 * 1000 - elapsedMs;
      const newEndedAt = new Date(now + remainingMs);

      return this.pomodoroSessionsRepository.updateSession(
        activeSession.id,
        userId,
        { isPaused: false, startedAt: newStartedAt, endedAt: newEndedAt },
      );
    }
  }

  async completeSession(userId: number) {
    const activeSession =
      await this.pomodoroSessionsRepository.getActiveSession(userId);

    if (!activeSession) {
      throw AppError.NotFound("No active session found");
    }

    if (activeSession.isCompleted) {
      throw AppError.BadRequest("Session is already completed");
    }

    return this.pomodoroSessionsRepository.updateSession(
      activeSession.id,
      userId,
      { isCompleted: true, endedAt: new Date() },
    );
  }

  async resetSession(userId: number) {
    const activeSession =
      await this.pomodoroSessionsRepository.getActiveSession(userId);

    if (!activeSession) {
      throw AppError.NotFound("No active session found");
    }

    return this.pomodoroSessionsRepository.deleteSession(
      activeSession.id,
      userId,
    );
  }

  async getActiveSession(userId: number) {
    return await this.pomodoroSessionsRepository.getActiveSession(userId);
  }

  async getAllSessions(userId: number) {
    return await this.pomodoroSessionsRepository.getAllSessions(userId);
  }

  async getPomosStatistics(userId: number, offsetMinutes: number) {
    const [todayPomos, totalPomos, todayDuration, totalDuration] =
      await Promise.all([
        this.pomodoroSessionsRepository.getTodaysPomos(userId, offsetMinutes),
        this.pomodoroSessionsRepository.getTotalPomos(userId),
        this.pomodoroSessionsRepository.getTodaysDuration(
          userId,
          offsetMinutes,
        ),
        this.pomodoroSessionsRepository.getTotalDuration(userId),
      ]);

    return {
      today: {
        count: todayPomos,
        duration: todayDuration._sum.duration || 0,
      },
      total: {
        count: totalPomos,
        duration: totalDuration._sum.duration || 0,
      },
    };
  }

  async getTaskStatistics(
    userId: number,
    taskId: number,
    offsetMinutes: number,
  ) {
    const [todayPomos, todayDuration] = await Promise.all([
      this.pomodoroSessionsRepository.getTodaysPomosTask(
        userId,
        taskId,
        offsetMinutes,
      ),
      this.pomodoroSessionsRepository.getTodaysDurationTask(
        userId,
        taskId,
        offsetMinutes,
      ),
    ]);

    return {
      today: {
        count: todayPomos,
        duration: todayDuration._sum.duration || 0,
      },
    };
  }

  async deleteSession(userId: number, sessionId: number) {
    return await this.pomodoroSessionsRepository.deleteSession(
      sessionId,
      userId,
    );
  }

  private getDayBoundariesForDate(referenceDate: Date, offsetMinutes: number) {
    const offsetMs = offsetMinutes * 60 * 1000;
    const localDate = new Date(referenceDate.getTime() - offsetMs);

    const localStart = new Date(localDate);
    localStart.setHours(0, 0, 0, 0);
    const localEnd = new Date(localDate);
    localEnd.setHours(23, 59, 59, 999);

    const startOfDay = new Date(localStart.getTime() + offsetMs);
    const endOfDay = new Date(localEnd.getTime() + offsetMs);

    return { startOfDay, endOfDay };
  }

  async splitCrossDaySession() {
    const sessions =
      await this.pomodoroSessionsRepository.getUncompletedSessions();

    let splitCount = 0;
    let failedCount = 0;
    const errors: { sessionId: number; error: string }[] = [];

    for (const session of sessions) {
      const { endOfDay } = this.getDayBoundariesForDate(
        session.startedAt,
        session.timezoneOffset,
      );

      if (session.endedAt > endOfDay) {
        try {
          await this.splitSingleSession(session);
          splitCount++;
        } catch (err) {
          failedCount++;
          errors.push({
            sessionId: session.id,
            error: err instanceof Error ? err.message : "Unknown error",
          });
          logger.error(`[CRON] Failed to split session ${session.id}`, {
            error: err,
          });
        }
      }
    }

    return {
      message: "Sessions split successfully",
      splitCount,
      failedCount,
      errors,
    };
  }

  async splitSingleSession(session: PomodoroSession) {
    const { endOfDay: endOfPreviousDay } = this.getDayBoundariesForDate(
      session.startedAt,
      session.timezoneOffset,
    );

    const startOfNextDay = new Date(endOfPreviousDay.getTime() + 1);

    const previousDuration = Math.floor(
      (endOfPreviousDay.getTime() - session.startedAt.getTime()) / 60000,
    );

    const nextDuration = Math.floor(
      (session.endedAt.getTime() - endOfPreviousDay.getTime()) / 60000,
    );

    if (previousDuration <= 0 || nextDuration <= 0) return;

    await prisma.$transaction(async (tx) => {
      await this.pomodoroSessionsRepository.updateSession(
        session.id,
        session.userId,
        {
          endedAt: endOfPreviousDay,
          duration: previousDuration,
          isCompleted: true,
        },
        tx,
      );

      await this.pomodoroSessionsRepository.createSessionForNextDay(
        session.userId,
        nextDuration,
        session.taskId ?? undefined,
        session.pomodoroTaskId ?? undefined,
        1,
        startOfNextDay,
        session.timezoneOffset,
        tx,
      );
    });
  }

  async getHistoryGrouped(userId: number) {
    return await this.pomodoroSessionsRepository.getSessionsGroupedByTask(
      userId,
    );
  }
}

export default PomodoroSessionsService;
