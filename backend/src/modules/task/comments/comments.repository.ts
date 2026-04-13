import prisma from "../../../shared/database/prisma.js";

class CommentRepository {
  private static readonly USER_SELECT = {
    id: true,
    firstName: true,
    lastName: true,
    avatarUrl: true,
  };

  private static readonly COMMENT_SELECT = {
    id: true,
    content: true,
    taskId: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    user: {
      select: CommentRepository.USER_SELECT,
    },
  };

  constructor() {}

  async getCommentsByTask(taskId: number) {
    return await prisma.comment.findMany({
      where: {
        taskId,
      },
      orderBy: {
        id: "desc",
      },
      select: CommentRepository.COMMENT_SELECT,
    });
  }

  async getCommentById(id: number, taskId: number) {
    return await prisma.comment.findUnique({
      where: {
        id,
        taskId,
      },
      select: CommentRepository.COMMENT_SELECT,
    });
  }

  async createComment(taskId: number, userId: number, content: string) {
    return await prisma.comment.create({
      data: {
        content,
        taskId,
        userId,
      },
      select: CommentRepository.COMMENT_SELECT,
    });
  }

  async updateComment(id: number, taskId: number, userId: number, content: string) {
    return await prisma.comment.update({
      where: {
        id,
        taskId,
        userId,
      },
      data: {
        content,
      },
      select: CommentRepository.COMMENT_SELECT,
    });
  }

  async deleteComment(id: number, taskId: number, userId: number) {
    return await prisma.comment.delete({
      where: {
        id,
        taskId,
        userId,
      },
      select: CommentRepository.COMMENT_SELECT,
    });
  }
}

export default CommentRepository;
