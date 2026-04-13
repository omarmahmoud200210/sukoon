import prisma from "../../../shared/database/prisma.js";
class TagRepository {
    static TAG_SELECT = {
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
    static TASK_BY_TAG_SELECT = {
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
    static TASK_TAG_SELECT = {
        taskId: true,
        tagId: true,
    };
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
            select: { id: true },
        });
        return !!tag;
    }
    async getAllTags(userId) {
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
    async getTagById(id, userId) {
        return await prisma.tag.findUnique({
            where: {
                id,
                userId,
            },
            select: TagRepository.TAG_SELECT,
        });
    }
    async createTag(userId, name) {
        return await prisma.tag.create({
            data: {
                name,
                userId,
            },
            select: TagRepository.TAG_SELECT,
        });
    }
    async updateTag(id, userId, name) {
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
    async deleteTag(id, userId) {
        return await prisma.tag.delete({
            where: {
                id,
                userId,
            },
            select: TagRepository.TAG_SELECT,
        });
    }
    async addTagToTask(tagId, taskId, userId) {
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
        const existing = await prisma.taskTag.findUnique({
            where: {
                taskId_tagId: {
                    taskId,
                    tagId,
                },
            },
            select: { taskId: true },
        });
        if (existing) {
            throw new Error("Tag already added to this task");
        }
        return await prisma.taskTag.create({
            data: {
                taskId,
                tagId,
            },
            select: TagRepository.TASK_TAG_SELECT,
        });
    }
    async removeTagFromTask(tagId, taskId, userId) {
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
    async getTasksByTag(tagId, userId) {
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
