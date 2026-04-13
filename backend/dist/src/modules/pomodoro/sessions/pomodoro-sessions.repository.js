import prisma from "../../../shared/database/prisma.js";
class PomodoroSessionsRepository {
    static SESSION_SELECT = {
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
    constructor() { }
    getDateRangeWithOffset(offsetMinutes) {
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
    async getAllSessions(userId) {
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
    async getActiveSession(userId) {
        return await prisma.pomodoroSession.findFirst({
            where: {
                userId,
                isCompleted: false,
            },
            select: PomodoroSessionsRepository.SESSION_SELECT,
        });
    }
    async getUncompletedSessions(startOfDay, endOfDay) {
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
    async createSession(userId, duration, taskId, pomodoroTaskId, sessionCount = 0, timezoneOffset) {
        const startedAt = new Date();
        const endedAt = new Date(startedAt.getTime() + duration * 60 * 1000);
        return await prisma.pomodoroSession.create({
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
    async updateSession(id, userId, data) {
        return await prisma.pomodoroSession.update({
            where: { id, userId },
            data,
            select: PomodoroSessionsRepository.SESSION_SELECT,
        });
    }
    async deleteSession(id, userId) {
        return await prisma.pomodoroSession.delete({
            where: {
                id,
                userId,
            },
            select: PomodoroSessionsRepository.SESSION_SELECT,
        });
    }
    async getTodaysPomosTask(userId, taskId, offsetMinutes) {
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
    async getTodaysDurationTask(userId, taskId, offsetMinutes) {
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
    async getTodaysPomos(userId, offsetMinutes) {
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
    async getTotalPomos(userId) {
        return await prisma.pomodoroSession.count({
            where: {
                userId,
                isCompleted: true,
            },
        });
    }
    async countSessionsInRange(userId, offsetMinutes) {
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
    async getTodaysDuration(userId, offsetMinutes) {
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
    async getTotalDuration(userId) {
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
    async createSessionForNextDay(userId, duration, taskId, pomodoroTaskId, sessionCount = 0, startedAt, timezoneOffset) {
        const endedAt = new Date(startedAt.getTime() + duration * 60 * 1000);
        return await prisma.pomodoroSession.create({
            data: {
                userId,
                duration,
                taskId: taskId ?? null,
                pomodoroTaskId: pomodoroTaskId ?? null,
                startedAt: startedAt,
                endedAt,
                sessionCount,
                timezoneOffset: timezoneOffset ?? 0,
            },
            select: PomodoroSessionsRepository.SESSION_SELECT,
        });
    }
    async getSessionsGroupedByTask(userId) {
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
                id: "open-sessions",
                userId: userId,
                title: "Open Sessions",
                duration: 0,
                isArchived: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                pomodoroSessions: openSessions,
            });
        }
        return tasks;
    }
}
export default PomodoroSessionsRepository;
