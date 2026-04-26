import SubTaskRepository from "./subtasks.repository.js";
import TaskRepository from "../tasks/tasks.repository.js";
class SubTaskService {
    subTaskRepository;
    taskRepository;
    constructor(subTaskRepository, taskRepository) {
        this.subTaskRepository = subTaskRepository;
        this.taskRepository = taskRepository;
    }
    async getAllSubTasks(taskId) {
        return await this.subTaskRepository.getSubTasksByTask(taskId);
    }
    async createSubTask(taskId, subTaskData) {
        return await this.subTaskRepository.createSubTask(taskId, subTaskData.title);
    }
    async updateSubTask(id, subTaskData, taskId, userId) {
        const updated = await this.subTaskRepository.updateSubTask(id, taskId, subTaskData);
        if (subTaskData.isCompleted && userId) {
            const allCompleted = await this.subTaskRepository.areAllSubtasksCompleted(taskId);
            if (allCompleted) {
                await this.taskRepository.updateTask(String(taskId), { isCompleted: true }, userId);
            }
        }
        return updated;
    }
    async deleteSubTask(id, taskId) {
        return await this.subTaskRepository.deleteSubTask(id, taskId);
    }
}
export default SubTaskService;
