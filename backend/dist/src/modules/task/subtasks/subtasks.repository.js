import prisma from "../../../shared/database/prisma.js";
class SubTaskRepository {
    static SUBTASK_SELECT = {
        id: true,
        title: true,
        isCompleted: true,
        taskId: true,
    };
    constructor() { }
    async getSubTasksByTask(taskId) {
        return await prisma.subTask.findMany({
            where: { taskId },
            select: SubTaskRepository.SUBTASK_SELECT,
        });
    }
    async createSubTask(taskId, title) {
        return await prisma.subTask.create({
            data: {
                title,
                taskId,
            },
            select: SubTaskRepository.SUBTASK_SELECT,
        });
    }
    async updateSubTask(id, taskId, data) {
        return await prisma.subTask.update({
            where: {
                id: id,
                taskId,
            },
            data: data,
            select: SubTaskRepository.SUBTASK_SELECT,
        });
    }
    async deleteSubTask(id, taskId) {
        return await prisma.subTask.delete({
            where: {
                id: id,
                taskId,
            },
            select: SubTaskRepository.SUBTASK_SELECT,
        });
    }
    async areAllSubtasksCompleted(taskId) {
        const subTasks = await prisma.subTask.findMany({
            where: { taskId },
            select: { isCompleted: true },
        });
        if (subTasks.length === 0)
            return false;
        return subTasks.every(st => st.isCompleted);
    }
}
export default SubTaskRepository;
