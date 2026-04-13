import prisma from "../../../shared/database/prisma.js";
class TaskRepository {
    constructor() { }
    async getAllCompletedTasks(userId, cursor, limit = 10) {
        const query = {
            where: {
                isCompleted: true,
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit + 1,
        };
        if (cursor) {
            query.skip = 1;
            query.cursor = { id: cursor };
        }
        return await prisma.task.findMany(query);
    }
    async getAllUncompletedTasks(userId) {
        const tasks = await prisma.task.findMany({
            where: {
                isCompleted: false,
                userId,
            },
        });
        return tasks.map((task) => ({
            ...task,
            isOverdue: this.checkIfOverdue(task),
        }));
    }
    async getTodaysTasks(userId) {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                dueDate: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
            orderBy: { dueDate: "asc" },
        });
        return tasks.map((task) => ({
            ...task,
            isOverdue: this.checkIfOverdue(task),
        }));
    }
    async getUpcomingTasks(userId) {
        const startOfTomorrow = new Date();
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        startOfTomorrow.setHours(0, 0, 0, 0);
        return await prisma.task.findMany({
            where: {
                userId,
                dueDate: {
                    gte: startOfTomorrow,
                },
                isCompleted: false,
            },
            orderBy: { dueDate: "asc" },
        });
    }
    async getOverdueTasks(userId) {
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                dueDate: {
                    lt: new Date(),
                },
                isCompleted: false,
            },
            orderBy: { dueDate: "asc" },
        });
        return tasks.map((task) => ({
            ...task,
            isOverdue: this.checkIfOverdue(task),
        }));
    }
    checkIfOverdue(task) {
        if (task.isCompleted)
            return false;
        return new Date(task.dueDate) < new Date();
    }
    async getTaskById(id, userId) {
        const task = await prisma.task.findUnique({
            where: { id: Number(id) },
        });
        if (task?.userId !== userId) {
            throw new Error("You are not authorized to access this task");
        }
        return task;
    }
    async createTask(userId, taskData) {
        return await prisma.task.create({
            data: {
                ...taskData,
                userId,
            },
        });
    }
    async updateTask(id, taskData, userId) {
        return await prisma.task.update({
            where: {
                id: Number(id),
                userId,
            },
            data: taskData,
        });
    }
    async deleteTask(id, userId) {
        const task = await prisma.task.findUnique({
            where: { id: Number(id) },
        });
        if (!task)
            throw new Error("Task not found");
        if (task.userId !== userId)
            throw new Error("You are not authorized to delete this task");
        return await prisma.trash.create({
            data: {
                taskId: Number(id),
                userId,
            },
        });
    }
    async deleteAllTasks() {
        return await prisma.task.deleteMany();
    }
}
export default TaskRepository;
