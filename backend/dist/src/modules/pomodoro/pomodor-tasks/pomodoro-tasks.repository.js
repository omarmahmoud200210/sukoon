import prisma from "../../shared/database/prisma.js";
class PomodoroTaskRepository {
    constructor() { }
    getAllPomodoroTasks(userId) {
        return prisma.pomodoroTask.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    getPomodoroTaskById(id, userId) {
        return prisma.pomodoroTask.findUnique({
            where: {
                id,
                userId,
            },
        });
    }
    createPomodoroTask(userId, title, duration) {
        return prisma.pomodoroTask.create({
            data: {
                title,
                duration,
                userId,
            },
        });
    }
    updatePomodoroTask(id, userId, title, duration) {
        return prisma.pomodoroTask.update({
            where: {
                id,
                userId,
            },
            data: {
                ...(title && { title }),
                ...(duration && { duration }),
            },
        });
    }
    deletePomodoroTask(id, userId) {
        return prisma.pomodoroTask.delete({
            where: {
                id,
                userId,
            },
        });
    }
    getAvailableTasks(userId) {
        return prisma.task.findMany({
            where: {
                userId,
                isCompleted: false,
            },
            select: {
                id: true,
                title: true,
                priority: true,
                dueDate: true,
                listId: true,
            },
            orderBy: {
                dueDate: "asc",
            },
        });
    }
}
export default PomodoroTaskRepository;
