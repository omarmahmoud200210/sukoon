import prisma from "../../../shared/database/prisma.js";
import type { SubTasksType } from "../../../types/api.types.js";

class SubTaskRepository {
  private static readonly SUBTASK_SELECT = {
    id: true,
    title: true,
    isCompleted: true,
    taskId: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor() {}

  async getSubTasksByTask(taskId: number) {
    return await prisma.subTask.findMany({
      where: { taskId },
      select: SubTaskRepository.SUBTASK_SELECT,
    });
  }

  async createSubTask(taskId: number, title: string) {
    return await prisma.subTask.create({
      data: {
        title,
        taskId,
      },
      select: SubTaskRepository.SUBTASK_SELECT,
    });
  }

  async updateSubTask(id: number, taskId: number, data: SubTasksType) {
    return await prisma.subTask.update({
      where: {
        id: id,
        taskId,
      },
      data: data,
      select: SubTaskRepository.SUBTASK_SELECT,
    });
  }

  async deleteSubTask(id: number, taskId: number) {
    return await prisma.subTask.delete({
      where: {
        id: id,
        taskId,
      },
      select: SubTaskRepository.SUBTASK_SELECT,
    });
  }
}

export default SubTaskRepository;
