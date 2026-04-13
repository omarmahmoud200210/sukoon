import SubTaskRepository from "./subtasks.repository.js";
import type { SubTasksType } from "../../../types/api.types.js";

class SubTaskService {
    constructor(private subTaskRepository: SubTaskRepository) {}

    async getAllSubTasks(taskId: number) {
        return await this.subTaskRepository.getSubTasksByTask(taskId);
    }

    async createSubTask(taskId: number, subTaskData: SubTasksType) {
        return await this.subTaskRepository.createSubTask(taskId, subTaskData.title!);
    }

    async updateSubTask(id: number, subTaskData: SubTasksType, taskId: number) {
        return await this.subTaskRepository.updateSubTask(id, taskId, subTaskData);
    }

    async deleteSubTask(id: number, taskId: number) {
        return await this.subTaskRepository.deleteSubTask(id, taskId);
    }
}

export default SubTaskService;