import TaskRepository from "./tasks.repository.js";
class TaskService {
    taskRepository;
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async getAllCompletedTasks(userId) {
        return await this.taskRepository.getAllCompletedTasks(userId);
    }
    async getAllUncompletedTasks(userId) {
        return await this.taskRepository.getAllUncompletedTasks(userId);
    }
    async getTodaysTasks(userId, status) {
        return await this.taskRepository.getTodaysTasks(userId, status);
    }
    async getUpcomingTasks(userId, status) {
        return await this.taskRepository.getUpcomingTasks(userId, status);
    }
    async getOverdueTasks(userId) {
        return await this.taskRepository.getOverdueTasks(userId);
    }
    async getTasksByList(userId, listId, status) {
        return await this.taskRepository.getTasksByList(userId, listId, status);
    }
    async getTasksByTag(userId, tagId, status) {
        return await this.taskRepository.getTasksByTag(userId, tagId, status);
    }
    async getTaskById(id, userId) {
        return await this.taskRepository.getTaskById(id, userId);
    }
    async createTask(taskData, userId) {
        return await this.taskRepository.createTask(userId, taskData);
    }
    async updateTask(id, taskData, userId) {
        return await this.taskRepository.updateTask(id, taskData, userId);
    }
    async deleteTask(id, userId) {
        return await this.taskRepository.deleteTask(id, userId);
    }
    async getAllTrashTasks(userId) {
        return await this.taskRepository.getAllTrashTasks(userId);
    }
    async deleteTrashTask(id, userId) {
        return await this.taskRepository.deleteTrashTask(id, userId);
    }
    async restoreTask(id, userId) {
        return await this.taskRepository.restoreTask(id, userId);
    }
    async deleteAllTasks() {
        return await this.taskRepository.deleteAllTasks();
    }
}
export default TaskService;
