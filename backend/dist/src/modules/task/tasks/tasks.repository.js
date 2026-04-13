import prisma from "../../../shared/database/prisma.js";
import { Prisma } from "@prisma/client";
class TaskRepository {
    static TASK_SELECT = {
        id: true,
        title: true,
        description: true,
        listId: true,
        priority: true,
        isCompleted: true,
        dueDate: true,
        createdAt: true,
        subTasks: {
            select: {
                id: true,
                title: true,
                isCompleted: true,
                taskId: true,
            },
        },
        tags: {
            include: {
                tag: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        },
    };
    handleCursorPagination(cursor, limit = 10) {
        const query = {
            take: limit + 1,
        };
        if (cursor !== undefined) {
            query.skip = 1;
            query.cursor = { id: cursor };
        }
        return query;
    }
    constructor() { }
    transformTask(task) {
        if (!task)
            return task;
        const { subTasks, tags, ...rest } = task;
        return {
            ...rest,
            subtasks: subTasks,
            tags: tags?.map((t) => t.tag) || [],
        };
    }
    async getAllCompletedTasks(userId, cursor, limit = 10) {
        const tasks = await prisma.task.findMany({
            where: {
                isCompleted: true,
                userId,
                deletedAt: null,
            },
            orderBy: { id: "asc" },
            ...this.handleCursorPagination(cursor, limit),
            select: TaskRepository.TASK_SELECT,
        });
        return tasks.map((task) => this.transformTask(task));
    }
    async getAllUncompletedTasks(userId, cursor, limit = 10) {
        const tasks = await prisma.task.findMany({
            where: {
                isCompleted: false,
                userId,
                deletedAt: null,
            },
            orderBy: { id: "asc" },
            ...this.handleCursorPagination(cursor, limit),
            select: TaskRepository.TASK_SELECT,
        });
        return tasks.map((task) => {
            const transformed = this.transformTask(task);
            return {
                ...transformed,
                isOverdue: this.checkIfOverdue(task),
            };
        });
    }
    async getTodaysTasks(userId, cursor, limit = 10) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                deletedAt: null,
                dueDate: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            orderBy: [{ dueDate: "asc" }, { id: "asc" }],
            ...this.handleCursorPagination(cursor, limit),
            select: TaskRepository.TASK_SELECT,
        });
        return tasks.map((task) => {
            const transformed = this.transformTask(task);
            return {
                ...transformed,
                isOverdue: this.checkIfOverdue(task),
            };
        });
    }
    async getUpcomingTasks(userId, cursor, limit = 10) {
        const startOfTomorrow = new Date();
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        startOfTomorrow.setHours(0, 0, 0, 0);
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                deletedAt: null,
                dueDate: {
                    gte: startOfTomorrow,
                },
                isCompleted: false,
            },
            orderBy: [{ dueDate: "asc" }, { id: "asc" }],
            ...this.handleCursorPagination(cursor, limit),
            select: TaskRepository.TASK_SELECT,
        });
        return tasks.map((task) => this.transformTask(task));
    }
    async getOverdueTasks(userId, cursor, limit = 10) {
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                deletedAt: null,
                dueDate: {
                    lt: new Date(),
                },
                isCompleted: false,
            },
            orderBy: [{ dueDate: "asc" }, { id: "asc" }],
            ...this.handleCursorPagination(cursor, limit),
            select: TaskRepository.TASK_SELECT,
        });
        return tasks.map((task) => {
            const transformed = this.transformTask(task);
            return {
                ...transformed,
                isOverdue: this.checkIfOverdue(task),
            };
        });
    }
    checkIfOverdue(task) {
        if (task.isCompleted || !task.dueDate)
            return false;
        return new Date(task.dueDate) < new Date();
    }
    async getTaskById(id, userId) {
        const task = await prisma.task.findFirst({
            where: { id: Number(id), userId },
            select: TaskRepository.TASK_SELECT,
        });
        if (!task) {
            throw new Error("Task not found or you are not authorized to access this task");
        }
        return this.transformTask(task);
    }
    async createTask(userId, taskData) {
        const { tagIds = [], ...rest } = taskData;
        const task = await prisma.task.create({
            data: {
                ...rest,
                userId,
                ...(Array.isArray(tagIds) && tagIds.length > 0
                    ? { tags: { create: tagIds.map((id) => ({ tagId: id })) } }
                    : {}),
            },
            select: TaskRepository.TASK_SELECT,
        });
        return this.transformTask(task);
    }
    async updateTask(id, taskData, userId) {
        const { tagIds, ...rest } = taskData;
        const tagsUpdate = tagIds !== undefined
            ? {
                tags: {
                    deleteMany: {},
                    create: tagIds.map((tagId) => ({ tagId })),
                },
            }
            : {};
        const task = await prisma.task.update({
            where: {
                id: Number(id),
                userId,
            },
            data: {
                ...rest,
                ...tagsUpdate,
            },
            select: TaskRepository.TASK_SELECT,
        });
        return this.transformTask(task);
    }
    async deleteTask(id, userId) {
        try {
            return await prisma.task.update({
                where: { id: Number(id), userId },
                data: { deletedAt: new Date() },
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025") {
                throw new Error("Task not found or you are not authorized to delete this task");
            }
            throw error;
        }
    }
    async restoreTask(id, userId) {
        try {
            return await prisma.task.update({
                where: { id: Number(id), userId, deletedAt: { not: null } },
                data: { deletedAt: null },
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2025") {
                throw new Error("Task not found, not authorized, or not in trash");
            }
            throw error;
        }
    }
    async getAllTrashTasks(userId, cursor, limit = 10) {
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                deletedAt: { not: null },
            },
            orderBy: { id: "asc" },
            ...this.handleCursorPagination(cursor, limit),
            select: TaskRepository.TASK_SELECT,
        });
        return tasks.map((task) => this.transformTask(task));
    }
    async deleteTrashTask(id, userId) {
        const result = await prisma.task.deleteMany({
            where: { id: Number(id), userId, deletedAt: { not: null } },
        });
        if (result.count === 0) {
            throw new Error("Trash task not found or unauthorized");
        }
        return result;
    }
    async deleteAllTasks() {
        return await prisma.task.deleteMany();
    }
}
export default TaskRepository;
