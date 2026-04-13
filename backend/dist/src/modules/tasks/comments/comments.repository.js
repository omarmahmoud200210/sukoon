import prisma from "../../../shared/database/prisma.js";
class CommentRepository {
    constructor() { }
    getAllComments(taskId) {
        return prisma.comment.findMany({
            where: {
                taskId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: {
                id: "desc",
            },
        });
    }
    getCommentById(id, taskId) {
        return prisma.comment.findUnique({
            where: {
                id,
                taskId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }
    createComment(taskId, userId, content) {
        return prisma.comment.create({
            data: {
                content,
                taskId,
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }
    updateComment(id, taskId, userId, content) {
        return prisma.comment.update({
            where: {
                id,
                taskId,
                userId,
            },
            data: {
                content,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }
    deleteComment(id, taskId, userId) {
        return prisma.comment.delete({
            where: {
                id,
                taskId,
                userId,
            },
        });
    }
}
export default CommentRepository;
