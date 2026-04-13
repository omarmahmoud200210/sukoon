import ListRepository from "./lists.repository.js";
class ListService {
    listRepository;
    constructor(listRepository) {
        this.listRepository = listRepository;
    }
    getAllLists(userId) {
        return this.listRepository.getAllLists(userId);
    }
    getListById(id, userId) {
        return this.listRepository.getListById(id, userId);
    }
    createList(userId, title, color) {
        return this.listRepository.createList(userId, title, color);
    }
    updateList(id, userId, title, color) {
        return this.listRepository.updateList(id, userId, title, color);
    }
    deleteList(id, userId) {
        return this.listRepository.deleteList(id, userId);
    }
}
export default ListService;
