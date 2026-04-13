import ListRepository from "./lists.repository.js";

class ListService {
  constructor(private listRepository: ListRepository) {}

  async getAllLists(userId: number) {
    return await this.listRepository.getAllLists(userId);
  }

  async getListById(id: number, userId: number) {
    return await this.listRepository.getListById(id, userId);
  }

  async createList(userId: number, title: string, color: string) {
    return await this.listRepository.createList(userId, title, color);
  }

  async updateList(id: number, userId: number, title?: string, color?: string) {
    return await this.listRepository.updateList(id, userId, title, color);
  }

  async deleteList(id: number, userId: number) {
    return await this.listRepository.deleteList(id, userId);
  }
}

export default ListService;
