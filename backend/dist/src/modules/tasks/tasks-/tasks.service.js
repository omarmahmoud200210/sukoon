import TaskRepository from "./tasks/tasks.repository.js";
class TasKService {
    taskRepository;
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async getAllCompletedTasks(userId, cursor, limit = 10) {
        const tasks = await this.taskRepository.getAllCompletedTasks(userId, cursor, limit);
        const hasNextPage = tasks.length > limit;
        const results = hasNextPage ? tasks.slice(0, limit) : tasks;
        const nextCursor = hasNextPage ? results[results.length - 1].id : null;
        return {
            tasks: results,
            nextCursor,
            hasNextPage,
        };
    }
    getAllUncompletedTasks(userId) {
        return this.taskRepository.getAllUncompletedTasks(userId);
    }
    getTodaysTasks(userId) {
        return this.taskRepository.getTodaysTasks(userId);
    }
    getUpcomingTasks(userId) {
        return this.taskRepository.getUpcomingTasks(userId);
    }
    getOverdueTasks(userId) {
        return this.taskRepository.getOverdueTasks(userId);
    }
    getTaskById(id, userId) {
        return this.taskRepository.getTaskById(id, userId);
    }
    createTask(taskData, userId) {
        return this.taskRepository.createTask(taskData, userId);
    }
    updateTask(id, taskData, userId) {
        return this.taskRepository.updateTask(id, taskData, userId);
    }
    deleteTask(id, userId) {
        return this.taskRepository.deleteTask(id, userId);
    }
    deleteAllTasks() {
        return this.taskRepository.deleteAllTasks();
    }
}
export default TasKService;
