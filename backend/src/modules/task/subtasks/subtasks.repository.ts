import prisma from "../../../shared/database/prisma.js";
import type { SubTasksType } from "../../../types/api.types.js";
import { Prisma } from "@prisma/client";

type PrismaTx = Prisma.TransactionClient;

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

  async updateSubTask(
    id: number,
    taskId: number,
    data: SubTasksType,
    tx: PrismaTx | typeof prisma = prisma,
  ) {
    const validData: Prisma.SubTaskUpdateInput = {};
    if (data.title !== undefined) validData.title = data.title;
    if (data.isCompleted !== undefined) validData.isCompleted = data.isCompleted;

    return await tx.subTask.update({
      where: {
        id: id,
        taskId,
      },
      data: validData,
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

  async areAllSubtasksCompleted(
    taskId: number,
    tx: PrismaTx | typeof prisma = prisma,
  ): Promise<boolean> {
    const subTasks = await tx.subTask.findMany({
      where: { taskId },
      select: { isCompleted: true },
    });

    if (subTasks.length === 0) return false;
    return subTasks.every((st) => st.isCompleted);
  }
}

export default SubTaskRepository;
