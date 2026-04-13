import prisma from "../../shared/database/prisma.js";
class ListRepository {
    constructor() { }
    getAllLists(userId) {
        return prisma.list.findMany({
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
    getListById(id, userId) {
        return prisma.list.findUnique({
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
    createList(userId, title, color) {
        return prisma.list.create({
            data: {
                title,
                color,
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
    updateList(id, userId, title, color) {
        return prisma.list.update({
            where: {
                id,
                userId,
            },
            data: {
                ...(title && { title }),
                ...(color && { color }),
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
    deleteList(id, userId) {
        return prisma.list.delete({
            where: {
                id,
                userId,
            },
        });
    }
}
export default ListRepository;
