import prisma from "../../shared/database/prisma.js";

class TafreeghRepository {
  private static readonly TAFREEGH_SELECT = {
    id: true,
    content: true,
    userId: true,
    createdAt: true,
  };

  constructor() {}

  async recentTafreeghs(userId: number) {
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

  async getAllTafreeghs(userId: number) {
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

  async getTafreeghById(id: number, userId: number) {
    return await prisma.tafreegh.findUnique({
      where: {
        id,
        userId,
      },
      select: TafreeghRepository.TAFREEGH_SELECT,
    });
  }

  async createTafreegh(userId: number, content: string) {
    return await prisma.tafreegh.create({
      data: {
        content,
        userId,
      },
      select: TafreeghRepository.TAFREEGH_SELECT,
    });
  }

  async updateTafreegh(id: number, userId: number, content?: string) {
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

  async deleteTafreegh(id: number, userId: number) {
    return await prisma.tafreegh.delete({
      where: {
        id,
        userId,
      },
      select: TafreeghRepository.TAFREEGH_SELECT,
    });
  }

  async deleteAllTafreegh(userId: number) {
    return await prisma.tafreegh.deleteMany({
      where: {
        userId,
      },
    });
  }
}

export default TafreeghRepository;
