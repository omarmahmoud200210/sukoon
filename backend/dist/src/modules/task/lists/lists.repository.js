import prisma from "../../../shared/database/prisma.js";
class ListRepository {
    static LIST_SELECT = {
        id: true,
        title: true,
        color: true,
        userId: true,
        createdAt: true,
        _count: {
            select: {
                tasks: true,
            },
        },
    };
    constructor() { }
    async getAllLists(userId) {
        return await prisma.list.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            select: ListRepository.LIST_SELECT,
        });
    }
    async getListById(id, userId) {
        return await prisma.list.findUnique({
            where: {
                id,
                userId,
            },
            select: ListRepository.LIST_SELECT,
        });
    }
    async createList(userId, title, color) {
        return await prisma.list.create({
            data: {
                title,
                color,
                userId,
            },
            select: ListRepository.LIST_SELECT,
        });
    }
    async updateList(id, userId, title, color) {
        return await prisma.list.update({
            where: {
                id,
                userId,
            },
            data: {
                ...(title && { title }),
                ...(color && { color }),
            },
            select: ListRepository.LIST_SELECT,
        });
    }
    async deleteList(id, userId) {
        return await prisma.list.delete({
            where: {
                id,
                userId,
            },
            select: ListRepository.LIST_SELECT,
        });
    }
}
export default ListRepository;
