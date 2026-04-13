import prisma from "../../shared/database/prisma.js";
class QuranAyaRepository {
    constructor() { }
    async getTodayQuranAya() {
        // timezone
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        return await prisma.quranAya.findFirst({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lt: endOfDay,
                },
            },
        });
    }
    async createQuranAya(aya) {
        return await prisma.quranAya.create({
            data: {
                ayaText: aya.ayaText,
                ayaNumber: aya.ayaNumber,
                surahNumber: aya.surahNumber,
                surahName: aya.surahName,
            },
        });
    }
}
export default QuranAyaRepository;
