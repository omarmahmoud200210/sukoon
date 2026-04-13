import prisma from "../../../shared/database/prisma.js";
class TrashRepository {
    constructor() { }
    getAllTasksFromTrash(userId) {
        return prisma.trash.findMany({
            where: {
                userId,
            },
            include: {
                task: true,
            },
        });
    }
    async permanentlyDeleteTask(taskId, userId) {
        const trashEntry = await prisma.trash.findUnique({
            where: { id: taskId },
            include: {
                task: true,
            },
        });
        if (!trashEntry)
            throw new Error("Task not found in trash");
        if (trashEntry.userId !== userId) {
            throw new Error("You are not authorized to delete this task");
        }
        return prisma.task.delete({
            where: { id: trashEntry.taskId }
        });
    }
    async undoTaskFromTrash(taskId, userId) {
        const trashEntry = await prisma.trash.findUnique({
            where: { id: taskId },
        });
        if (!trashEntry)
            throw new Error("Task not found in trash");
        if (trashEntry.userId !== userId) {
            throw new Error("You are not authorized to undo this task");
        }
        return prisma.trash.delete({
            where: { id: taskId },
        });
    }
}
export default TrashRepository;
