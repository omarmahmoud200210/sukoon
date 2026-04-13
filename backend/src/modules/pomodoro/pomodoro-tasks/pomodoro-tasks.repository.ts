import prisma from "../../../shared/database/prisma.js";

class PomodoroTaskRepository {
  private static readonly POMODORO_TASK_SELECT = {
    id: true,
    title: true,
    duration: true,
    isArchived: true,
    userId: true,
    createdAt: true,
  };

  private static readonly AVAILABLE_TASK_SELECT = {
    id: true,
    title: true,
    priority: true,
    dueDate: true,
    listId: true,
  };

  constructor() {}

  async getAllPomodoroTasks(userId: number) {
    return await prisma.pomodoroTask.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: PomodoroTaskRepository.POMODORO_TASK_SELECT,
    });
  }

  async getPomodoroTaskById(id: number, userId: number) {
    return await prisma.pomodoroTask.findUnique({
      where: {
        id,
        userId,
      },
      select: PomodoroTaskRepository.POMODORO_TASK_SELECT,
    });
  }

  async createPomodoroTask(userId: number, title: string, duration: number) {
    return await prisma.pomodoroTask.create({
      data: {
        title,
        duration,
        userId,
      },
      select: PomodoroTaskRepository.POMODORO_TASK_SELECT,
    });
  }

  async updatePomodoroTask(
    id: number,
    userId: number,
    title?: string,
    duration?: number,
    isArchived?: boolean,
  ) {
    return await prisma.pomodoroTask.update({
      where: {
        id,
        userId,
      },
      data: {
        ...(title && { title }),
        ...(duration && { duration }),
        ...(isArchived && { isArchived }),
      },
      select: PomodoroTaskRepository.POMODORO_TASK_SELECT,
    });
  }

  async deletePomodoroTask(id: number, userId: number) {
    return await prisma.pomodoroTask.delete({
      where: {
        id,
        userId,
      },
      select: PomodoroTaskRepository.POMODORO_TASK_SELECT,
    });
  }

  async getAvailableTasks(userId: number) {
    return await prisma.task.findMany({
      where: {
        userId,
        isCompleted: false,
      },
      select: PomodoroTaskRepository.AVAILABLE_TASK_SELECT,
      orderBy: {
        dueDate: "asc",
      },
    });
  }
}

export default PomodoroTaskRepository;
