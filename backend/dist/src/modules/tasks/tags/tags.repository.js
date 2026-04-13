import prisma from "../../../shared/database/prisma.js";
class TagRepository {
    constructor() { }
    async tagExistsForUser(userId, name, excludeId) {
        const tag = await prisma.tag.findFirst({
            where: {
                userId,
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                ...(excludeId && { id: { not: excludeId } }),
            },
        });
        return !!tag;
    }
    getAllTags(userId) {
        return prisma.tag.findMany({
            where: {
                userId,
            },
            include: {
                _count: {
                    select: {
                        tasks: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    getTagById(id, userId) {
        return prisma.tag.findUnique({
            where: {
                id,
                userId,
            },
            include: {
                _count: {
                    select: {
                        tasks: true,
                    },
                },
            },
        });
    }
    createTag(userId, name) {
        return prisma.tag.create({
            data: {
                name,
                userId,
            },
            include: {
                _count: {
                    select: {
                        tasks: true,
                    },
                },
            },
        });
    }
    updateTag(id, userId, name) {
        return prisma.tag.update({
            where: {
                id,
                userId,
            },
            data: {
                name,
            },
            include: {
                _count: {
                    select: {
                        tasks: true,
                    },
                },
            },
        });
    }
    deleteTag(id, userId) {
        return prisma.tag.delete({
            where: {
                id,
                userId,
            },
        });
    }
    // Tag-Task Association Operations
    async addTagToTask(tagId, taskId, userId) {
        // Verify both tag and task belong to the user
        const tag = await prisma.tag.findUnique({
            where: { id: tagId, userId },
        });
        const task = await prisma.task.findUnique({
            where: { id: taskId, userId },
        });
        if (!tag || !task) {
            throw new Error("Tag or task not found or doesn't belong to user");
        }
        // Check if association already exists
        const existing = await prisma.taskTag.findUnique({
            where: {
                taskId_tagId: {
                    taskId,
                    tagId,
                },
            },
        });
        if (existing) {
            throw new Error("Tag already added to this task");
        }
        return prisma.taskTag.create({
            data: {
                taskId,
                tagId,
            },
        });
    }
    async removeTagFromTask(tagId, taskId, userId) {
        // Verify both tag and task belong to the user
        const tag = await prisma.tag.findUnique({
            where: { id: tagId, userId },
        });
        const task = await prisma.task.findUnique({
            where: { id: taskId, userId },
        });
        if (!tag || !task) {
            throw new Error("Tag or task not found or doesn't belong to user");
        }
        return prisma.taskTag.delete({
            where: {
                taskId_tagId: {
                    taskId,
                    tagId,
                },
            },
        });
    }
    getTasksByTag(tagId, userId) {
        return prisma.task.findMany({
            where: {
                userId,
                tags: {
                    some: {
                        tagId,
                    },
                },
            },
            include: {
                list: true,
                _count: {
                    select: {
                        subTasks: true,
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}
export default TagRepository;
