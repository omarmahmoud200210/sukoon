import TaskRepository from "./tasks.repository.js";
class TaskService {
    taskRepository;
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    cursorPaginate(tasks, limit) {
        const hasNextPage = tasks.length > limit;
        const results = hasNextPage ? tasks.slice(0, limit) : tasks;
        const nextCursor = hasNextPage ? results[results.length - 1].id : null;
        return {
            data: results,
            nextCursor,
            hasNextPage,
        };
    }
    async getAllCompletedTasks(userId, cursor, limit = 10) {
        const tasks = await this.taskRepository.getAllCompletedTasks(userId, cursor, limit);
        return this.cursorPaginate(tasks, limit);
    }
    async getAllUncompletedTasks(userId, cursor, limit = 10) {
        const tasks = await this.taskRepository.getAllUncompletedTasks(userId, cursor, limit);
        return this.cursorPaginate(tasks, limit);
    }
    async getTodaysTasks(userId, cursor, limit = 10) {
        const tasks = await this.taskRepository.getTodaysTasks(userId, cursor, limit);
        return this.cursorPaginate(tasks, limit);
    }
    async getUpcomingTasks(userId, cursor, limit = 10) {
        const tasks = await this.taskRepository.getUpcomingTasks(userId, cursor, limit);
        return this.cursorPaginate(tasks, limit);
    }
    async getOverdueTasks(userId, cursor, limit = 10) {
        const tasks = await this.taskRepository.getOverdueTasks(userId, cursor, limit);
        return this.cursorPaginate(tasks, limit);
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
    async getAllTrashTasks(userId, cursor, limit = 10) {
        const tasks = await this.taskRepository.getAllTrashTasks(userId, cursor, limit);
        return this.cursorPaginate(tasks, limit);
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
