import SubTaskRepository from "./subtasks.repository.js";
class SubTaskService {
    subTaskRepository;
    constructor(subTaskRepository) {
        this.subTaskRepository = subTaskRepository;
    }
    getAllSubTasks(taskId) {
        return this.subTaskRepository.getAllSubTasks(taskId);
    }
    createSubTask(taskId, subTaskData) {
        return this.subTaskRepository.createSubTask(taskId, subTaskData);
    }
    updateSubTask(id, subTaskData, taskId) {
        return this.subTaskRepository.updateSubTask(id, subTaskData, taskId);
    }
    deleteSubTask(id, taskId) {
        return this.subTaskRepository.deleteSubTask(id, taskId);
    }
}
export default SubTaskService;
