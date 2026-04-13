import TrashRepository from "./trash.repository.js";
class TrashService {
    trashRepository;
    constructor(trashRepository) {
        this.trashRepository = trashRepository;
    }
    async getAllTasksFromTrash(userId) {
        return await this.trashRepository.getAllTasksFromTrash(userId);
    }
    async permanentlyDeleteTask(taskId, userId) {
        return await this.trashRepository.permanentlyDeleteTask(taskId, userId);
    }
    async undoTaskFromTrash(taskId, userId) {
        return await this.trashRepository.undoTaskFromTrash(taskId, userId);
    }
}
export default TrashService;
