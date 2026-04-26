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
    async getAllCompletedTasks(userId) {
        const tasks = await prisma.task.findMany({
            where: {
                isCompleted: true,
                userId,
                deletedAt: null,
                listId: null
            },
            orderBy: { id: "asc" },
            select: TaskRepository.TASK_SELECT,
        });
        return tasks.map((task) => this.transformTask(task));
    }
    async getAllUncompletedTasks(userId) {
        const tasks = await prisma.task.findMany({
            where: {
                isCompleted: false,
                userId,
                deletedAt: null,
                listId: null
            },
            orderBy: { id: "asc" },
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
    async getTodaysTasks(userId, status) {
        let isCompletedFilter = undefined;
        if (status === "pending")
            isCompletedFilter = false;
        if (status === "completed")
            isCompletedFilter = true;
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
                ...(isCompletedFilter !== undefined && { isCompleted: isCompletedFilter }),
                listId: null
            },
            orderBy: [{ dueDate: "asc" }, { id: "asc" }],
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
    async getUpcomingTasks(userId, status) {
        let isCompletedFilter = undefined;
        if (status === "pending")
            isCompletedFilter = false;
        if (status === "completed")
            isCompletedFilter = true;
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
                ...(isCompletedFilter !== undefined && { isCompleted: isCompletedFilter }),
                listId: null,
            },
            orderBy: [{ dueDate: "asc" }, { id: "asc" }],
            select: TaskRepository.TASK_SELECT,
        });
        return tasks.map((task) => this.transformTask(task));
    }
    async getOverdueTasks(userId) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                deletedAt: null,
                dueDate: {
                    lt: startOfToday,
                },
                isCompleted: false,
            },
            orderBy: [{ dueDate: "asc" }, { id: "asc" }],
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
    async getTasksByList(userId, listId, status) {
        let isCompletedFilter = undefined;
        if (status === "pending")
            isCompletedFilter = false;
        if (status === "completed")
            isCompletedFilter = true;
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                listId,
                deletedAt: null,
                ...(isCompletedFilter !== undefined && { isCompleted: isCompletedFilter }),
            },
            orderBy: { id: "asc" },
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
    async getTasksByTag(userId, tagId, status) {
        let isCompletedFilter = undefined;
        if (status === "pending")
            isCompletedFilter = false;
        if (status === "completed")
            isCompletedFilter = true;
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                tags: {
                    some: {
                        tagId,
                    },
                },
                deletedAt: null,
                ...(isCompletedFilter !== undefined && { isCompleted: isCompletedFilter }),
            },
            orderBy: { id: "asc" },
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
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        return new Date(task.dueDate) < startOfToday;
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
    async getAllTrashTasks(userId) {
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                deletedAt: { not: null },
            },
            orderBy: { id: "asc" },
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
