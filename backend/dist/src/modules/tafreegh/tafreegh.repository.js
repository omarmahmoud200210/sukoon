import prisma from "../../shared/database/prisma.js";
class TafreeghRepository {
    static TAFREEGH_SELECT = {
        id: true,
        content: true,
        userId: true,
        createdAt: true,
    };
    constructor() { }
    async recentTafreeghs(userId) {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        return await prisma.tafreegh.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            select: TafreeghRepository.TAFREEGH_SELECT,
        });
    }
    async getAllTafreeghs(userId) {
        return await prisma.tafreegh.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: TafreeghRepository.TAFREEGH_SELECT,
        });
    }
    async getTafreeghById(id, userId) {
        return await prisma.tafreegh.findUnique({
            where: {
                id,
                userId,
            },
            select: TafreeghRepository.TAFREEGH_SELECT,
        });
    }
    async createTafreegh(userId, content) {
        const existingItems = await prisma.tafreegh.findMany({
            where: { userId },
            select: { id: true },
            orderBy: { id: "asc" },
        });
        let nextId = 1;
        for (const item of existingItems) {
            if (item.id === nextId)
                nextId++;
            else
                break;
        }
        return await prisma.tafreegh.create({
            data: {
                id: nextId,
                content,
                userId,
            },
            select: TafreeghRepository.TAFREEGH_SELECT,
        });
    }
    async updateTafreegh(id, userId, content) {
        return await prisma.tafreegh.update({
            where: {
                id,
                userId,
            },
            data: {
                ...(content && { content }),
            },
            select: TafreeghRepository.TAFREEGH_SELECT,
        });
    }
    async deleteTafreegh(id, userId) {
        return await prisma.tafreegh.delete({
            where: {
                id,
                userId,
            },
            select: TafreeghRepository.TAFREEGH_SELECT,
        });
    }
    async deleteAllTafreegh(userId) {
        return await prisma.tafreegh.deleteMany({
            where: {
                userId,
            },
        });
    }
}
export default TafreeghRepository;
