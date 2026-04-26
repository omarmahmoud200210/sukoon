import SubTaskRepository from "./subtasks.repository.js";
import TaskRepository from "../tasks/tasks.repository.js";
import type { SubTasksType } from "../../../types/api.types.js";

class SubTaskService {
    constructor(
      private subTaskRepository: SubTaskRepository,
      private taskRepository: TaskRepository
    ) {}

    async getAllSubTasks(taskId: number) {
        return await this.subTaskRepository.getSubTasksByTask(taskId);
    }

    async createSubTask(taskId: number, subTaskData: SubTasksType) {
        return await this.subTaskRepository.createSubTask(taskId, subTaskData.title!);
    }

    async updateSubTask(id: number, subTaskData: SubTasksType, taskId: number, userId?: number) {
        const updated = await this.subTaskRepository.updateSubTask(id, taskId, subTaskData);
        
        if (subTaskData.isCompleted && userId) {
            const allCompleted = await this.subTaskRepository.areAllSubtasksCompleted(taskId);
            if (allCompleted) {
                await this.taskRepository.updateTask(String(taskId), { isCompleted: true }, userId);
            }
        }
        
        return updated;
    }

    async deleteSubTask(id: number, taskId: number) {
        return await this.subTaskRepository.deleteSubTask(id, taskId);
    }
}

export default SubTaskService;