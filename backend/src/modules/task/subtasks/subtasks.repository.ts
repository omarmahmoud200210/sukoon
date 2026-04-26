import prisma from "../../../shared/database/prisma.js";
import type { SubTasksType } from "../../../types/api.types.js";

class SubTaskRepository {
  private static readonly SUBTASK_SELECT = {
    id: true,
    title: true,
    isCompleted: true,
    taskId: true,
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

  async areAllSubtasksCompleted(taskId: number): Promise<boolean> {
    const subTasks = await prisma.subTask.findMany({
      where: { taskId },
      select: { isCompleted: true },
    });
    
    if (subTasks.length === 0) return false;
    return subTasks.every(st => st.isCompleted);
  }
}

export default SubTaskRepository;
