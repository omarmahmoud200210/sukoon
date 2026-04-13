import prisma from "../../shared/database/prisma.js";

class PersonalizedAyaRepo {
    constructor() {}

    async getPersonalizedAya (userId: number) {
        const today = new Date();
        const startOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
        );
        const endOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1,
        );

        return await prisma.personalizedAya.findFirst({
            where: {
                userId,
                createdAt: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
            },
        });
    }

    async createPersonalizedAya (userId: number, ayaData: any, reason: string) {
        return await prisma.personalizedAya.create({
            data:{
                userId,
                ...ayaData,
                reason
            }
        });
    }
}

export default PersonalizedAyaRepo;