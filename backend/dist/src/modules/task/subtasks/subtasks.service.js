import SubTaskRepository from "./subtasks.repository.js";
class SubTaskService {
    subTaskRepository;
    constructor(subTaskRepository) {
        this.subTaskRepository = subTaskRepository;
    }
    async getAllSubTasks(taskId) {
        return await this.subTaskRepository.getSubTasksByTask(taskId);
    }
    async createSubTask(taskId, subTaskData) {
        return await this.subTaskRepository.createSubTask(taskId, subTaskData.title);
    }
    async updateSubTask(id, subTaskData, taskId) {
        return await this.subTaskRepository.updateSubTask(id, taskId, subTaskData);
    }
    async deleteSubTask(id, taskId) {
        return await this.subTaskRepository.deleteSubTask(id, taskId);
    }
}
export default SubTaskService;
