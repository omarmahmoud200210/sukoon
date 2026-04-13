import ListRepository from "./lists.repository.js";
class ListService {
    listRepository;
    constructor(listRepository) {
        this.listRepository = listRepository;
    }
    async getAllLists(userId) {
        return await this.listRepository.getAllLists(userId);
    }
    async getListById(id, userId) {
        return await this.listRepository.getListById(id, userId);
    }
    async createList(userId, title, color) {
        return await this.listRepository.createList(userId, title, color);
    }
    async updateList(id, userId, title, color) {
        return await this.listRepository.updateList(id, userId, title, color);
    }
    async deleteList(id, userId) {
        return await this.listRepository.deleteList(id, userId);
    }
}
export default ListService;
