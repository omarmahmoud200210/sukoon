import prisma from "../../../shared/database/prisma.js";

class TagRepository {
  private static readonly TAG_SELECT = {
    id: true,
    name: true,
    userId: true,
    createdAt: true,
    _count: {
      select: {
        tasks: true,
      },
    },
  };

  private static readonly TASK_BY_TAG_SELECT = {
    id: true,
    title: true,
    description: true,
    listId: true,
    priority: true,
    isCompleted: true,
    dueDate: true,
    createdAt: true,
    list: {
      select: {
        id: true,
        title: true,
        color: true,
      },
    },
    _count: {
      select: {
        subTasks: true,
        comments: true,
      },
    },
  };

  private static readonly TASK_TAG_SELECT = {
    taskId: true,
    tagId: true,
  };

  constructor() {}

  async tagExistsForUser(userId: number, name: string, excludeId?: number) {
    const tag = await prisma.tag.findFirst({
      where: {
        userId,
        name: {
          equals: name,
          mode: "insensitive",
        },
        ...(excludeId && { id: { not: excludeId } }),
      },
      select: { id: true },
    });
    return !!tag;
  }

  async getAllTags(userId: number) {
    return await prisma.tag.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: TagRepository.TAG_SELECT,
    });
  }

  async getTagById(id: number, userId: number) {
    return await prisma.tag.findUnique({
      where: {
        id,
        userId,
      },
      select: TagRepository.TAG_SELECT,
    });
  }

  async createTag(userId: number, name: string) {
    return await prisma.tag.create({
      data: {
        name,
        userId,
      },
      select: TagRepository.TAG_SELECT,
    });
  }

  async updateTag(id: number, userId: number, name: string) {
    return await prisma.tag.update({
      where: {
        id,
        userId,
      },
      data: {
        name,
      },
      select: TagRepository.TAG_SELECT,
    });
  }

  async deleteTag(id: number, userId: number) {
    return await prisma.tag.delete({
      where: {
        id,
        userId,
      },
      select: TagRepository.TAG_SELECT,
    });
  }

  async addTagToTask(tagId: number, taskId: number, userId: number) {
    // 1. Check ownership in parallel to reduce latency
    const [tag, task] = await Promise.all([
      prisma.tag.findUnique({
        where: { id: tagId, userId },
        select: { id: true },
      }),
      prisma.task.findUnique({
        where: { id: taskId, userId },
        select: { id: true },
      }),
    ]);

    if (!tag || !task) {
      throw new Error("Tag or task not found or doesn't belong to user");
    }

    // 2. Directly attempt the write, relying on the database's unique constraint
    try {
      return await prisma.taskTag.create({
        data: {
          taskId,
          tagId,
        },
        select: TagRepository.TASK_TAG_SELECT,
      });
    } catch (error: any) {
      // P2002 is Prisma's error code for "Unique constraint failed"
      if (error.code === "P2002") {
        throw new Error("Tag already added to this task");
      }
      throw error;
    }
  }

  async removeTagFromTask(tagId: number, taskId: number, userId: number) {
    const tag = await prisma.tag.findUnique({
      where: { id: tagId, userId },
      select: { id: true },
    });

    const task = await prisma.task.findUnique({
      where: { id: taskId, userId },
      select: { id: true },
    });

    if (!tag || !task) {
      throw new Error("Tag or task not found or doesn't belong to user");
    }

    return await prisma.taskTag.delete({
      where: {
        taskId_tagId: {
          taskId,
          tagId,
        },
      },
      select: TagRepository.TASK_TAG_SELECT,
    });
  }

  async getTasksByTag(tagId: number, userId: number) {
    return await prisma.task.findMany({
      where: {
        userId,
        tags: {
          some: {
            tagId,
          },
        },
      },
      select: TagRepository.TASK_BY_TAG_SELECT,
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default TagRepository;
