import prisma from "../../../shared/database/prisma.js";
class SubTaskRepository {
    constructor() { }
    getAllSubTasks(taskId) {
        return prisma.subTask.findMany({
            where: {
                taskId,
            },
        });
    }
    createSubTask(taskId, subTaskData) {
        return prisma.subTask.create({
            data: {
                ...subTaskData,
                taskId,
            },
        });
    }
    updateSubTask(id, subTaskData, taskId) {
        return prisma.subTask.update({
            where: {
                id: Number(id),
                taskId,
            },
            data: subTaskData,
        });
    }
    deleteSubTask(id, taskId) {
        return prisma.subTask.delete({
            where: {
                id: Number(id),
                taskId,
            },
        });
    }
}
export default SubTaskRepository;
